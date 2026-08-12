# 🏀 Real-Time NBA Analytics

A distributed backend system for real-time analytics on NBA data — built with **Node.js**, **Express**, **PostgreSQL**, **Redis**, **Kafka** and **Docker Compose**.

This project implements a real-world microservices architecture using NBA data as the domain. Each service is independently deployable, owns its own database tables, communicates asynchronously via Kafka, and caches aggressively with Redis. An API Gateway sits in front of all services, handling authentication, rate limiting, and routing.

A distributed backend, not a real-time push system — Kafka handles asynchronous inter-service messaging (e.g. game events feeding the notification service), rather than pushing live updates to connected clients.

Built as a learning project to understand distributed systems with real, meaningful data.

---

## 🏗️ Architecture

```
                     Client
                       │
                       ▼
              ┌─────────────────┐
              │   API Gateway   │
              │  Auth · Rate    │
              │  Limit · Route  │
              └────────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 ┌─────────────┐ ┌──────────────────┐  ...
 │Player-service│ │Notifications-svc │
 └──────┬───────┘ └────────┬─────────┘
        │                  │
        ▼                  ▼
   PostgreSQL           Kafka
   + Redis          (game.events)
                          │
                          ▼
                  Notifications Service
                  (consumes & processes)
```

Each service owns its own PostgreSQL tables and communicates with the rest of the system asynchronously through Kafka rather than direct service-to-service calls, keeping services decoupled and independently deployable.

---

## 🧩 Services

### API Gateway
Sits in front of all services and handles:
- **Authentication** — JWT-based, with refresh token rotation
- **Rate limiting** — Redis-backed sliding-window limiting
- **Reverse-proxy routing** — forwards requests to the correct downstream service

### Player Service
Owns player data and exposes it to the rest of the system, backed by PostgreSQL with Redis caching for frequently accessed data.

### Notifications Service
Consumes events (`game.events`) from Kafka and processes them asynchronously, decoupling notification handling from the services that generate the events.

---

## 🛠️ Tech Stack

- **Node.js** + **Express** — service runtime
- **PostgreSQL** — per-service relational storage
- **Redis** — caching + rate limiting
- **Kafka** — asynchronous inter-service messaging
- **JWT** — authentication with refresh token rotation
- **Docker Compose** — multi-container orchestration

---

## 🗂️ Project Structure

```
Real-time-NBA-analytics/
├── api-gateway/
├── Player-service/
├── Notifications-service/
├── docker-compose.yml
├── package.json
└── package-lock.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose installed
- Node.js

### Run with Docker Compose

```bash
git clone https://github.com/Bronyxx/Real-time-NBA-analytics.git
cd Real-time-NBA-analytics
docker compose up --build
```

---

## 📌 Future Improvements

- [ ] Expand service coverage (additional NBA data domains)
- [ ] Add integration tests across service boundaries
- [ ] Add a metrics dashboard for Kafka consumer lag and cache hit rates
- [ ] API documentation (OpenAPI/Swagger)

---

## 👤 Author

**Sreehari S** — [github.com/Bronyxx](https://github.com/Bronyxx)
