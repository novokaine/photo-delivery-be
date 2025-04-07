# Photo Delivery (Backend)

This is the backend for the **Photo Delivery** platform, built with **Express.js**. It handles authentication, file uploads, and user management with a focus on security and scalability.

---

## 🔧 Tech Stack

- **Node.js + Express**
- **JWT** for access/refresh token authentication
- **bcrypt** for password hashing
- **Multer** for photo uploads
- **HTTP-only cookies** for refresh tokens
- **CORS** with credentials support

---

## 🔐 Authentication Flow

- **Login** issues an **access token** (15 min) and a **refresh token** (stored in HTTP-only cookie)
- **Refresh endpoint** allows silent renewal of access tokens
- **Logout** clears the refresh token cookie
- **Middleware** checks `Authorization: Bearer <token>` and returns `419` on token expiration

---

## 📁 Folder Structure

```
src/
├── auth/               # Auth controller and middleware
├── routes/             # Route definitions (login, upload, etc.)
├── uploads/            # Folder for uploaded files
├── utils/              # Helper functions (e.g., JWT utils)
├── app.ts              # Main Express setup
└── server.ts           # Server entry point
```

---

## 📦 Endpoints

```http
POST /login              # Login with email/password
GET /refresh-token       # Get new access token (requires cookie)
POST /logout             # Clear refresh token
POST /admin/upload-photos # Upload multiple photos (FormData)
```

All admin routes require a valid access token in the `Authorization` header.

---

## ⚙️ Running the Backend

```bash
# Clone the repo
git clone https://github.com/novokaine/photo-delivery-be.git

# Install dependencies
npm install

# Run server in dev mode
npm run dev
```

Server runs on **http://localhost:5000** by default.

---

## 🛡 Security

- Refresh token is set as an **HTTP-only cookie** (`Secure + SameSite=Strict` in production)
- Access token is short-lived to limit misuse
- All uploads validated by multer and protected via middleware

---

## 🚀 Deployment

This app is deployment-ready. You can use:

- **Render**
- **Heroku**
- **Railway**
- **Raspberry Pi** (self-hosted)

Be sure to:

- Set `NODE_ENV=production`
- Enable CORS for your frontend origin
- Use environment variables for JWT secrets

---

## 🔗 Related Repos

- [Frontend Repo](https://github.com/novokaine/photo-delivery-fe)

---

## 👨‍💻 Author

Maintained by a dedicated frontend engineer branching into full-stack capabilities. Built with passion and care for clean architecture, security, and simplicity.

Open to contributions, feedback, and collaborations.
