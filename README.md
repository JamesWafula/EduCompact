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
\`\`\`bash
git clone <repository-url>
cd eduCompact
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
\`\`\`

4. Initialize the database
\`\`\`bash
npm run db:generate
npm run db:push
\`\`\`

5. Seed the database (optional)
\`\`\`bash
npm run db:seed
\`\`\`

6. Create users script
\`\`\`
tsx scripts/seed-users.ts
\`\`\`

7. Start the development server
\`\`\`bash
npm run dev
\`\`\`

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
     ```bash
     npx ts-node path/to/seed-users.ts
     ```
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
├── app/                    # Next.js app directory (routes, pages, API endpoints)
│   ├── api/                # API routes (students, staff, auth, reports, upload)
│   ├── auth/               # Auth-related pages
│   ├── reports/            # Reports pages
│   ├── settings/           # Settings pages
│   ├── staff/              # Staff pages
│   ├── students/           # Student pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries (e.g., prisma, auth, file-upload)
├── prisma/                 # Prisma schema and DB tools
├── public/                 # Static assets
├── scripts/                # Seed and utility scripts
├── styles/                 # Additional styles
├── .env.example            # Example environment variables
├── package.json            # Project scripts and dependencies
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── middleware.ts           # NextAuth middleware for route protection
└── ...                     # Other config and build files

## File Upload Structure

The system organizes uploaded files in the following structure:

\`\`\`
public/
├── uploads/
│   ├── students/
│   │   ├── studentPhoto
│   │   ├── birthCertificateFile
│   │   ├── passportFile
│   │   ├── studentPassFile
│   │   ├── recentReportFile
│   │   └── additionalAttachment
│   └── staff/
│       ├── resume
│       ├── passportAttachment
│       ├── residentPermitAttachment
│       ├── workPermitAttachment
│       ├── teachingLicenseAttachment
│       ├── tcuAttachment
│       ├── nationalIdAttachment
│       ├── nssfAttachment
│       └── tinAttachment
\`\`\`

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

This project is licensed under the MIT License.
