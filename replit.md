# Personal Finance FIRE Journey Blog & Dashboard

## Overview

This is a modern full-stack web application that serves as a personal finance blog and wealth tracking platform for documenting the journey toward Financial Independence, Retire Early (FIRE). The application combines storytelling through blog posts with data visualization of wealth tracking progress, targeting personal finance enthusiasts and the broader FIRE community.

The platform allows users to publish long-form blog posts about wealth tracking, financial planning, and FIRE progress while displaying personal wealth data through interactive charts and summaries. It features a clean, professional design with Pacific Northwest-inspired theming and comprehensive content management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom Pacific Northwest-inspired color scheme
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **Theme System**: Custom theme provider supporting light/dark modes with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reload via Vite middleware in development mode
- **Build System**: esbuild for production server bundling

### Database Schema Design
The application uses a PostgreSQL database with the following core entities:
- **Users**: Authentication and authorization (id, username, password)
- **Blog Posts**: Content management (title, slug, content, excerpt, category, featured status, view tracking)
- **Wealth Data**: Financial tracking (net worth, investments, cash, liabilities, FIRE target, savings rate)
- **Newsletter Subscriptions**: Email list management
- **Contact Submissions**: Contact form handling

All tables use UUID primary keys and include appropriate timestamps and indexing for performance.

### Data Layer Architecture
- **Storage Interface**: Abstract IStorage interface with in-memory implementation (MemStorage class)
- **Schema Validation**: Drizzle-Zod integration for runtime type safety
- **Query Optimization**: Structured queries with proper indexing on frequently accessed fields
- **Data Relationships**: Properly normalized schema with foreign key constraints

### API Design Patterns
- **Resource-based URLs**: RESTful endpoints following `/api/{resource}` convention
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE for CRUD operations
- **Error Handling**: Centralized error handling middleware with appropriate status codes
- **Request Logging**: Comprehensive request/response logging for development debugging
- **Validation**: Input validation using Zod schemas before database operations

### Component Architecture
- **Layout System**: Persistent header/footer layout with main content area
- **Page Components**: Route-specific components for Home, Blog, Dashboard, About, Contact
- **Reusable Components**: Modular UI components (BlogCard, MetricCard, ProgressIndicator)
- **Hook Patterns**: Custom hooks for mobile detection, theme management, and toast notifications

### Performance Optimizations
- **Code Splitting**: Vite-based bundle splitting for optimal loading
- **Image Optimization**: Responsive images with proper alt text and lazy loading
- **Caching Strategy**: React Query caching with appropriate stale times
- **Bundle Analysis**: Development-time bundle optimization with Vite

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **drizzle-kit**: Database migration and schema management tools

### UI & Styling Framework
- **@radix-ui/react-***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Utility for building variant-aware component APIs
- **clsx & tailwind-merge**: Class name management and conditional styling

### State Management & Forms
- **@tanstack/react-query**: Server state management with caching and synchronization
- **react-hook-form**: Performant forms library with minimal re-renders
- **@hookform/resolvers**: Validation resolver for React Hook Form
- **zod**: TypeScript-first schema declaration and validation

### Development Tools
- **vite**: Next-generation frontend build tool with HMR
- **typescript**: Static type checking and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Routing & Navigation
- **wouter**: Minimalist routing library for React applications
- **React Router**: Not used - application uses wouter for lighter weight

### Additional Utilities
- **date-fns**: Modern JavaScript date utility library
- **lucide-react**: Beautiful & consistent SVG icon library
- **nanoid**: URL-safe unique string ID generator
- **cmdk**: Command palette component for enhanced UX