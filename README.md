#Gemini Clone - Full Next.js 15 (Auth + Chat)

Requirements:
- Node.js >= 18.18.0
- npm

Quick start:
1. npm install
2. npm run dev
3. Visit http://localhost:3000/login

Flow:
- /login -> enter phone + country, Send OTP (simulated)
- /otp -> enter OTP shown in toast (4 digits)
- On success you are redirected to /chat (dashboard)
- Click a chat to open /chat/[id]

Notes:
- Uses Zustand for state, stores saved to localStorage
- TailwindCSS included
