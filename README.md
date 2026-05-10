# Building a distributed backend system for real time analytics on NBA data
buit with Node.js, Express, PostgreSQL, Redis, RabbitMQ, and Docker.

## Overview

This project implements a real-world microservices architecture using NBA data as the domain. Each service is independently deployable, owns its own database tables, communicates asynchronously via RabbitMQ, and caches aggressively with Redis. An API Gateway sits in front of all services handling authentication, rate limiting, and routing.

Built as a learning project to understand distributed systems with real, meaningful data.
