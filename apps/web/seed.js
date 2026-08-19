import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full database seed for Supabase...');

  // 1. Seed Admin User
  const adminEmail = 'admin@jasaan.gov.ph';
  const adminPassword = 'Admin@1234';
  const hashedPassword = hashPassword(adminPassword);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Super Administrator',
    },
  });
  console.log('✅ Admin user created/updated:', admin.email);

  // 2. Seed Deceased Records
  const sampleDeceased = [
    {
      REF_NO: 'REF-20250101-1001',
      PAYORS_NAME: 'Juan Dela Cruz',
      CONTACT_NO: '09123456789',
      NAME_OF_DECEASED: 'Maria Dela Cruz',
      ADDRESS: 'Zone 1, Bobontugan, Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1945-06-15'),
      DATE_OF_DEATH: new Date('2024-11-20'),
      YEAR: 2024,
      TOTAL_DUE: 5000,
      PAID: 5000,
      BALANCE: 0,
      STATUS: 'PAID',
      REMARKS: 'Section A - Plot 12',
    },
    {
      REF_NO: 'REF-20250102-1002',
      PAYORS_NAME: 'Roberto Santos',
      CONTACT_NO: '09234567890',
      NAME_OF_DECEASED: 'Pedro Santos',
      ADDRESS: 'Barangay Upper Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1952-03-10'),
      DATE_OF_DEATH: new Date('2024-12-05'),
      YEAR: 2024,
      TOTAL_DUE: 5000,
      PAID: 2500,
      BALANCE: 2500,
      STATUS: 'PARTIAL',
      REMARKS: 'Section A - Plot 15',
    },
    {
      REF_NO: 'REF-20250103-1003',
      PAYORS_NAME: 'Jose Rodriguez',
      CONTACT_NO: '09345678901',
      NAME_OF_DECEASED: 'Ana Rodriguez',
      ADDRESS: 'Poblacion, Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1960-08-22'),
      DATE_OF_DEATH: new Date('2025-01-12'),
      YEAR: 2025,
      TOTAL_DUE: 5000,
      PAID: 0,
      BALANCE: 5000,
      STATUS: 'UNPAID',
      REMARKS: 'Section B - Plot 04',
    },
    {
      REF_NO: 'REF-20250104-1004',
      PAYORS_NAME: 'Elena Reyes',
      CONTACT_NO: '09456789012',
      NAME_OF_DECEASED: 'Carlos Reyes',
      ADDRESS: 'Barangay Aplaya, Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1938-12-01'),
      DATE_OF_DEATH: new Date('2024-09-18'),
      YEAR: 2024,
      TOTAL_DUE: 5000,
      PAID: 5000,
      BALANCE: 0,
      STATUS: 'PAID',
      REMARKS: 'Section B - Plot 19',
    },
    {
      REF_NO: 'REF-20250105-1005',
      PAYORS_NAME: 'Sofia Gomez',
      CONTACT_NO: '09567890123',
      NAME_OF_DECEASED: 'Antonio Gomez',
      ADDRESS: 'Zone 3, Lower Jasaan, Misamis Oriental',
      DATE_OF_BIRTH: new Date('1958-04-30'),
      DATE_OF_DEATH: new Date('2025-02-01'),
      YEAR: 2025,
      TOTAL_DUE: 5000,
      PAID: 1500,
      BALANCE: 3500,
      STATUS: 'PARTIAL',
      REMARKS: 'Section C - Plot 08',
    },
  ];

  for (const record of sampleDeceased) {
    await prisma.deceasedRecord.upsert({
      where: { REF_NO: record.REF_NO },
      update: record,
      create: record,
    });
  }
  console.log(`✅ Seeded ${sampleDeceased.length} deceased records into Supabase`);

  // 3. Seed Inquiries
  const sampleInquiries = [
    {
      APP_ID: 'INQ-2025-001',
      FAMILY_NAME: 'Dela Cruz Family',
      DECEASED: 'Gabriel Dela Cruz',
      REQUESTED_PLOT: 'Section A - Plot 25',
      BURIAL_DATE: new Date('2025-03-10'),
      TIME: '10:00 AM',
      CONTACT: '09123456789',
      STATUS: 'Pending',
      email: 'juan@example.com',
      relationship: 'Son',
      address: 'Zone 1, Bobontugan, Jasaan',
      reason: 'Standard Burial Appointment',
      notes: 'Requesting assistance for funeral tent setup.',
    },
    {
      APP_ID: 'INQ-2025-002',
      FAMILY_NAME: 'Mendoza Family',
      DECEASED: 'Isabel Mendoza',
      REQUESTED_PLOT: 'Section B - Plot 12',
      BURIAL_DATE: new Date('2025-03-15'),
      TIME: '02:00 PM',
      CONTACT: '09789012345',
      STATUS: 'Approved',
      email: 'mendoza@example.com',
      relationship: 'Daughter',
      address: 'Poblacion, Jasaan',
      reason: 'Burial Plot Reservation',
      notes: 'Payment settled at MEEDO office.',
    },
  ];

  for (const inq of sampleInquiries) {
    await prisma.inquiries.upsert({
      where: { APP_ID: inq.APP_ID },
      update: inq,
      create: inq,
    });
  }
  console.log(`✅ Seeded ${sampleInquiries.length} inquiries into Supabase`);

  // 4. Seed Announcements
  const sampleAnnouncements = [
    {
      title: "All Saints' Day 2025 Cemetery Guidelines",
      content: 'Please be guided on the visiting hours, parking areas, and clean-as-you-go policy for the upcoming Undas observance at Jasaan Municipal Cemetery.',
      category: 'General Notice',
      badge: 'IMPORTANT',
      visibility: 'Public',
      status: 'active',
      date: new Date('2025-02-01'),
      views: 142,
    },
    {
      title: 'Digital Grave Mapping & Online Search System Live',
      content: 'The Municipality of Jasaan MEEDO office has launched the new 3D Cemetery Map and online record search portal for public convenience.',
      category: 'System Update',
      badge: 'NEW FEATURE',
      visibility: 'Public',
      status: 'active',
      date: new Date('2025-02-15'),
      views: 89,
    },
  ];

  for (const ann of sampleAnnouncements) {
    const existing = await prisma.announcement.findFirst({
      where: { title: ann.title }
    });
    if (!existing) {
      await prisma.announcement.create({ data: ann });
    }
  }
  console.log(`✅ Seeded announcements into Supabase`);

  console.log('🚀 Supabase database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
