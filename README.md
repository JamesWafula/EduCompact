<img width="1484" height="1299" alt="image" src="https://github.com/user-attachments/assets/ede056f6-767b-48cd-8997-93e4ddeb4c1e" />


<img width="3147" height="1630" alt="image" src="https://github.com/user-attachments/assets/c9cddcd9-5e21-4561-9dc0-2685b45a4433" />


<img width="3178" height="1627" alt="image" src="https://github.com/user-attachments/assets/8a4dd7e3-b324-4565-b5d2-55acacf90264" />

# EduCompact

A comprehensive full-stack record management system, ideal for international schools, facilitating the transition from manual file systems to digital record keeping.

## Features

- **Complete CRUD Operations** for students and staff
- **Robust File Management** with upload, download, preview, and delete capabilities
- **Document Support** for PDF, JPEG, and PNG formats
- **Comprehensive Forms** with validation and error handling
- **Dashboard & Reporting** with real-time statistics
- **Search & Filtering** capabilities
- **Responsive Design** for all devices

## Tech Stack

- Next.js 15
- TypeScript
- Prisma ORM
- SQLite (default, configurable)
- Tailwind CSS
- NextAuth
- bcryptjs
- Lucide React Icons

## Getting Started

## Deployment

You can deploy this project on **Vercel**, **Netlify**, or any Node.js-compatible server.

- Ensure your `.env` variables are set in your deployment environment.
- For Vercel, just import the repo and set environment variables in the dashboard.
- For custom servers, use `npm run build` and `npm start`.

### Prerequisites

- **Node.js** >= 18.18
- **npm** or **pnpm**
- **SQLite** (default) or another supported DB
- **Git** (optional)

### Installation

1. Clone the repository

git clone <repository-url>
cd eduCompact


2. Install dependencies

npm install


3. Set up environment variables

cp .env.example .env

4. Initialize the database

npm run db:generate
npm run db:push


5. Seed the database (optional)

npm run db:seed


6. Create users script

tsx scripts/seed-users.ts


7. Start the development server

npm run dev


# User Seed Script

## Creating Users

The `seed-users.ts` script creates two users in the database using the Prisma ORM. The following users are created:

1. **Administrator User**
   - **Email:** administrator@educompact.education
   - **Password:** `adminPassword` (update this with an actual password)
   - **Role:** ADMINISTRATOR

2. **Head User**
   - **Email:** head@educompact.education
   - **Password:** `headPassword` (update this with an actual password)
   - **Role:** HEAD

### Instructions

1. **Run the Seed Script**
   - Ensure your database is connected and Prisma is set up properly.
   - Execute the seed script with:

     npx ts-node path/to/seed-users.ts

   - This will create the users in your database.

2. **Login Credentials**
   - Use the following credentials to log in:
     - **Administrator Login:**
       - Email: administrator@educompact.education
       - Password: `adminPassword` (ensure to replace with the actual password you set)
     - **Head Login:**
       - Email: head@educompact.education
       - Password: `headPassword` (ensure to replace with the actual password you set)

Make sure to change the placeholder passwords (`adminPassword` and `headPassword`) to secure, actual passwords before running the script.


Visit `http://localhost:3000` to access the application.

##Project Structure


<img width="711" height="689" alt="image" src="https://github.com/user-attachments/assets/44c6bffb-7c0b-4ff3-ab7c-5362a8010e16" />


## File Upload Structure

The system organizes uploaded files in the following structure:


<img width="327" height="512" alt="image" src="https://github.com/user-attachments/assets/6dd38914-9dae-468a-95ae-58d9527a9e64" />


## Database Schema

The system uses a comprehensive database schema supporting:

- **Students**: Personal info, academic records, documents, guardians, emergency contacts
- **Staff**: Personal info, professional details, type-specific profiles, documents
- **Relationships**: Proper foreign key relationships with cascade deletes

## API Endpoints

### Students
- `GET /api/students` - List students with pagination and search
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Staff
- `GET /api/staff` - List staff with search
- `POST /api/staff` - Create new staff member
- `GET /api/staff/[id]` - Get staff details
- `PUT /api/staff/[id]` - Update staff
- `DELETE /api/staff/[id]` - Delete staff

### File Upload
- `POST /api/upload` - Upload file
- `DELETE /api/upload` - Delete file

## Deployment

The system is ready for deployment with:

- Production-optimized build configuration
- Security middleware
- Error handling and validation
- File upload limits and validation
- Database connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

# MIT License
Copyright (c) 2025 EduCompact

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
