/**
 * Create Initial Admin User
 * =========================
 * Run with: npx tsx scripts/create-admin.ts
 *
 * Make sure SUPABASE_SERVICE_ROLE_KEY is set in environment
 */

import { createClient } from '@supabase/supabase-js';

async function createAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.log('\nMake sure these environment variables are set:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Admin user details - update these!
  const email = process.env.ADMIN_EMAIL || 'stephanie@stephsbeautybox.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.ADMIN_NAME || 'Stephanie';
  const role = 'owner';

  console.log('\n🔧 Creating admin user...\n');
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   Role: ${role}\n`);

  // Check if user already exists
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists with this email.');
    console.log('   If you need to reset the password, use the Supabase dashboard.');
    process.exit(0);
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error('❌ Failed to create auth user:', authError.message);
    process.exit(1);
  }

  if (!authData.user) {
    console.error('❌ No user returned from createUser');
    process.exit(1);
  }

  console.log(`✅ Auth user created: ${authData.user.id}`);

  // Create admin_users record
  const { error: adminError } = await supabase.from('admin_users').insert({
    auth_id: authData.user.id,
    email,
    name,
    role,
    is_active: true,
  });

  if (adminError) {
    console.error('❌ Failed to create admin record:', adminError.message);
    // Rollback auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    process.exit(1);
  }

  console.log('✅ Admin user record created');
  console.log('\n🎉 Admin user created successfully!\n');
  console.log('   You can now log in at /admin/login');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
}

createAdmin().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
