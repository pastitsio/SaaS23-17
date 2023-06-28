FROM amancevice/pandas:2.0.2-slim

ARG APP_PORT

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE $APP_PORT

CMD ["python3", "app.py"]