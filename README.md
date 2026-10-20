# 🩸 BloodDonor — Life-Saving Community Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-purple?style=for-the-badge)](https://www.better-auth.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**BloodDonor** is a modern, fast, and community-driven blood donation web application designed to connect voluntary blood donors with people in urgent need across Dhaka. Built with a focus on speed, privacy, and accessibility when every minute counts.

---

## 🌐 Live Demo

* **Live Deployment:** [https://blood-donor-ten.vercel.app](https://blood-donor-ten.vercel.app) *(or your configured Vercel URL)*
* **Repository:** [https://github.com/mehrabislam00/BloodDonor](https://github.com/mehrabislam00/BloodDonor)
* **Support Email:** [supportblooddonor@gmail.com](mailto:supportblooddonor@gmail.com)

---

## ✨ Key Features

### 🔍 For Blood Seekers
* **Smart Donor Search:** Filter active donors by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-) and area across Dhaka.
* **Real-Time Availability:** Distinguish between donors who are **Available Now**, **Available from a specific date**, or currently **Unavailable**.
* **Direct Contact with Privacy:** Reach donors via direct phone call or WhatsApp with confirmation modals, protecting donor contacts from unauthorized scraping.
* **Recent Activity Tracking:** Highlights donors who have recently been active on the platform.

### 🩸 For Blood Donors
* **Quick Onboarding:** Fast registration process to list as a donor in under 2 minutes.
* **Availability Management:** Self-manage availability status with automatic re-activation dates after donation cycles.
* **Donation History:** Track your last donation date and contribution record.
* **Privacy Controls:** Exact addresses are never displayed publicly; contact numbers are accessible only to verified community members.

### 🛡️ Administration & Moderation
* **Admin Dashboard:** Centralized panel for managing users, verifying donors, and overseeing reports.
* **Community Report System:** Users can report inaccurate profiles or unreachable contacts for admin review.
* **In-App Notifications:** Real-time administrative notifications and report feedback.

### 🎨 User Experience & Performance
* **Zero Layout Shift:** Server-side pre-fetching prevents flashing empty states and layout jumping.
* **Unified Full-Page Loading:** Branded full-viewport loading transition across route changes.
* **Custom 404 & Error Handling:** Fully responsive custom error pages matching the design system.
* **Dark / Light Mode Support:** Automatic theme adaptation.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack |
| **Frontend** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [HeroUI](https://heroui.com/), [DaisyUI](https://daisyui.com/) |
| **Icons & Motion** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (Credentials & Google OAuth) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Native Driver with Connection Pooling) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```plaintext
blood_donor/
├── public/                 # Static assets & SVG icons
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   │   ├── (auth)/         # Login, Register, Forgot Password
│   │   ├── (main)/         # Home, Find Donor, User Profile, About, Legal
│   │   ├── admin/          # Admin login and dashboard panels
│   │   ├── api/            # API endpoints (Auth, Donors, Profile, Admin)
│   │   ├── layout.tsx      # Root application layout
│   │   └── not-found.tsx   # Custom 404 Not Found page
│   ├── assets/             # Images and local graphic assets
│   ├── components/         # Modular React components
│   │   ├── admin/          # Admin tables, topbars, sidebars
│   │   ├── auth/           # Login & Registration forms
│   │   ├── dashboard/      # Donor profile dashboard widgets
│   │   ├── donor/          # DonorCard, modals, contact buttons
│   │   ├── find-donor/     # Search and filter components
│   │   ├── home/           # Hero, counters, feature showcases
│   │   ├── layout/         # Navbar, Footer, Brand Logo
│   │   ├── loading/        # Full-page loader & navigation providers
│   │   └── user-profile/   # Account settings and profile forms
│   └── lib/                # Shared utilities, DB connection, auth configs
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
* **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
* **npm**, **pnpm**, or **yarn**
* A **MongoDB database instance** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mehrabislam00/BloodDonor.git
   cd BloodDonor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Fill in your environment configuration:**
   ```env
   # Local development URL
   BETTER_AUTH_URL=http://localhost:3000

   # Environment mode
   DEPLOYMENT_ENV=development

   # Better Auth Secret (Generate a strong random string)
   BETTER_AUTH_SECRET=your-secret-key-here

   # MongoDB Connection String
   BETTER_AUTH_DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority

   # (Optional) Google OAuth Credentials
   BETTER_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
   BETTER_AUTH_GOOGLE_SECRET=your-google-client-secret
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Compiles optimized production build |
| `npm run start` | Starts production server locally after building |
| `npm run lint` | Runs ESLint to check for code quality and style errors |

---

## 🔐 Production Deployment (Vercel)

1. Import the repository into your **[Vercel Dashboard](https://vercel.com/)**.
2. Under **Project Settings > Environment Variables**, add:
   * `BETTER_AUTH_SECRET` — Strong random secret
   * `BETTER_AUTH_DB_URL` — Production MongoDB connection string
   * `BETTER_AUTH_URL` — Your canonical production domain (e.g. `https://your-domain.vercel.app`)
   * `BETTER_AUTH_GOOGLE_CLIENT_ID` & `BETTER_AUTH_GOOGLE_SECRET` *(if using Google Login)*
3. Deploy! Next.js will build and deploy the application automatically.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
