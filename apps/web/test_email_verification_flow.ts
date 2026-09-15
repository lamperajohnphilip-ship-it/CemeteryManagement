import { sendEmailOtp, verifyEmailOtp, isEmailVerifiedRecently } from './app/actions/otp';
import { submitInquiry, acceptInquiry, rejectInquiry, resendInquiryEmail } from './app/actions/inquiry';
import { prisma } from './lib/prisma';

async function runVerificationTests() {
  console.log('=== STARTING EMAIL VERIFICATION & INQUIRY FLOW TESTS ===');

  const testEmail = `test_citizen_${Date.now()}@example.com`;
  const testName = 'Maria Santos';

  // 1. Request OTP
  console.log(`\n[1] Testing sendEmailOtp to ${testEmail}...`);
  const otpRes = await sendEmailOtp(testEmail, testName);
  console.log('sendEmailOtp result:', otpRes);
  if (!otpRes.success) {
    throw new Error('sendEmailOtp failed: ' + otpRes.message);
  }

  // 2. Test Rate Limiting Cooldown (within 45s)
  console.log('\n[2] Testing Rate Limiting (Immediate 2nd request)...');
  const rateLimitRes = await sendEmailOtp(testEmail, testName);
  console.log('Rate limit result:', rateLimitRes);
  if (rateLimitRes.success) {
    throw new Error('Rate limit failed: 2nd immediate request was allowed!');
  }
  console.log('✓ Rate limiting correctly blocked immediate re-request:', rateLimitRes.message);

  // 3. Find the created verification record in the DB
  const dbRecord = await prisma.emailVerification.findFirst({
    where: { email: testEmail },
    orderBy: { createdAt: 'desc' },
  });
  console.log('\n[3] DB Verification record found:', {
    id: dbRecord?.id,
    email: dbRecord?.email,
    codeHash: dbRecord?.codeHash?.slice(0, 16) + '...',
    expiresAt: dbRecord?.expiresAt,
    attempts: dbRecord?.attempts,
    verifiedAt: dbRecord?.verifiedAt,
  });

  if (!dbRecord || !dbRecord.codeHash) {
    throw new Error('Verification record not found in PostgreSQL database!');
  }

  // 4. Test Incorrect Code Attempt
  console.log('\n[4] Testing invalid code attempt (000000)...');
  const invalidRes = await verifyEmailOtp(testEmail, '000000');
  console.log('Invalid code verification result:', invalidRes);
  if (invalidRes.success) {
    throw new Error('Invalid code was incorrectly accepted!');
  }
  console.log('✓ Incorrect code properly rejected:', invalidRes.message);

  // 5. Test Code Verification using debug code if unconfigured or known
  // In devFallback, debugCode is returned. Let's check:
  const codeToVerify = (otpRes as any).debugCode;
  if (codeToVerify) {
    console.log(`\n[5] Testing valid code verification with code: ${codeToVerify}...`);
    const validRes = await verifyEmailOtp(testEmail, codeToVerify);
    console.log('Valid verification result:', validRes);
    if (!validRes.success) {
      throw new Error('Valid code failed verification: ' + validRes.message);
    }
    console.log('✓ Email verified successfully in DB!');

    const isVerified = await isEmailVerifiedRecently(testEmail);
    console.log('isEmailVerifiedRecently check:', isVerified);
    if (!isVerified) throw new Error('isEmailVerifiedRecently returned false!');
  } else {
    // Manually mark verified for test flow if real SMTP sent email
    await prisma.emailVerification.update({
      where: { id: dbRecord.id },
      data: { verifiedAt: new Date() },
    });
    console.log('✓ Manually marked as verified in DB for end-to-end inquiry test.');
  }

  // 6. Test submitInquiry with verified email
  console.log('\n[6] Testing submitInquiry with verified email...');
  const appRef = 'TEST-' + Date.now().toString().slice(-5);
  const inquiryRes = await submitInquiry({
    APP_ID: appRef,
    FAMILY_NAME: testName,
    email: testEmail,
    CONTACT: '0917-888-9999',
    relationship: 'Child / Son / Daughter',
    reason: 'Burial Scheduling & Plot Inquiry',
    DECEASED: 'Pedro Santos',
    REQUESTED_PLOT: 'Section B, Row 4, Plot 12',
    BURIAL_DATE: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    TIME: '10:00 AM – 11:00 AM',
    notes: 'Test automated inquiry verification run',
  });
  console.log('Inquiry creation result:', {
    success: inquiryRes.success,
    id: inquiryRes.record?.id,
    appId: inquiryRes.record?.APP_ID,
    emailVerified: inquiryRes.record?.emailVerified,
  });

  if (!inquiryRes.success || !inquiryRes.record) {
    throw new Error('submitInquiry failed: ' + inquiryRes.message);
  }
  const createdInquiryId = inquiryRes.record.id;

  // 7. Test acceptInquiry
  console.log(`\n[7] Testing acceptInquiry for ID ${createdInquiryId}...`);
  const acceptRes = await acceptInquiry(createdInquiryId, 'Approved schedule slot.');
  console.log('acceptInquiry result:', {
    success: acceptRes.success,
    status: acceptRes.record?.STATUS,
    emailSent: acceptRes.emailSent,
    emailError: acceptRes.emailError,
  });

  if (!acceptRes.success || acceptRes.record?.STATUS !== 'Accepted') {
    throw new Error('acceptInquiry failed!');
  }
  console.log('✓ Inquiry accepted status verified.');

  // 8. Test rejectInquiry
  console.log(`\n[8] Testing rejectInquiry on a second inquiry...`);
  const appRef2 = 'TEST-REJ-' + Date.now().toString().slice(-4);
  const inq2 = await submitInquiry({
    APP_ID: appRef2,
    FAMILY_NAME: 'Test Applicant 2',
    email: testEmail,
    CONTACT: '0918-111-2222',
    relationship: 'Relative',
    reason: 'Grave Reservation',
  });

  const rejectRes = await rejectInquiry(inq2.record!.id, 'Slot unavailable on chosen date.');
  console.log('rejectInquiry result:', {
    success: rejectRes.success,
    status: rejectRes.record?.STATUS,
    remarks: rejectRes.record?.remarks,
    emailSent: rejectRes.emailSent,
  });

  if (!rejectRes.success || rejectRes.record?.STATUS !== 'Rejected') {
    throw new Error('rejectInquiry failed!');
  }
  console.log('✓ Inquiry rejected status verified.');

  // 9. Inspect EmailNotificationLog in DB
  console.log('\n[9] Inspecting EmailNotificationLog in DB...');
  const logs = await prisma.emailNotificationLog.findMany({
    where: { recipient: testEmail },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Found ${logs.length} email log entries for ${testEmail}:`);
  logs.forEach(l => {
    console.log(`  - [${l.status}] Type: "${l.emailType}" | Subject: "${l.subject}"`);
  });

  if (logs.length === 0) {
    throw new Error('No email notification logs found in database!');
  }

  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY! ===\n');
}

runVerificationTests()
  .catch(err => {
    console.error('Test run failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
