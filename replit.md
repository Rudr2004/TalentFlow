# AI-Powered Recruitment Platform

## Overview

This is a full-stack AI-powered recruitment platform built with React, Express, and PostgreSQL. The application enables intelligent candidate management by integrating with LinkedIn and Indeed, using AI to automatically score, rank, and recommend candidates based on job requirements. It features a modern dark theme UI with comprehensive admin controls and real-time analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom AI-themed color scheme
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Session Management**: Express sessions with PostgreSQL session store
- **Request Logging**: Custom middleware for API request/response logging

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Design**: Four main tables (users, candidates, user_actions, contact_forms)

## Key Components

### Core Entities
1. **Users**: Admin and regular user roles with authentication
2. **Candidates**: Job candidates from LinkedIn and Indeed with AI scoring
3. **User Actions**: Activity tracking for candidate interactions
4. **Contact Forms**: Lead capture and contact management

### AI Features
- **Candidate Scoring**: AI-powered ranking system with confidence scores
- **Smart Recommendations**: Algorithm-based candidate suggestions
- **Automated Summaries**: AI-generated candidate profile summaries
- **Source Integration**: LinkedIn and Indeed data aggregation

### User Interface
- **Landing Page**: Modern marketing site with dark theme
- **Dashboard**: Candidate management interface with filtering
- **Admin Panel**: User activity monitoring and system analytics
- **Responsive Design**: Mobile-first approach with glass morphism effects

## Data Flow

### Candidate Management Flow
1. **Data Ingestion**: Candidates imported from LinkedIn/Indeed APIs
2. **AI Processing**: Machine learning models score and rank candidates
3. **User Interaction**: Recruiters view, shortlist, reject, or contact candidates
4. **Activity Tracking**: All user actions logged for analytics
5. **Status Updates**: Candidate pipeline management with real-time updates

### Authentication Flow
1. **User Login**: Username/password authentication
2. **Session Management**: Express sessions with PostgreSQL persistence
3. **Role-Based Access**: Admin and user role differentiation
4. **API Security**: Session-based request authentication

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Modern build tool and dev server
- **typescript**: Type safety and development experience
- **eslint/prettier**: Code quality and formatting
- **@replit/vite-plugin-***: Replit-specific development tools

### AI/ML Integration
The application is designed to integrate with external AI services for:
- Candidate profile analysis and scoring
- Resume parsing and skill extraction
- Job requirement matching algorithms
- Predictive hiring success models

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon Database with environment-based configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Asset Handling**: Vite handles static assets and bundling

### Production Build
- **Frontend**: Static assets built to `dist/public` directory
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Database Migration**: Drizzle Kit handles schema migrations
- **Deployment**: Single production bundle with static file serving

### Performance Considerations
- **Code Splitting**: Vite automatically splits bundles for optimal loading
- **Query Caching**: TanStack Query provides intelligent caching strategies
- **Database Optimization**: Drizzle ORM generates efficient SQL queries
- **Static Assets**: Optimized image loading and CSS purging

The architecture supports horizontal scaling through stateless API design and external database hosting, making it suitable for production deployment on platforms like Vercel, Netlify, or traditional cloud providers.