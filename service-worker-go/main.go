package main

import (
	"bytes"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	RABBITMQ_URL   = os.Getenv("RABBITMQ_URL")
	QUEUE_NAME     = os.Getenv("RABBITMQ_QUEUE")
	NESTJS_API_URL = os.Getenv("NESTJS_API_URL")

	MAX_RETRIES     = 5
	RETRY_BASE_TIME = 2 * time.Second
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %v", msg, err)
	}
}

func sendToNestJS(messageBody []byte) error {
	client := http.Client{Timeout: 10 * time.Second}
	var lastErr error

	for i := 0; i < MAX_RETRIES; i++ {
		log.Printf("   [Worker] Tentativa %d/%d: Enviando dados para NestJS...", i+1, MAX_RETRIES)

		req, err := http.NewRequest("POST", NESTJS_API_URL, bytes.NewBuffer(messageBody))
		if err != nil {
			lastErr = fmt.Errorf("erro ao criar requisição: %v", err)
			break
		}
		req.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			lastErr = fmt.Errorf("erro de rede/conexão: %v", err)

			wait := RETRY_BASE_TIME * time.Duration(1<<i)
			log.Printf("   [Worker] Falha no envio. Esperando %v antes de tentar novamente.", wait)
			time.Sleep(wait)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			log.Printf("   [Worker] ✅ POST bem-sucedido. Status: %d", resp.StatusCode)
			return nil
		}

		lastErr = fmt.Errorf("falha no servidor NestJS. Status: %d", resp.StatusCode)

		if resp.StatusCode >= 500 {
			wait := RETRY_BASE_TIME * time.Duration(1<<i)
			log.Printf("   [Worker] Erro temporário (5xx). Esperando %v antes de tentar novamente.", wait)
			time.Sleep(wait)
			continue
		}

		log.Printf("   [Worker] Erro permanente (4xx). Não tentaremos novamente.")
		break
	}

	return fmt.Errorf("falha final no envio após %d tentativas: %w", MAX_RETRIES, lastErr)
}

func main() {
	if RABBITMQ_URL == "" || QUEUE_NAME == "" || NESTJS_API_URL == "" {
		log.Fatalf("ERRO: Variáveis de ambiente RABBITMQ_URL, RABBITMQ_QUEUE e NESTJS_API_URL não configuradas. Verifique o docker-compose.yml.")
	}

	log.Printf("--- Go Worker GDASH iniciado ---")
	log.Printf("  API Destino: %s", NESTJS_API_URL)

	var conn *amqp.Connection
	var err error
	for i := 0; i < 5; i++ {
		conn, err = amqp.Dial(RABBITMQ_URL)
		if err == nil {
			break
		}
		log.Printf("❌ [Worker] Falha ao conectar ao RabbitMQ. Tentando novamente em 5 segundos...")
		time.Sleep(5 * time.Second)
	}
	failOnError(err, "Falha na conexão final com RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir o canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		QUEUE_NAME,
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar a fila")

	err = ch.Qos(1, 0, false)
	failOnError(err, "Falha ao configurar QoS")

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar o consumidor")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("--------------------------------------------------")
			log.Printf("➡️ [Worker] Mensagem recebida.")

			err := sendToNestJS(d.Body)

			if err != nil {
				log.Printf("❌ [Worker] Falha fatal no processamento após retries: %v", err)
				d.Nack(false, true)
			} else {
				log.Printf("✅ [Worker] Dados processados e confirmados (ACK).")
				d.Ack(false)
			}
		}
	}()

	log.Printf(" [*] Worker Go aguardando mensagens. Para sair, pare o contêiner.")
	<-forever
}
