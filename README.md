# 🚀 ApplyFlow - Your Job Search, Streamlined

![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![React](https://img.shields.io/badge/Frontend-React-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-yellow)

ApplyFlow empowers job seekers to enter a state of flow in their application process.  
Track applications, manage progress, and land your dream job – all in one beautiful, intuitive interface.

---

## ✨ Key Features
- 📋 **Smart Job Tracking**: Intuitive dashboard to manage all your applications  
- 🔄 **Real-time Updates**: Optimistic UI updates for a snappy experience  
- 🎯 **Progress Tracking**: Visual kanban board for application stages  
- 🔒 **Secure by Design**: JWT authentication with httpOnly cookies  
- 🎨 **Modern UI**: Built with React + Tailwind for a beautiful experience  

---

## 🛠️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React + Vite + TailwindCSS       |
| Backend   | Node.js + Express                |
| Database  | Amazon DynamoDB                  |
| Auth      | Passport.js + JWT                |
| Hosting   | AWS EC2 + NGINX                  |
| CI/CD     | GitHub Actions                   |

---

## 🧰 Environment Setup
- Copy `backend-node/.env.example` to `backend-node/.env` and set `JWT_SECRET`, DynamoDB table names, and optional `STALE_JOB_DAYS`/`AWS_REGION`.
- Copy `frontend/.env.example` to `frontend/.env`; adjust `VITE_API_BASE` if the API is not served from `http://localhost:3030`.
- Run `make dev` from the repo root to install dependencies (if missing) and start both frontend and backend together.

---

## 🌟 Coming Soon
- 📊 Bi-weekly Sprint Review generator  
- 🔔 Smart follow-up reminders  
- 📱 Slack/email integration  
- 📈 Analytics dashboard  
- 📄 Resume management with S3  



