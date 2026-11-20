# Volunteer Platform Frontend

A modern, responsive web application for connecting volunteers with meaningful opportunities. Built with a focus on user experience and accessibility.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: TanStack Query v5
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js (Auth.js)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Testing**: Vitest & React Testing Library

## 📦 Key Features

- **Dynamic Opportunity Discovery**: Filter and search through various volunteering categories.
- **Volunteer Dashboard**: Track applications, view notifications, and manage profile settings.
- **Application Workflow**: Easy application process for volunteers.
- **Notification System**: Real-time updates on application status changes.
- **Arabic UI**: Fully localized interface for Arabic speakers.
- **Dark/Light Mode**: User-selectable themes for better accessibility.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+)
- Backend API running

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.
- `npm run test`: Run Vitest tests.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/features`: Domain-driven feature modules (auth, dashboard, etc.).
- `src/lib`: Shared utilities, API client, and providers.
- `src/types`: Global TypeScript definitions.
- `src/components`: Shared UI components.
