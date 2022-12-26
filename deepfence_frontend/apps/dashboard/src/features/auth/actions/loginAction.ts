import { redirect } from 'react-router-dom';

import { authenticationApi } from '../../../api/api';
import { ModelResponse, ResponseError } from '../../../api/generated';
import storage from '../../../utils/storage';

export const loginAction = async ({
  request,
}: {
  request: Request;
  params: Record<string, unknown>;
}) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  try {
    const data = await authenticationApi.login({
      modelLoginRequest: body,
    });
    const access_token = data?.data?.access_token ?? '';
    const refresh_token = data?.data?.refresh_token ?? '';
    storage.setAuth({ isLogin: true, access_token, refresh_token });
  } catch (e) {
    const error = e as ResponseError;
    const response: ModelResponse = await error.response.json();
    return {
      error_fields: response.error_fields,
      message: response.message,
    };
  }

  return redirect('/topology', 302);
};
