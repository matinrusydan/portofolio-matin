# Portfolio Admin Panel Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Supabase
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your credentials
3. Create storage buckets: `projects` and `certificates`
4. Run the SQL setup script in Supabase SQL Editor:
   - Copy contents of `scripts/setup-supabase.sql`
   - Paste and run in Supabase dashboard

### 3. Environment Variables
Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Run Development Server
```bash
pnpm run dev
```

### 6. Access Admin Panel
Open [http://localhost:3000/admin](http://localhost:3000/admin)

## 📊 Features

### Dashboard
- Real-time statistics (Projects, Certificates, Messages)
- Quick overview of recent activity

### Projects Management
- ✅ Create, Read, Update, Delete projects
- ✅ Image upload with drag & drop
- ✅ Tech stack management with tags
- ✅ Featured project toggle
- ✅ Search and filter capabilities

### Certificates Management
- ✅ Create, Read, Update, Delete certificates
- ✅ Image upload for certificate previews
- ✅ Category management
- ✅ Credential URL validation
- ✅ Issue date tracking

### Contact Messages
- ✅ View all incoming messages
- ✅ Status management (Pending, Read, Replied, Archived)
- ✅ Message details with metadata
- ✅ Bulk operations

## 🗂️ File Structure

```
app/
├── admin/
│   ├── layout.tsx          # Admin layout wrapper
│   ├── page.tsx           # Dashboard
│   ├── projects/
│   │   └── page.tsx       # Projects CRUD
│   ├── certificates/
│   │   └── page.tsx       # Certificates CRUD
│   └── messages/
│       └── page.tsx       # Messages management
├── api/
│   ├── projects/
│   │   ├── route.ts       # Projects API
│   │   └── [id]/route.ts  # Individual project API
│   ├── certificates/
│   │   ├── route.ts       # Certificates API
│   │   └── [id]/route.ts  # Individual certificate API
│   └── contact/
│       ├── route.ts       # Contact messages API
│       └── [id]/route.ts  # Individual message API
components/
├── admin/
│   ├── AdminLayout.tsx    # Main admin layout
│   ├── StatsCard.tsx      # Dashboard stats
│   ├── ImageUpload.tsx    # File upload component
│   ├── ProjectForm.tsx    # Project CRUD form
│   └── CertificateForm.tsx # Certificate CRUD form
lib/
├── prisma.ts             # Prisma client
├── supabase.ts           # Supabase client
└── validations.ts        # Zod schemas
prisma/
└── schema.prisma         # Database schema
scripts/
└── setup-supabase.sql    # Database setup script
```

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - List projects with pagination/search
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Certificates
- `GET /api/certificates` - List certificates with pagination/search
- `POST /api/certificates` - Create new certificate
- `GET /api/certificates/[id]` - Get certificate by ID
- `PUT /api/certificates/[id]` - Update certificate
- `DELETE /api/certificates/[id]` - Delete certificate

### Contact Messages
- `GET /api/contact` - List messages with pagination/search
- `POST /api/contact` - Submit new message (public)
- `GET /api/contact/[id]` - Get message by ID
- `PUT /api/contact/[id]` - Update message status
- `DELETE /api/contact/[id]` - Delete message

## 🛡️ Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Input validation** with Zod schemas
- **File upload validation** (type, size limits)
- **SQL injection protection** via Prisma ORM
- **CORS protection** for API routes

## 🎨 UI Components

Built with shadcn/ui components:
- Responsive design with Tailwind CSS
- Dark/light mode support
- Accessible components
- Consistent design system

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar for mobile
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `pnpm run build`
2. Start production server: `pnpm start`
3. Ensure all environment variables are set

## 🐛 Troubleshooting

### Common Issues

**Prisma client not found:**
```bash
npx prisma generate
```

**Database connection failed:**
- Check your `DATABASE_URL` in `.env.local`
- Ensure Supabase project is active
- Verify database password

**Storage upload failed:**
- Check storage bucket permissions
- Verify Supabase storage keys
- Ensure buckets exist: `projects`, `certificates`

**Admin panel not loading:**
- Check browser console for errors
- Verify all environment variables
- Ensure database tables exist

## 📞 Support

For issues or questions:
1. Check this README first
2. Review Supabase documentation
3. Check Prisma documentation
4. Open an issue in the repository

## 📝 License

This project is part of the portfolio website and follows the same license terms.