# CoffeePassword

> **Waze for Café Wi-Fi.** A modern, crowdsourced web app that helps remote workers, students, and digital nomads instantly find verified coffee shop Wi-Fi passwords.

![CoffeePassword Aesthetic](https://via.placeholder.com/800x400.png?text=CoffeePassword+Dashboard)

## 🚀 Features

- **Interactive Map Explorer**: Find coffee shops near you using Mapbox GL JS.
- **Crowdsourced Passwords**: Submit, verify, and upvote Wi-Fi passwords.
- **Confidence Algorithm**: The most reliable and recently verified passwords automatically float to the top.
- **Community Moderation**: Built-in reporting, rate limiting, and profanity filtering (via Cloud Functions).
- **Gamification**: Earn reputation points for contributing and verifying passwords.
- **Premium UI/UX**: Specialty coffee aesthetic featuring glassmorphism, smooth animations, and a dark mode toggle.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend & Auth**: Firebase (Firestore, Auth)
- **Moderation**: Firebase Cloud Functions
- **Maps**: Mapbox GL JS
- **Deployment**: Netlify

## ⚙️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coffee-password.git
   cd coffee-password
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Rename `.env.local.example` to `.env.local` and add your Firebase and Mapbox credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🛡️ Firebase Setup

1. Create a Firebase project.
2. Enable **Firestore Database** and set up the schema using the provided `firebase-rules.txt`.
3. Enable **Authentication** (Google Auth Provider & Anonymous provider).
4. (Optional) Deploy the Cloud Functions for moderation:
   ```bash
   cd functions
   npm install
   npm run deploy
   ```

## 🌐 Deployment (Netlify)

This project is optimized for deployment on Netlify via the Next.js runtime plugin.

1. Push your code to GitHub.
2. Connect the repository in the Netlify Dashboard.
3. Add your environment variables in the Netlify site settings.
4. Deploy! The `netlify.toml` file will automatically configure security headers and build settings.

## 🤝 Contributing
Built according to strict architectural guidelines. See `GEMINI.md` for our core development principles, ensuring code quality, security, and performance standards.
