# Panduan Migrasi dari Supabase ke Neon PostgreSQL

## 📋 Daftar Periksa Migrasi

### ✅ Yang Sudah Diselesaikan
- [x] Hapus dependensi Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Hapus file konfigurasi Supabase (`lib/supabase.ts`)
- [x] Update API routes untuk menghapus fungsionalitas storage Supabase
- [x] Update environment variables dan dokumentasi
- [x] Generate ulang Prisma client

### 🔄 Yang Perlu Dilakukan Selanjutnya

#### 1. Setup Database Neon
```bash
# 1. Buat project baru di https://neon.tech
# 2. Dapatkan connection string dari dashboard
# 3. Update DATABASE_URL di file .env
# 4. Jalankan script setup database
psql "your-neon-connection-string" -f scripts/setup-neon.sql
```

#### 2. Migrasi Data (Opsional)
Jika Anda memiliki data di Supabase yang perlu dimigrasi:

```sql
-- Export dari Supabase
pg_dump "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  --table=projects \
  --table=certificates \
  --table=contact_messages \
  --data-only \
  --inserts > supabase_data.sql

-- Import ke Neon
psql "your-neon-connection-string" -f supabase_data.sql
```

#### 3. Implementasi File Storage
Karena Supabase Storage telah dihapus, Anda perlu mengimplementasikan solusi penyimpanan file alternatif:

**Opsi yang Direkomendasikan:**
- **Local Storage**: Simpan file di folder `public/uploads/`
- **Cloudinary**: CDN untuk gambar
- **AWS S3**: Object storage
- **Vercel Blob**: Jika deploy ke Vercel

**Contoh implementasi Local Storage:**
```typescript
// lib/file-storage.ts
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

export async function saveFile(file: File, filename: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), 'public', 'uploads')
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)
  return `/uploads/${filename}`
}

export async function deleteFile(filepath: string): Promise<void> {
  const fullPath = join(process.cwd(), 'public', 'uploads', filepath)
  await unlink(fullPath)
}
```

#### 4. Update API Routes
Update bagian upload file di API routes:

```typescript
// Contoh di app/api/projects/route.ts
import { saveFile, deleteFile } from '@/lib/file-storage'

// Ganti bagian upload file
if (imageFile) {
  const fileName = `project-${Date.now()}.${imageFile.name.split('.').pop()}`
  imagePath = await saveFile(imageFile, fileName)
}
```

#### 5. Testing
```bash
# Test koneksi database
node scripts/test-db.js

# Push schema ke database
npx prisma db push

# Jalankan development server
pnpm run dev
```

## 🔧 Perubahan Teknis

### Environment Variables
**Sebelum (Supabase):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

**Sesudah (Neon):**
```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

### Dependensi yang Dihapus
- `@supabase/supabase-js`
- `@supabase/ssr`

### File yang Dihapus
- `lib/supabase.ts`
- `scripts/setup-supabase.sql`

### File yang Dimodifikasi
- `app/api/projects/route.ts`
- `app/api/projects/[id]/route.ts`
- `app/api/certificates/route.ts`
- `app/api/certificates/[id]/route.ts`
- `.env`
- `README-ADMIN.md`

## 🚨 Catatan Penting

1. **File Upload**: Fungsi upload file telah dinonaktifkan sementara. Implementasikan solusi storage sebelum menggunakan fitur upload.

2. **Database Schema**: Schema Prisma tetap sama, hanya provider database yang berubah dari Supabase ke Neon.

3. **Authentication**: Jika Anda menggunakan Supabase Auth, Anda perlu mengimplementasikan solusi alternatif (NextAuth.js, Clerk, dll.).

4. **Storage**: Supabase Storage telah sepenuhnya dihapus. Migrasi file yang ada ke solusi storage baru.

## 🐛 Troubleshooting

### Connection String Error
```
Error: The provided database string is invalid. Error parsing connection string: invalid IPv6 address
```
**Solusi:** Pastikan connection string dari Neon menggunakan format yang benar dan URL encoded jika diperlukan.

### Prisma Generate Error
```bash
npx prisma generate
```
Pastikan `DATABASE_URL` sudah di-set dengan benar.

### File Upload Error
Upload file akan gagal karena storage belum diimplementasikan. Lihat bagian "Implementasi File Storage" di atas.

## 📞 Support

Jika mengalami masalah selama migrasi:
1. Periksa log error di terminal
2. Verifikasi environment variables
3. Pastikan database Neon aktif dan accessible
4. Cek dokumentasi Neon untuk connection string format

---

**Status Migrasi:** ⚠️ Dalam Proses - Menunggu setup database Neon dan implementasi file storage