FROM golang:1.16-alpine

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY *.go ./

# Build
RUN go build -o /backend

# Add wait-for-it
COPY wait-for-it.sh wait-for-it.sh 
RUN chmod +x wait-for-it.sh

# install bash cuz alpine doesn't have bash
RUN apk update && apk add bash

# Run
# wait for mysql endpoint to load before running /backend
# https://medium.com/@krishnaregmi/wait-for-it-docker-compose-f0bac30f3357
CMD ["./wait-for-it.sh" , "mysql:3306" , "--strict" , "--timeout=300" , "--" , "/backend"]
