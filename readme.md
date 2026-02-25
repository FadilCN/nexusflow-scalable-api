# NexusFlow Scalable System

> A robust, high-performance Node.js API built with a distributed systems architecture, featuring Redis caching, RabbitMQ message queuing, Nginx reverse-proxying, and full Docker containerization.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

## 📌 Overview

NexusFlow is a production-ready backend infrastructure designed for high availability and scalability. Instead of a traditional monolithic approach, this system offloads heavy computations to **RabbitMQ**, optimizes response times via **Redis**, and secures routes with **JWT & Bcrypt**—all sitting safely behind an **Nginx** reverse proxy.

## 🏗 System Architecture

* **Nginx:** Acts as a reverse proxy, handling incoming traffic and routing it securely to the Node.js API.
* **Node.js / Express:** The core application engine handling business logic, authentication, and API routing.
* **MongoDB:** Primary NoSQL database for persistent, scalable data storage.
* **Redis:** In-memory data store utilized for high-speed caching and reducing database load.
* **RabbitMQ:** Message broker for asynchronous task processing and reliable queue management.
* **Docker / Docker Compose:** Fully containerized environment ensuring seamless deployment and cross-platform consistency.

## 📂 Project Structure

```text
📦 nexusflow-scalable-api
 ┣ 📂 controllers   # Route logic and request handling
 ┣ 📂 database      # MongoDB connection and config
 ┣ 📂 middleware    # Custom middleware (JWT auth, error handling)
 ┣ 📂 models        # Mongoose database schemas
 ┣ 📂 nginx         # Nginx reverse proxy configuration
 ┣ 📂 pages         # Frontend/HTML view assets
 ┣ 📂 rabbitmq      # Publisher/Consumer queue logic
 ┣ 📂 redis         # Caching implementation and config
 ┣ 📂 routes        # API endpoint definitions
 ┣ 📜 Dockerfile    # Node.js container build instructions
 ┣ 📜 docker-compose.yaml # Multi-container orchestration
 ┣ 📜 index.js      # Application entry point
 ┗ 📜 package.json  # Node dependencies

```
## 🔐 Key Features
Secure Authentication: Passwords hashed with bcrypt and stateless session management via JWT.

Asynchronous Processing: Heavy tasks are pushed to RabbitMQ to keep the main event loop non-blocking.

Data Caching: Frequently accessed data is cached via Redis for sub-millisecond response times.

Orchestration: Easily spin up the entire infrastructure (DB, Cache, Queue, Server, Proxy) with a single command.

## 🔐 Security & Performance Implementation

The authentication layer of **NexusFlow** is built with a security-first mindset, leveraging industry-standard protocols and high-speed data handling.

### 🛡️ Robust Authentication Flow

* **Bcrypt Password Hashing:** User security is prioritized by never storing plain-text passwords. We use `bcrypt` with a salt factor of **12** to ensure one-way cryptographic hashing, protecting against rainbow table and brute-force attacks.
* **JSON Web Tokens (JWT):** Secure, stateless session management via JWT. Upon login, the server issues a signed token containing the user’s identity and role-based permissions, allowing for scalable authentication across multiple microservices.
* **HttpOnly Cookies:** Tokens are delivered via `HttpOnly` and `Secure` cookies. This prevents Cross-Site Scripting (XSS) attacks by ensuring the token cannot be accessed via client-side JavaScript.

### ⚡ Performance & Scalability

* **Redis Layered Caching:** To minimize expensive MongoDB lookups, the `signinController` implements a **Cache-Aside** pattern. User profiles are cached in Redis with a 1-hour TTL (Time-To-Live), drastically reducing latency for returning users.
* **Token Blacklisting:** For secure logouts, we implement a **Blacklist strategy** using Redis. When a user logs out, their current JWT is stored in a distributed blacklist until it expires, preventing "replay" attacks using old tokens.
* **Asynchronous Tasks (RabbitMQ):** Post-registration events, such as sending "Welcome Emails," are offloaded to **RabbitMQ**. This ensures the user receives a response instantly without waiting for external SMTP servers to process the request.

---

### 🔄 Backend Logic Flow

1.  **Registration:** `Request` → `Bcrypt Hash` → `MongoDB` → `RabbitMQ (Email Job)` → `Response`
2.  **Login:** `Request` → `Check Redis Cache` → `Fallback to MongoDB` → `Bcrypt Compare` → `Issue JWT` → `Response`
3.  **Logout:** `JWT Token` → `Add to Redis Blacklist` → `Clear Cookie` → `Response`

## 🚀 Getting Started
Prerequisites
Make sure you have Docker and Docker Compose installed on your machine.

1. Installation
Clone the repository:

```Bash
git clone [https://github.com/YourUsername/nexusflow-scalable-api.git](https://github.com/YourUsername/nexusflow-scalable-api.git)
cd nexusflow-scalable-api
```

2. Create your environment file:
Create a .env file in the root directory and add your configurations:

```Code snippet

JWT_KEY = YOUR KEY
MONGO_URI = mongodb+srv://<USER>:<PASS>
```

3. Spin up the infrastructure:

```Bash
docker-compose up -d --build
```
The API will now be accessible via the Nginx proxy at http://localhost.


4. 🛠 Stopping the Services
To stop and remove the containers, networks, and volumes gracefully:

```Bash
docker-compose down
```