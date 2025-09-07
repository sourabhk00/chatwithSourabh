# ChatwithSourabh: Advanced AI Chat & File Analysis Platform

ChatwithSourabh is a next-generation, full-stack TypeScript application designed for interactive AI conversations and intelligent file analysis. Users can upload files (text, code, images, documents) and engage with "Sourabh Kumar," an AI assistant that provides contextual insights and supports deep, persistent chat experiences. The platform features robust file management, a live code editor, secure authentication, and a responsive, accessible UI.

---

## Table of Contents

- [Features](#features)
- [System Overview](#system-overview)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [Database & Data Storage](#database--data-storage)
  - [Authentication & Security](#authentication--security)
  - [External Dependencies](#external-dependencies)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [AI Capabilities](#ai-capabilities)
- [Development Workflow](#development-workflow)
- [License](#license)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Features

- **Conversational AI Chat**: Real-time, persistent chat with "Sourabh Kumar," powered by Google Gemini 2.5 Flash.
- **File Upload & Intelligent Analysis**: Supports text, code, images, and documents. Automatic format detection and context-aware AI responses.
- **Integrated Code Editor**: Monaco Editor with syntax highlighting and multi-language support for in-browser code editing and review.
- **Comprehensive File Management**: Organize, preview, and manage files with detailed metadata and secure storage.
- **Responsive, Mobile-First Design**: Adaptive layouts, collapsible sidebar, and dark mode by default for optimal usability on any device.
- **Secure Authentication**: Session-based, encrypted user credentials and PostgreSQL-backed session storage.
- **Accessible UI**: Built using Radix UI primitives and Shadcn/ui, with Tailwind CSS and custom theming.
- **Scalable & Serverless**: Utilizes Neon serverless PostgreSQL for scalable data management.

---

## System Overview

### Frontend Architecture

- **Framework**: React 18 with TypeScript, built using Vite for fast development and builds.
- **UI Components**: Shadcn/ui (Radix primitives) for accessible, modern UI.
- **Styling**: Tailwind CSS plus custom CSS variables for theme management; supports dark mode out of the box.
- **Routing**: Wouter for efficient, client-side routing.
- **State Management**: TanStack Query (server state) and React hooks (local state).
- **Modular Structure**: Clear separation of pages, components, hooks, and utilities for scalability and maintainability.

### Backend Architecture

- **Runtime**: Node.js, Express.js for RESTful API services.
- **Database**: PostgreSQL (hosted on Neon serverless).
- **ORM**: Drizzle ORM for type-safe, efficient data operations.
- **Session Storage**: connect-pg-simple to store session data securely in PostgreSQL.
- **File Handling**: Multer middleware for secure uploads and file validation.
- **API Endpoints**: RESTful endpoints for chat, file management, authentication, and AI interactions.

### Database & Data Storage

- **Entities**:
  - **Users**: UUIDs as primary keys, encrypted credentials, session management.
  - **Files**: Local server storage with metadata (type, owner, timestamps) in PostgreSQL.
  - **Chat Messages**: Fully persistent, linked to users and files for context.
- **Session Management**: Database-backed for reliability and scalability.
- **File Storage**: Uploaded files stored on local filesystem, referenced by DB metadata.

### Authentication & Security

- **Session-Based Authentication**: Secure cookies, PostgreSQL session storage.
- **User Management**: Username/password with hashing and encryption.
- **Security**: CORS configuration, strict file validation, secure session handling, and encrypted credentials.

### External Dependencies

- **AI Service**: Google Gemini 2.5 Flash for chat and advanced file analysis.
- **Database Hosting**: Neon serverless PostgreSQL.
- **UI Components**: Radix UI via Shadcn/ui.
- **Development Tools**: Replit integration for cloud-based development.
- **Build Tools**: Vite (frontend), esbuild (backend), and TypeScript project-wide.

---

## Getting Started

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sourabhk00/chatwithSourabh.git
   cd chatwithSourabh
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   _(Run in both `frontend/` and `backend/` if separated)_

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` in both `frontend/` and `backend/` directories and set your database, session secret, and AI API key (see [Environment Variables](#environment-variables)).

4. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start Frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Access the Application**
   Open your browser at `http://localhost:5173`

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=your_postgres_connection_string
SESSION_SECRET=your_session_secret
AI_API_KEY=your_google_gemini_api_key
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000
```

---

## Project Structure

```
chatwithSourabh/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Chat, file, user API route handlers
│   │   ├── db/                # Drizzle ORM schemas, queries
│   │   ├── middleware/        # Auth, session, file validation
│   │   ├── ai/                # Gemini API integration logic
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Server entry point
│   ├── uploads/               # Local file storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components (chat, file list, editor, etc.)
│   │   ├── pages/             # Main pages: chat, files, editor, settings
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Frontend helpers
│   │   ├── styles/            # Tailwind and custom CSS
│   │   └── main.tsx           # Frontend entry point
│   └── package.json
├── README.md
└── .env.example
```

---

## AI Capabilities

- **Conversational Chat**: "Sourabh Kumar" delivers fast, context-sensitive responses, referencing uploaded files and chat history.
- **File Analysis**: AI provides summaries, explanations, and insights tailored to file type—documents, code, images, and more.
- **Contextual Intelligence**: Chat and file analysis work together; file context automatically enriches AI responses.

---

## Development Workflow

- **Frontend**: Vite-powered HMR and modular TypeScript development.
- **Backend**: Type-safe REST APIs using Drizzle ORM and Express.js.
- **Testing**: Use Vitest or Jest for unit and integration tests.
- **Linting & Formatting**: ESLint and Prettier for consistent code quality.
- **Deployment**: Compatible with Vercel, Netlify, or traditional VPS for frontend; backend deployable to any Node.js host.

---

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

---

## Contributing

We welcome contributions and feedback!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/your-feature`).
3. Commit your changes (`git commit -am 'Add feature'`).
4. Push to your branch (`git push origin feat/your-feature`).
5. Open a Pull Request describing your changes.

---

## Contact

For questions, feedback, or collaboration, reach out via [GitHub](https://github.com/sourabhk00).

Developed and maintained by **Sourabh Kumar**.

---
