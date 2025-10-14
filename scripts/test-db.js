// Test Neon Database Connection
// Run with: node scripts/test-db.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing Neon database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Neon database connection successful!');

    // Test queries
    const projectCount = await prisma.project.count();
    const certificateCount = await prisma.certificate.count();
    const messageCount = await prisma.contactMessage.count();

    console.log('📊 Database stats:');
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Certificates: ${certificateCount}`);
    console.log(`   Messages: ${messageCount}`);

    // Test sample queries
    const projects = await prisma.project.findMany({ take: 2 });
    console.log('📝 Sample projects:', projects.length > 0 ? projects.map(p => p.title) : 'No projects found');

    console.log('🎉 All tests passed! Neon database is working correctly.');

  } catch (error) {
    console.error('❌ Neon database test failed:', error.message);
    console.error('\n💡 Make sure to:');
    console.error('   1. Update DATABASE_URL in .env with your Neon connection string');
    console.error('   2. Run the SQL setup script: scripts/setup-neon.sql');
    console.error('   3. Verify your Neon database is active');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();