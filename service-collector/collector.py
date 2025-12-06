import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
import json
import time
import pika
import os

RABBITMQ_HOST = os.environ.get('RABBITMQ_HOST', 'rabbitmq')
RABBITMQ_QUEUE = os.environ.get('RABBITMQ_QUEUE', 'weather_logs_queue')
COLLECTION_INTERVAL_SECONDS = int(os.environ.get('COLLECTION_INTERVAL_SECONDS', 3600))

LATITUDE = -29.9433
LONGITUDE = -51.7181

cache_session = requests_cache.CachedSession('.cache', expire_after=COLLECTION_INTERVAL_SECONDS)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

URL = "https://api.open-meteo.com/v1/forecast"
PARAMS = {
    "latitude": LATITUDE,
    "longitude": LONGITUDE,
    "current": ["temperature_2m", "apparent_temperature", "precipitation", "rain", "cloud_cover", "wind_speed_10m"],
    "timezone": "America/Sao_Paulo",
}

def publish_to_rabbitmq(data: dict):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=RABBITMQ_HOST,
            )
        )
        channel = connection.channel()

        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)

        message_body = json.dumps(data)

        channel.basic_publish(
            exchange='',
            routing_key=RABBITMQ_QUEUE,
            body=message_body,
            properties=pika.BasicProperties(
                delivery_mode=pika.DeliveryMode.Persistent  
            )
        )
        print(f"✅ [Collector] Dados de clima enviados para o RabbitMQ.")
        print(f"   Payload Time: {data.get('timestamp')}")

        connection.close()

    except pika.exceptions.AMQPConnectionError as e:
        print(
            f"❌ [Collector] Erro ao conectar ou publicar no RabbitMQ. Verifique se o serviço '{RABBITMQ_HOST}' está ativo.")
        print(f"   Erro: {e}")
    except Exception as e:
        print(f"❌ [Collector] Erro inesperado ao enviar: {e}")

def collect_and_send():
    print("--------------------------------------------------")
    print(f"⏳ [Collector] Iniciando coleta de dados...")

    try:
        responses = openmeteo.weather_api(URL, params=PARAMS)

        response = responses[0]
        current = response.Current()

        current_data = {
            "timestamp": pd.to_datetime(current.Time(), unit="s").isoformat(),
            "latitude": response.Latitude(),
            "longitude": response.Longitude(),
            "elevation": response.Elevation(),

            "temperature_c": current.Variables(0).Value(),  # temperature_2m
            "apparent_temperature_c": current.Variables(1).Value(),  # apparent_temperature
            "precipitation_mm": current.Variables(2).Value(),  # precipitation
            "rain_mm": current.Variables(3).Value(),  # rain
            "cloud_cover_percent": current.Variables(4).Value(),  # cloud_cover
            "wind_speed_kph": current.Variables(5).Value(),  # wind_speed_10m

            "source": "OpenMeteo"
        }

        print(f"✅ [Collector] Dados coletados com sucesso para {current_data['timestamp']}")

        publish_to_rabbitmq(current_data)

    except Exception as e:
        print(f"❌ [Collector] Falha na coleta da API Open-Meteo. Erro: {e}")


def start_collector():

    startup_delay = 20
    print(f"--- Serviço Coletor GDASH iniciado ---")
    print(f"Aguardando {startup_delay}s para o RabbitMQ iniciar e estabilizar...")
    time.sleep(startup_delay)

    print(f"Coletando a cada {COLLECTION_INTERVAL_SECONDS} segundos...")

    while True:
        collect_and_send()
        print(f"Dormindo por {COLLECTION_INTERVAL_SECONDS} segundos...")
        time.sleep(COLLECTION_INTERVAL_SECONDS)


if __name__ == "__main__":
    try:
        import numpy
    except ImportError:
        pass

    start_collector()