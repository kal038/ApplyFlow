# ApplyFlow - getting to flow state in your job apps

![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![React](https://img.shields.io/badge/Frontend-React-blue)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-yellow)

## ✨ Applyflow

Applyflow is a fully serverless application that empowers job seekers to manage applications, track progress, upload resumes, and receive smart follow-up reminders — all within a scalable cloud-native architecture built on AWS.


---

## 🧰 Tech Stack

| Layer         | Stack                              |
|---------------|------------------------------------|
| Frontend      | React + TailwindCSS                |
| Hosting       | EC2                                |
| Backend       | Node.js (Express) in Docker        |
| Infra         | EC2 (AMZ Linux) + NGINX rev proxy  |
| Auth          | Passport JS Local + JWT            |
| Database      | DynamoDB                           |
| File Storage  | AWS S3 (Resume uploads)            |
| Caching       | Redis (ElastiCache)                |
| CI/CD         | GitHub Actions (Frontend + Backend)|
| Monitoring    | AWS CloudWatch                     |

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
- [x] Dashboard UI with job filtering
- [x] EC2 + Docker + NGINX deployment
- [x] GitHub Actions for CI/CD

---

## 📸 Branding

WIP

---

## 🛠 Features in beta

- Bi-weekly Sprint Review generator (analytics)
- Referral and follow-up reminders
- Slack/email nudges for daily job actions
- Smart priority ranking of jobs based on stage
- Rejections analytics -> Continuous improvement
- Resume upload to S3 + pre-signed download URLs
- Redis cache for resume URLs 
## 📬 Contact

Built by [Khoi Lam](https://github.com/kal038)
