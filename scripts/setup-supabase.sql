-- Supabase Setup Script
-- Run this in Supabase SQL Editor

-- Create custom types
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'READ', 'REPLIED', 'ARCHIVED');

-- Create tables
CREATE TABLE "projects" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imagePath" TEXT,
  "projectLink" TEXT,
  "techStack" TEXT[] DEFAULT '{}',
  "orderIndex" INTEGER DEFAULT 0,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "certificates" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "imagePath" TEXT,
  "credentialUrl" TEXT,
  "issuedAt" TIMESTAMP WITH TIME ZONE,
  "category" TEXT,
  "isFeatured" BOOLEAN DEFAULT FALSE,
  "orderIndex" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "contact_messages" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "ContactStatus" DEFAULT 'PENDING',
  "ipAddress" INET,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "repliedAt" TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_projects_featured ON projects("isFeatured");
CREATE INDEX idx_projects_order ON projects("orderIndex");
CREATE INDEX idx_certificates_featured ON certificates("isFeatured");
CREATE INDEX idx_certificates_category ON certificates("category");
CREATE INDEX idx_contact_status ON contact_messages("status");
CREATE INDEX idx_contact_created ON contact_messages("createdAt");

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth setup)
-- For now, allow all operations (you can restrict later)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_messages" ON contact_messages FOR ALL USING (true);

-- Insert sample data (optional)
INSERT INTO projects (title, description, "techStack", "isFeatured") VALUES
('Portfolio Website', 'Modern portfolio website built with Next.js', ARRAY['Next.js', 'TypeScript', 'Tailwind'], true),
('E-commerce App', 'Full-stack e-commerce application', ARRAY['React', 'Node.js', 'PostgreSQL'], false);

INSERT INTO certificates (title, issuer, category, "isFeatured") VALUES
('AWS Certified Developer', 'Amazon Web Services', 'Technical', true),
('React Certification', 'Meta', 'Technical', false);