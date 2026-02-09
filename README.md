# Job Portal - Microservices Architecture

A comprehensive job portal application built with microservices architecture, featuring separate services for authentication, user management, job management, and utility services.

## Architecture Overview

This project implements a distributed microservices architecture with the following services:

- **Auth Service** (Port 5000) - User authentication and authorization
- **Utils Service** (Port 5001) - File uploads, AI-powered career advice, and resume analysis
- **User Service** (Port 5002) - User profile management and job applications
- **Job Service** (Port 5003) - Job and company management
- **Apache Kafka** (Port 9092) - Message broker for inter-service communication
- **Frontend** - User interface (configured but minimal setup)

## Tech Stack

### Backend Services

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Neon Database)
- **Message Broker**: Apache Kafka
- **Caching**: Redis (Auth service)
- **File Storage**: Cloudinary
- **AI Integration**: Google Generative AI (Gemini)
- **Email Service**: Nodemailer
- **Authentication**: JWT tokens with bcrypt password hashing

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload with tsc-watch and nodemon

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL database (Neon Database recommended)
- Redis instance
- Cloudinary account
- Google AI API key
- SMTP server for email functionality

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/XuanDu-303/job-portal.git
cd job-portal
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install dependencies for each service
npm run install-all
```

### 3. Environment Configuration

Create `.env` files for each service in their respective directories:

#### Auth Service (`services/auth/.env`)

```env
PORT=5000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_connection_url
KAFKA_BROKERS=kafka:9092
```

#### User Service (`services/user/.env`)

```env
PORT=5002
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
HOST=0.0.0.0
```

#### Job Service (`services/job/.env`)

```env
PORT=5003
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
KAFKA_BROKERS=kafka:9092
```

#### Utils Service (`services/utils/.env`)

```env
PORT=5001
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
API_KEY_GEMINI=your_google_ai_api_key
KAFKA_BROKERS=kafka:9092
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### 4. Database Setup

The services will automatically create the required database tables on startup:

- **Auth Service**: Users, skills, and user_skills tables
- **Job Service**: Companies, jobs, and applications tables

## Running the Application

### Development Mode (with Docker Compose)

```bash
docker-compose up --build
```

### Development Mode (Local)

```bash
# Start all services simultaneously
npm run dev
```

### Individual Service Development

```bash
# Auth service
cd services/auth && npm run dev

# User service
cd services/user && npm run dev

# Job service
cd services/job && npm run dev

# Utils service
cd services/utils && npm run dev
```

## API Endpoints

### Auth Service (`localhost:5000`)

- `POST /api/auth/register` - User registration with file upload
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot` - Forgot password
- `POST /api/auth/reset/:token` - Reset password

### User Service (`localhost:5002`)

- `GET /api/user/me` - Get current user profile (authenticated)
- `GET /api/user/:userId` - Get user profile by ID
- `PUT /api/user/update/profile` - Update user profile (authenticated)
- `PUT /api/user/update/pic` - Update profile picture (authenticated)
- `PUT /api/user/update/resume` - Update resume (authenticated)
- `POST /api/user/skill/add` - Add skill to user (authenticated)
- `DELETE /api/user/skill/delete` - Remove skill from user (authenticated)
- `POST /api/user/apply/:jobId` - Apply for job (authenticated)
- `GET /api/user/application/all` - Get all applications (authenticated)

### Job Service (`localhost:5003`)

- `POST /api/job/company/new` - Create new company (authenticated)
- `DELETE /api/job/company/:companyId` - Delete company (authenticated)
- `GET /api/job/company/all` - Get all companies (authenticated)
- `GET /api/job/company/:id` - Get company details (authenticated)
- `POST /api/job/new` - Create new job (authenticated)
- `PUT /api/job/:jobId` - Update job (authenticated)
- `GET /api/job/all` - Get all active jobs
- `GET /api/job/:jobId` - Get single job details
- `GET /api/job/application/:jobId` - Get job applications (authenticated)
- `PUT /api/job/application/update/:id` - Update application status (authenticated)

### Utils Service (`localhost:5001`)

- `POST /api/utils/upload` - Upload files to Cloudinary
- `POST /api/utils/career` - Get AI-powered career advice based on skills
- `POST /api/utils/resume-analyser` - Analyze resume for ATS compatibility

## Features

### User Management

- User registration and authentication with JWT
- Role-based access (Job Seeker vs Recruiter)
- Profile management with photo and resume upload
- Skills management system
- Password reset functionality

### Job Management

- Company profile creation and management
- Job posting with detailed descriptions
- Job application system
- Application status tracking (Submitted/Rejected/Hired)
- Support for different job types and work locations

### AI-Powered Features

- **Career Advisor**: Provides personalized career path suggestions based on user skills (Vietnamese language)
- **Resume Analyzer**: ATS compatibility analysis with detailed feedback and improvement suggestions

### File Management

- Cloudinary integration for image and document storage
- Resume and profile picture upload functionality
- File replacement and deletion capabilities

### Communication

- Kafka-based messaging between services
- Email notifications via Nodemailer
- Real-time updates for job applications

## Development

### Building Services

```bash
# Build all services
npm run build-all

# Build individual service
cd services/auth && npm run build
```

### Database Schema

#### Users Table (Auth Service)

```sql
- user_id (Primary Key)
- name, email, password, phone_number
- role (jobseeker/recruiter)
- bio, resume, profile_pic
- created_at, subscription
```

#### Companies Table (Job Service)

```sql
- company_id (Primary Key)
- name, description, website, logo
- recruiter_id, created_at
```

#### Jobs Table (Job Service)

```sql
- job_id (Primary Key)
- title, description, salary, location
- job_type, work_location, openings
- company_id, posted_by_recruiter_id
- created_at, is_active
```

#### Applications Table (Job Service)

```sql
- application_id (Primary Key)
- job_id, applicant_id, status
- resume, applied_at, subscribed
```

## Docker Configuration

Each service includes:

- Multi-stage Docker builds optimized for production
- Non-root user security
- Volume mounts for development
- Health checks and dependency management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

**Note**: This is a learning project demonstrating microservices architecture, containerization, and modern web development practices.
