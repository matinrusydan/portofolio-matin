#!/usr/bin/env node

/**
 * Script Setup Akun Admin Portfolio
 *
 * Script ini membantu mengatur kredensial admin untuk aplikasi portfolio.
 * Script ini menghasilkan kredensial yang aman dan mengupdate file environment.
 *
 * Cara pakai:
 *   node scripts/setup-admin.js
 *   # atau
 *   npm run setup-admin
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const ENV_LOCAL = path.join(__dirname, '..', '.env');
const ENV_PRODUCTION = path.join(__dirname, '..', '.env.production');

// Buat interface readline untuk input user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Generate password acak yang aman
 */
function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  // Pastikan minimal ada satu dari setiap tipe
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // huruf besar
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // huruf kecil
  password += '0123456789'[Math.floor(Math.random() * 10)]; // angka
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // karakter khusus

  // Isi sisanya secara acak
  for (let i = password.length; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // Acak urutan password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Update file environment dengan kredensial admin
 */
function updateEnvFile(filePath, username, password) {
  let content = '';

  // Baca konten yang ada jika file sudah ada
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // Hapus kredensial admin yang sudah ada jika ada
  const lines = content.split('\n').filter(line =>
    !line.startsWith('ADMIN_USERNAME=') && !line.startsWith('ADMIN_PASSWORD=')
  );

  // Tambahkan kredensial admin baru
  lines.push('');
  lines.push('# Admin Authentication');
  lines.push(`ADMIN_USERNAME=${username}`);
  lines.push(`ADMIN_PASSWORD=${password}`);

  // Tulis kembali ke file
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`✅ Updated ${path.basename(filePath)}`);
}

/**
 * Fungsi setup utama
 */
async function setupAdmin() {
  console.log('🔐 Setup Akun Admin Portfolio');
  console.log('=============================\n');

  // Tanya username
  const username = await new Promise(resolve => {
    rl.question('Masukkan username admin (default: admin): ', (answer) => {
      resolve(answer.trim() || 'admin');
    });
  });

  // Tanya pilihan password
  const passwordChoice = await new Promise(resolve => {
    rl.question('Pilih opsi password:\n1. Generate password aman otomatis\n2. Masukkan password sendiri\nPilih (1/2): ', (answer) => {
      resolve(answer.trim());
    });
  });

  let password;
  if (passwordChoice === '2') {
    password = await new Promise(resolve => {
      rl.question('Masukkan password admin: ', (answer) => {
        resolve(answer);
      });
    });

    if (!password || password.length < 8) {
      console.log('❌ Password minimal 8 karakter.');
      rl.close();
      process.exit(1);
    }
  } else {
    password = generateSecurePassword();
    console.log(`🔑 Password aman yang di-generate: ${password}`);
    console.log('⚠️  Simpan password ini dengan aman!\n');
  }

  // Konfirmasi setup
  const confirm = await new Promise(resolve => {
    rl.question(`\nSetup akun admin dengan:\nUsername: ${username}\nPassword: ${password}\n\nLanjutkan? (y/N): `, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });

  if (confirm !== 'y' && confirm !== 'yes') {
    console.log('❌ Setup dibatalkan.');
    rl.close();
    return;
  }

  try {
    // Update file environment
    updateEnvFile(ENV_LOCAL, username, password);
    updateEnvFile(ENV_PRODUCTION, username, password);

    console.log('\n🎉 Setup akun admin berhasil!');
    console.log('\n📋 Ringkasan:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔒 Penting:');
    console.log('   - Jaga kerahasiaan kredensial ini');
    console.log('   - Ganti password secara berkala');
    console.log('   - Jangan commit file .env ke version control');
    console.log('\n🚀 Sekarang bisa jalankan server development dan akses /admin/login');

  } catch (error) {
    console.error('❌ Error setup akun admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle script execution
if (require.main === module) {
  setupAdmin().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { setupAdmin, generateSecurePassword };