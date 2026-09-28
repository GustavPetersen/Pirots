FROM golang:1-alpine AS base
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

# Development build and serve
FROM base AS development
COPY . .
ENTRYPOINT [ "go", "run", "./cmd/server/main.go"]

# Production build
FROM base AS build
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server ./cmd/server

# Production serve
FROM gcr.io/distroless/static-debian12:nonroot AS production
COPY --from=build /server /server
EXPOSE 3000
ENTRYPOINT ["/server"]
