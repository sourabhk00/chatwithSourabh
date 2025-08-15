# Overview

This is a modern AI-powered chat application with file analysis capabilities. The system allows users to upload and interact with various file types (documents, images, code files) through an AI assistant named "Sourabh Kumar." The application features a comprehensive file management system, real-time chat interface, and an integrated code editor, all built with a full-stack TypeScript architecture.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Components**: Radix UI primitives with Shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting dark mode by default
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **File Structure**: Modular component architecture with separate pages, components, hooks, and utilities

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **File Handling**: Multer for file uploads with configurable storage and type validation
- **API Structure**: RESTful endpoints for chat, file management, and AI interactions

## Data Storage Solutions
- **Database**: PostgreSQL as primary database with Neon Database serverless hosting
- **Schema Design**: Three main entities - users, files, and chat messages with UUID primary keys
- **File Storage**: Local filesystem storage for uploaded files with metadata in database
- **Session Management**: Database-backed sessions for user persistence

## Authentication and Authorization
- **Strategy**: Session-based authentication with PostgreSQL session store
- **User Management**: Username/password authentication with encrypted storage
- **Security**: CORS configuration, secure session cookies, and file upload validation

## External Dependencies
- **AI Service**: Google Gemini 2.5 Flash API for chat responses and file analysis
- **Database Hosting**: Neon Database serverless PostgreSQL
- **UI Components**: Radix UI ecosystem for accessible component primitives
- **Development Tools**: Replit integration with custom plugins for development environment
- **Build Tools**: Vite for frontend bundling, esbuild for server bundling, TypeScript for type checking

## Key Features
- **Multi-format File Support**: Handles text, code, images, documents with intelligent type detection
- **Real-time Chat**: WebSocket-like experience with message persistence and file context
- **Code Editor**: Monaco Editor integration with syntax highlighting and multi-language support
- **Responsive Design**: Mobile-first approach with collapsible sidebar and adaptive layouts
- **File Analysis**: AI-powered analysis of uploaded files with contextual responses