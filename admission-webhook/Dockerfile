FROM golang:1.19 AS build

ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=0
WORKDIR /work
COPY go.mod go.sum /work/
RUN go mod download -x
COPY . /work
RUN go build -o bin/admission-webhook .

FROM alpine AS run
COPY --from=build /work/bin/admission-webhook /usr/local/bin/
CMD ["/bin/sh", "-c","admission-webhook -console-url ${MGMT_CONSOLE_URL} -api-key ${DEEPFENCE_KEY}"]