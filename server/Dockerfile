FROM python:3.8-alpine
ENV PYTHONUNBUFFERED 1
WORKDIR /server
COPY requirements.txt requirements.txt
RUN apk add -u gcc musl-dev
RUN pip3 install -r requirements.txt
COPY . .