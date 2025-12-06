☀️ GDASH - Sistema de Monitoramento Climático Inteligente

Desafio Técnico Full-Stack 2025/02

Uma solução completa de engenharia de dados e visualização para monitoramento climático em tempo real. O sistema coleta dados meteorológicos, processa-os através de uma fila de mensagens distribuída e apresenta insights gerados por IA num dashboard moderno.

Aqui o video solicitado para o desafio --->  https://youtu.be/L9OlZqS1NmQ

🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura de microsserviços orientada a eventos, totalmente orquestrada via Docker:

graph LR
  A[Coletor Python] -- JSON --> B(RabbitMQ)
  B -- Fila --> C[Worker Go]
  C -- POST --> D[API NestJS]
  D -- Persistência --> E[(MongoDB)]
  D -- Dados/Insights --> F[Frontend React]


🧩 Componentes:

Service Collector (Python): Consulta a API Open-Meteo a cada minuto e publica dados normalizados no RabbitMQ.

Message Broker (RabbitMQ): Garante o desacoplamento e a persistência das mensagens entre a coleta e o processamento.

Service Worker (Go): Consumidor de alta performance que processa mensagens da fila e envia para a API com política de retry exponencial.

Backend API (NestJS): Núcleo do sistema. Gerencia autenticação (JWT), persistência (MongoDB), regras de negócio e lógica de "IA Simbólica" para insights.

Frontend (React + Vite): Dashboard interativo com design moderno (Glassmorphism/Tailwind CSS), gráficos em tempo real e integração com APIs externas.

🚀 Como Rodar o Projeto

Pré-requisitos

Docker e Docker Compose instalados e a rodar.

Passo a Passo

Clone o repositório:

git clone [https://github.com/SEU-USUARIO/desafio-gdash-2025.git](https://github.com/SEU-USUARIO/desafio-gdash-2025.git)
cd desafio-gdash-2025


Inicie a aplicação:
Execute o comando abaixo na raiz do projeto. O Docker irá construir as imagens e iniciar todos os 6 serviços.

docker compose up --build


Aguarde alguns instantes para que o RabbitMQ e o MongoDB inicializem completamente.

Acesse o Dashboard:
Abra o navegador em: http://localhost

Logs de Clima em: http://localhost:3000/api/weather/logs

Insights de IA em: http://localhost:3000/api/weather/insights

🔐 Acesso e Credenciais

O sistema possui autenticação JWT. Um utilizador administrador é criado automaticamente na primeira execução (Seed).

Email: admin@example.com

Senha: 123456

✨ Funcionalidades Implementadas

Essenciais

[x] Pipeline de Dados Real-Time: Coleta (Python) $\to$ Fila $\to$ Processamento (Go) $\to$ API.

[x] Persistência: Armazenamento de logs históricos no MongoDB.

[x] Dashboard Moderno: Interface responsiva, com atualização automática (polling) e design profissional.

[x] Autenticação: Sistema de Login seguro com JWT e proteção de rotas.

Diferenciais e Bónus

[x] Insights de IA: O sistema analisa automaticamente tendências de temperatura e emite alertas de risco (Calor/Frio extremo, Chuva).

[x] Exportação de Dados: Funcionalidade completa para baixar o histórico em formato CSV.

[x] Integração PokéAPI (Contextual): Um módulo divertido que sugere um Pokémon baseado no clima e hora do dia em tempo real.

[x] Resiliência: O Worker em Go implementa sistema de retry para garantir a entrega de dados.

[x] Qualidade de Código: Testes unitários implementados no Backend (Jest).

🧪 Como Rodar os Testes

O projeto inclui testes unitários para a lógica de geração de Insights. Para rodá-los dentro do ambiente Docker:

# Certifique-se que os containers estão rodando
docker compose exec backend-nestjs npm test


🛠️ Stack Tecnológica

Frontend

React

Vite, TypeScript, Tailwind CSS, Lucide React

Backend

NestJS

TypeScript, Mongoose, Passport (JWT), Jest

Worker

Go (Golang)

AMQP (RabbitMQ), Net/HTTP

Coleta

Python 3.11

Requests, Pika

Dados

MongoDB

NoSQL Document Store

Mensageria

RabbitMQ

Message Broker

Infra

Docker

Docker Compose

Desenvolvido para o Processo Seletivo GDASH 2025/2