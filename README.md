# Schedule Us

Welcome to **Schedule Us**, a powerful and intuitive application designed to streamline your scheduling and goal management processes. This application provides a comprehensive suite of tools for individuals and teams to organize tasks, track progress, and collaborate effectively. With a modern user interface and a robust set of features, Schedule Us helps you stay on top of your personal and professional goals.

## Key Features

- **Goal Management:** Create, track, and manage your personal and team goals with ease.
- **Group Collaboration:** Form groups, share goals, and track collective progress.
- **Dashboard Analytics:** Visualize your progress with insightful charts and statistics.
- **AI-Powered Suggestions:** Leverage AI to get suggestions for your next goals.
- **Secure Authentication:** Safe and secure user authentication using Firebase.

## Tech Stack

This project is built with a modern tech stack to ensure a high-quality user experience and robust performance.

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** React Hooks & Context API
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Database & Auth:** [Firebase](https://firebase.google.com/)
- **API:** Next.js API Routes
- **Linting & Formatting:** [ESLint](https://eslint.org/)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hopekali04/schedule-us.git
   cd schedule-us
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. You can use the `example.env` file as a template.

```env
# Firebase Public Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Firebase Admin SDK
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL="your_firebase_client_email"

# Google Generative AI
NEXT_GOOGLE_API_KEY="your_google_api_key"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
NODE_ENV="development"
```

You will also need to create a `firebase.json` file in the root of the project with your Firebase service account credentials. You can use `firebase.example.json` as a template.

### Running the Application

Once the environment variables are set up, you can run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## Project Structure

The project follows a standard Next.js App Router structure.

```
/src
├── app/                # Main application routes
│   ├── (app)/          # Authenticated routes
│   ├── (auth)/         # Authentication routes
│   └── api/            # API endpoints
├── components/         # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and libraries
└── types/              # TypeScript type definitions
```

## API Endpoints

The application includes several API endpoints for handling data and business logic.

- **/api/auth/session**: Manages user sessions.
- **/api/ai/generate-suggestions**: Generates goal suggestions using AI.
- **/api/categories**: Manages categories.
- **/api/dashboard**: Fetches data for the dashboard.
- **/api/goals**: Manages goals and their steps.
- **/api/groups**: Manages groups and their members.

---

Thank you for using Schedule Us! We hope this application helps you achieve your goals and stay organized.