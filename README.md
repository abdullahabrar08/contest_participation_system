# Contest Participation System

## Overview

This project is a robust Contest Participation System built with Node.js, Express, and PostgreSQL. It provides a complete backend solution for managing contests, user participation, question/answer management, leaderboards, and prize distribution. The system features role-based access control, contest scheduling, VIP-only contests, and comprehensive data relationships to support complex contest scenarios.

## Key Features

- **User Management**: Secure user registration and authentication with role-based permissions
- **Contest System**: Create and manage contests with specific time windows and VIP restrictions
- **Question Bank**: Support for multiple question types with associated answers
- **Submission Tracking**: Detailed recording of user submissions and participation
- **Leaderboard**: Real-time scoring
- **Prize Distribution**: Management of contest prizes and winner selection
- **Data Integrity**: Comprehensive foreign key relationships and constraints

## Database Schema

The system utilizes a well-normalized PostgreSQL database with the following tables:

1. **users** - Stores user account information
2. **roles** - Defines user roles
3. **contests** - Contains contest details and scheduling
4. **questions** - Stores contest questions and score
5. **question_types** - Categorizes different types of questions
6. **answers** - Contains possible answers with correctness indicators
7. **user_contests** - Tracks user participation in contests
8. **user_submissions** - Records individual question submissions
9. **leaderboard** - Maintains contest rankings
10. **prizes** - Stores contest prize information
11. **user_prizes** - Tracks prize awards to users

## Technical Stack

- **Backend**: Node.js with Express framework
- **Database**: PostgreSQL with Docker containerization
- **Migrations**: Migration system for database schema management
- **API**: RESTful endpoints for all system operations

## Installation Instructions

### Prerequisites

- Docker installed on your system
- Node.js (version 14 or higher recommended)
- npm or yarn package manager

### Setup Steps

1. **Start the PostgreSQL Database**:

   ```bash
   docker-compose up -d
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run Database Migrations**:

   ```bash
   npm run migrate
   ```

   This will:

   - Create all database tables
   - Establish relationships and constraints
   - Seed initial data

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## API Endpoints

The system provides RESTful endpoints for all operations, including:

- User registration and authentication
- Contest creation and management
- Question and answer management
- Submission processing
- Leaderboard access
- Prize distribution

## Design Considerations

1. **Security**:

   - Password hashing for user credentials
   - Role-based access control with Casbin
   - Data Sanitization to ensure valid inputs

2. **Data Integrity**:

   - Comprehensive foreign key constraints
   - Database Check constraints
   - Unique constraints to prevent duplicates

3. **Performance**:
   - Proper indexing on frequently queried columns
   - Efficient database relationships
   - Scalable architecture

## Troubleshooting

- Ensure Docker is running before starting the database
- Verify database connection parameters if migration fails
- Check for port conflicts if the server fails to start
