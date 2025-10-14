-- Neon Database Setup Script
-- Execute this script in Neon SQL Editor or psql

-- Create tables
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "imagePath" TEXT,
    "projectLink" TEXT,
    "techStack" TEXT[] DEFAULT '{}',
    "orderIndex" INTEGER DEFAULT 0,
    "isFeatured" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    "imagePath" TEXT,
    "credentialUrl" TEXT,
    "issuedAt" TIMESTAMP WITH TIME ZONE,
    category TEXT,
    "isFeatured" BOOLEAN DEFAULT FALSE,
    "orderIndex" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'READ', 'REPLIED', 'ARCHIVED')),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "repliedAt" TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects("isFeatured");
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("orderIndex");
CREATE INDEX IF NOT EXISTS idx_certificates_featured ON certificates("isFeatured");
CREATE INDEX IF NOT EXISTS idx_certificates_order ON certificates("orderIndex");
CREATE INDEX IF NOT EXISTS idx_certificates_category ON certificates(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages("createdAt");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Insert sample data
-- Uncomment the following lines if you want sample data

/*
INSERT INTO projects (title, description, "techStack", "isFeatured") VALUES
('Portfolio Website', 'Modern portfolio website built with Next.js', ARRAY['Next.js', 'TypeScript', 'Tailwind'], true),
('E-commerce App', 'Full-stack e-commerce application', ARRAY['React', 'Node.js', 'PostgreSQL'], false);

INSERT INTO certificates (title, issuer, category, "isFeatured") VALUES
('AWS Certified Developer', 'Amazon Web Services', 'Technical', true),
('React Certification', 'Meta', 'Technical', false);
*/