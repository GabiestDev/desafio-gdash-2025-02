FROM golang:1.21.0-alpine AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

ENV TZ America/Sao_Paulo

COPY --from=builder /app/main .

CMD ["./main"]