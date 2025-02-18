# AskAnon

## 📌 Overview
AskAnon is an anonymous Q&A platform that allows users to receive and respond to anonymous questions. It provides a seamless and secure way for users to interact while maintaining privacy. The platform includes features such as a public profile, AI-powered suggestions, and user customization options.

## 🚀 Features
- **Anonymous Q&A** – Users can receive anonymous questions and send replies.
- **Public Profiles** – Each user has a profile page where their details can be viewed publicly.
- **User Customization** – Users can update their name, bio, and avatar.
- **AI-Powered Suggestions** – Questions are suggested using **Gemini AI**.
- **Authentication & Security** – Secure authentication with NextAuth/Auth.js.
- **Contact Us Page** – Users can reach out via a contact form.
- **Form Validation** – Uses **Zod** for robust form validation.
- **UI & Styling** – Built with **ShadCN UI** components.
- **Default Avatars** – Uses **Boring Avatars** for profile images.
- **API Calls** – Managed using **Axios**.

## 🏗️ Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes, Mongoose, MongoDB
- **Authentication:** NextAuth/Auth.js
- **AI Integration:** Gemini AI (Google Generative AI)
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **Avatar Generation:** Boring Avatars
- **API Calls:** Axios
- **Deployment:** Vercel

## 📂 Environment Variables
Create a `.env` file and add the following variables:

```
MONGO_URI="your mongodb url"
AUTH_SECRET="your authjs key"
GOOGLE_GENERATIVE_AI_API_KEY="your genai ey"
MAIL_HOST="nodemailer host"
MAIL_USER="nodemailer user"
MAIL_PASSWORD="nodemailer user password"
GEN_AI_MODEL="model version"
DOMAIN=http://localhost:3000
```

## 🔧 Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/shahfaiz-07/askanon.git
   ```
2. Navigate to the project directory:
   ```bash
   cd askanon
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the `.env` file with your credentials.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## 📜 License
This project is licensed under the MIT License.

## 👥 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## 📞 Contact
For inquiries, visit the **Contact Us** page or reach out via email.