# ApplyFlow - getting to flow state in your job apps

![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange)
![React](https://img.shields.io/badge/Frontend-React-blue)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-yellow)

## ✨ Applyflow

Applyflow is a fully serverless application that empowers job seekers to manage applications, track progress, upload resumes, and receive smart follow-up reminders — all within a scalable cloud-native architecture built on AWS.

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TailwindCSS (S3 hosted via CloudFront) |
| Backend | AWS Lambda + API Gateway |
| Database | AWS DynamoDB |
| Auth | AWS Cognito |
| Storage | AWS S3 |
| CI/CD | GitHub Actions + Amplify CLI |
| Monitoring | AWS CloudWatch (logs, metrics, alerts) |

## 🚀 Getting Started

1. Clone this repo
2. Configure AWS Amplify CLI
3. Deploy frontend and backend via `amplify push`
4. Start tracking!

## 🧪 Testing & Monitoring

- Unit tests with Jest
- CI/CD checks via GitHub Actions
- Logging via CloudWatch

---

## 📊 Future features

- Email & SMS reminders for follow-ups (Lambda + SES/Twilio)
- Calendar sync with Google
- Offer rate & rejection reason analytics

## 📬 Contact

Built by [Khoi Lam](https://github.com/kal038)
