package handler

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/deepfence/ThreatMapper/deepfence_server/model"
	"github.com/deepfence/ThreatMapper/deepfence_utils/directory"
	"github.com/deepfence/ThreatMapper/deepfence_utils/log"
	postgresql_db "github.com/deepfence/ThreatMapper/deepfence_utils/postgresql/postgresql-db"
	"github.com/deepfence/ThreatMapper/deepfence_utils/utils"
	"github.com/go-chi/jwtauth/v5"
	httpext "github.com/go-playground/pkg/v5/net/http"
	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
	"net/http"
)

const (
	MaxPostRequestSize = 100000 // 100 KB
	DefaultNamespace   = "default"
)

func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var registerRequest model.UserRegisterRequest
	defer r.Body.Close()
	err := httpext.DecodeJSON(r, httpext.NoQueryParams, MaxPostRequestSize, &registerRequest)
	if err != nil {
		httpext.JSON(w, http.StatusBadRequest, model.Response{Success: false})
		return
	}
	err = h.Validator.Struct(registerRequest)
	if err != nil {
		errorFields := model.ParseValidatorError(err.Error())
		httpext.JSON(w, http.StatusBadRequest, model.Response{Success: false, ErrorFields: &errorFields})
		return
	}
	ctx := directory.NewGlobalContext()
	pgClient, err := directory.PostgresClient(ctx)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	consoleUrl, err := utils.RemoveURLPath(registerRequest.ConsoleURL)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	consoleUrlSetting := model.Setting{
		Key: model.ConsoleURLSettingKey,
		Value: &model.SettingValue{
			Label:       "Deepfence Console URL",
			Value:       consoleUrl,
			Description: "Deepfence Console URL used for sending emails with links to the console",
		},
		IsVisibleOnUi: true,
	}
	_, err = consoleUrlSetting.Create(ctx, pgClient)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	companies, err := pgClient.CountCompanies(ctx)
	if err != nil || companies > 0 {
		httpext.JSON(w, http.StatusForbidden, model.Response{Success: false, Message: "Cannot register. Please contact your administrator for an invite"})
		return
	}
	emailDomain, _ := utils.GetEmailDomain(registerRequest.Email)
	c := model.Company{
		Name:        registerRequest.Company,
		EmailDomain: emailDomain,
		Namespace:   DefaultNamespace, //TODO: SaaS namespace
	}
	company, err := c.Create(ctx, pgClient)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	c.ID = company.ID
	role, err := pgClient.GetRoleByName(ctx, model.AdminRole)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	user := model.User{
		FirstName:           registerRequest.FirstName,
		LastName:            registerRequest.LastName,
		Email:               registerRequest.Email,
		Company:             registerRequest.Company,
		CompanyID:           company.ID,
		IsActive:            true,
		Role:                role.Name,
		RoleID:              role.ID,
		PasswordInvalidated: registerRequest.IsTemporaryPassword,
	}
	user.Groups, err = c.GetDefaultUserGroupMap(ctx, pgClient)
	if err != nil {
		log.Error().Msg("c.GetDefaultUserGroup: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	err = user.SetPassword(registerRequest.Password)
	if err != nil {
		log.Error().Msg("user.SetPassword: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	createdUser, err := user.Create(ctx, pgClient)
	if err != nil {
		log.Error().Msg("user.Create: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	user.ID = createdUser.ID
	apiToken := model.ApiToken{
		ApiToken:        utils.NewUUID(),
		Name:            user.Email,
		CompanyID:       company.ID,
		RoleID:          role.ID,
		CreatedByUserID: user.ID,
	}
	defaultGroup, err := c.GetDefaultUserGroup(ctx, pgClient)
	if err != nil {
		log.Error().Msg("GetDefaultUserGroup: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	apiToken.GroupID = defaultGroup.ID
	_, err = apiToken.Create(ctx, pgClient)
	if err != nil {
		log.Error().Msg("apiToken.Create: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	accessTokenResponse, err := user.GetAccessToken(h.TokenAuth, model.GrantTypePassword)
	if err != nil {
		log.Error().Msg("GetAccessToken: " + err.Error())
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	httpext.JSON(w, http.StatusOK, model.Response{Success: true, Data: accessTokenResponse})
}

func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	user, statusCode, _, _, err := h.GetUserFromJWT(r.Context())
	if err != nil {
		httpext.JSON(w, statusCode, model.Response{Success: false, Message: err.Error()})
		return
	}
	httpext.JSON(w, http.StatusOK, model.Response{Success: true, Data: user})
}

func (h *Handler) GenerateXlsxReport(w http.ResponseWriter, r *http.Request) {
	user, statusCode, _, _, err := h.GetUserFromJWT(r.Context())
	//res := []controls.Action{}
	if err != nil {
		httpext.JSON(w, statusCode, model.Response{Success: false, Message: err.Error()})
		return
	}

	client, err := directory.Neo4jClient(r.Context())
	if err != nil {
		log.Error().Msg("some error 1")
		return
	}

	session, err := client.Session(neo4j.AccessModeWrite)
	if err != nil {
		log.Error().Msg("some error 2")
		return
	}
	defer session.Close()

	tx, err := session.BeginTransaction()
	if err != nil {
		log.Error().Msg("some error 3")
		return
	}
	defer tx.Close()

	rq, err := tx.Run("MATCH (n:Secret {host_name: 'mukul-test'})  return n", map[string]interface{}{})

	if err != nil {
		log.Error().Msg("some error 3")
		return
	}

	records, err := rq.Collect()

	if err != nil {
		log.Error().Msg("some error 3")
		return
	}

	for _, record := range records {
		//var action controls.Action
		//if record.Values[0] == nil {
		//	log.Error().Msgf("Invalid neo4j trigger_action result, skipping")
		//	continue
		//}
		fmt.Println(record.Values[0])
		fmt.Println("mukul")
		fmt.Println(*record)
		//err := json.Unmarshal([]byte(record.Values[0].(string)), &action)
		//if err != nil {
		//	log.Error().Msgf("Unmarshal of action failed: %v", err)
		//	continue
		//}
		//res = append(res, action)
	}

	httpext.JSON(w, http.StatusOK, model.Response{Success: true, Data: user})
}

func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	return
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	return
}

func (h *Handler) GetApiTokens(w http.ResponseWriter, r *http.Request) {
	user, statusCode, ctx, pgClient, err := h.GetUserFromJWT(r.Context())
	if err != nil {
		httpext.JSON(w, statusCode, model.Response{Success: false, Message: err.Error()})
		return
	}
	apiTokens, err := pgClient.GetApiTokensByUser(ctx, user.ID)
	if err != nil {
		httpext.JSON(w, http.StatusInternalServerError, model.Response{Success: false, Message: err.Error()})
		return
	}
	httpext.JSON(w, http.StatusOK, model.Response{Success: true, Data: apiTokens})
}

func (h *Handler) GetUserFromJWT(requestContext context.Context) (*model.User, int, context.Context, *postgresql_db.Queries, error) {
	_, claims, err := jwtauth.FromContext(requestContext)
	if err != nil {
		return nil, http.StatusBadRequest, requestContext, nil, err
	}
	userId, err := utils.GetInt64ValueFromInterfaceMap(claims, "user_id")
	if err != nil {
		return nil, http.StatusInternalServerError, requestContext, nil, err
	}
	user := model.User{ID: userId}
	ctx := directory.NewGlobalContext()
	pgClient, err := directory.PostgresClient(ctx)
	err = user.LoadFromDbByID(ctx, pgClient)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, http.StatusNotFound, ctx, pgClient, errors.New("user not found")
	} else if err != nil {
		return nil, http.StatusInternalServerError, ctx, pgClient, err
	}
	return &user, http.StatusOK, ctx, pgClient, nil
}
