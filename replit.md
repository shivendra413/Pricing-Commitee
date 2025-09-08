# Overview

This is a Steel Products Pricing Committee Dashboard application - a discount request evaluation system designed for steel industry pricing committees in the Oman region. The application allows users to manage, filter, analyze, and approve/reject discount requests for various steel products (Wire Rod, Rebar, Billets). It features comprehensive dashboard analytics, customer profiling, regional market analysis, and margin impact calculations to support data-driven pricing decisions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in a Vite-powered SPA
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js for data visualization (customer growth, demand/supply, margin impact)

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API server
- **Development**: tsx for TypeScript execution in development, esbuild for production builds
- **API Design**: RESTful endpoints for discount requests, customers, and regional data
- **Storage**: In-memory storage implementation with interface-based design for easy database migration
- **Session Management**: Connect-pg-simple for PostgreSQL session storage (prepared for future use)

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver (configured but not yet implemented)
- **ORM**: Drizzle ORM with TypeScript-first schema definition
- **Migration**: Drizzle Kit for database schema migrations
- **Current State**: In-memory storage with full interface compatibility for database transition

## Database Schema Design
- **Users**: Authentication and authorization (id, username, password)
- **Customers**: Client information with tier classification and performance metrics
- **Discount Requests**: Core entity with product details, pricing, workflow stages, and approval status
- **Regional Data**: Market conditions, capacity utilization, inventory levels by region/product
- **Customer Sales Data**: Historical sales performance for trend analysis

## Authentication and Authorization
- **Current**: Basic session-based authentication infrastructure
- **Prepared**: PostgreSQL session store configuration
- **Security**: Password hashing and session management ready for implementation

## API Structure
- **Discount Requests**: CRUD operations with filtering capabilities (product type, region, stage, value range)
- **Customers**: Customer profiles with sales data relationships
- **Regional Data**: Market context and supply/demand analytics
- **Bulk Operations**: Multi-request approval/rejection workflows

## UI Components Architecture
- **Layout**: Responsive grid-based dashboard with collapsible sections
- **Charts**: Modular chart components (growth trends, demand/supply, margin impact)
- **Tables**: Interactive request lists with selection, filtering, and inline actions
- **Forms**: Controlled form components with validation feedback
- **Notifications**: Toast-based user feedback system

## Development Workflow
// ...existing code...
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Code Generation**: Automatic type inference from Drizzle schema
- **Build Process**: Separate client and server builds with optimized bundling

## External Dependencies

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: TypeScript ORM with excellent type inference
- **drizzle-kit**: Database migration and introspection tools

### UI and Styling
- **@radix-ui/***: Headless UI components for accessibility and customization
- **tailwindcss**: Utility-first CSS framework for rapid styling
- **class-variance-authority**: Type-safe variant management for components
- **lucide-react**: Modern icon library

### Data Management
- **@tanstack/react-query**: Server state management with caching and synchronization
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers for Zod integration
- **zod**: TypeScript-first schema validation

### Charts and Visualization
- **chart.js**: Canvas-based charting library for responsive data visualization
- **date-fns**: Date manipulation and formatting utilities

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds
// ...existing code...