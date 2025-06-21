FROM python:3.11-alpine

ARG HTTP_HOST
ARG HTTP_PORT

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV HTTP_HOST=$HTTP_HOST
ENV HTTP_PORT=$HTTP_PORT

CMD ["sh", "-c", "uvicorn main:app --proxy-headers --forwarded-allow-ips=* --host ${HTTP_HOST} --port ${HTTP_PORT}"]