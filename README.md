# ApplyFlow - getting to flow state in your job apps

![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![React](https://img.shields.io/badge/Frontend-React-blue)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-yellow)

## ✨ Applyflow

Applyflow is a fully serverless application that empowers job seekers to manage applications, track progress, upload resumes, and receive smart follow-up reminders — all within a scalable cloud-native architecture built on AWS.


---

## 🧰 Tech Stack

| Layer         | Stack                              |
|---------------|-------------------------------------|
| Frontend      | React + TailwindCSS                |
| Hosting       | AWS Amplify / S3 (Static SPA)       |
| Backend       | Node.js (Express) in Docker        |
| Infra         | EC2 (Ubuntu) + NGINX reverse proxy |
| Auth          | AWS Cognito (JWT sessions)         |
| Database      | DynamoDB (user-scoped jobs)        |
| File Storage  | AWS S3 (Resume uploads)            |
| Caching       | Redis (Upstash or ElastiCache)     |
| CI/CD         | GitHub Actions (Frontend + Backend)|
| Monitoring    | AWS CloudWatch                     |

---

## 🔐 Authentication Flow

- Cognito manages signup/login/session
- Frontend stores JWT securely
- NGINX proxies requests to Docker container
- Backend validates JWT from `Authorization` header
- Data access is scoped per user via `user_id` claims

---

## 📂 DynamoDB Schema

| Field         | Type    | Notes                          |
|---------------|---------|--------------------------------|
| `job_id`      | string  | Primary key                    |
| `user_id`     | string  | Used for user scoping          |
| `company`     | string  |                                |
| `title`       | string  |                                |
| `status`      | string  | Applied, Interview, Offer, etc |
| `applied_date`| string  | ISO format                     |
| `notes`       | string  | Freeform                       |

---

## 🐳 Containerized Backend

The backend is fully Dockerized for local dev and cloud deployment:

- Express.js API
- JWT auth middleware
- Redis + S3 service modules
- `Dockerfile` and `docker-compose.yml` included

---

## 🌐 NGINX Reverse Proxy

NGINX routes incoming traffic from ports `80` or `443` to your Docker container (e.g., port `5000`), enabling:
- Static frontend file serving
- Secure API routing with path rules (`/api/*`)
- HTTPS termination (via Let's Encrypt or ACM)

---

## 🚀 CI/CD (GitHub Actions)

- Lint + test on PR
- Auto deploy frontend to Amplify / S3
- SSH deploy backend to EC2 via rsync or Docker push
- Optionally: set up webhook or GitHub runner on EC2

---

## ✅ MVP Features

- [x] JWT-authenticated CRUD API for jobs
- [x] Resume upload to S3 + pre-signed download URLs
- [x] Redis cache for resume URLs (TTL 60s)
- [x] Dashboard UI with job filtering
- [x] EC2 + Docker + NGINX deployment
- [x] GitHub Actions for CI/CD

---

## 📸 Branding

- Logo: `assets/applyflow-logo.png`
- Favicons: `assets/favicon.ico` (light + dark modes)
- System diagram: `applyflow-architecture.png`

---

## 🛠 Future Enhancements

- Bi-weekly Sprint Review generator (analytics)
- Referral and follow-up reminders
- Slack/email nudges for daily job actions
- Smart priority ranking of jobs based on stage
- Rejections analytics -> Continuous improvement
## 📬 Contact

Built by [Khoi Lam](https://github.com/kal038)
