import nodemailer from 'nodemailer';

async function test() {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  const emailFrom = process.env.EMAIL_FROM?.trim();

  console.log('EMAIL_USER:', user);
  console.log('EMAIL_APP_PASSWORD length:', pass?.length);
  console.log('EMAIL_FROM:', emailFrom);

  if (!user || !pass) {
    console.error('Missing EMAIL_USER or EMAIL_APP_PASSWORD in .env');
    process.exit(1);
  }

  const senderEmail = user;
  const fromHeader = emailFrom
    ? `"${emailFrom.replace(/"/g, '')}" <${senderEmail}>`
    : `"Municipality of Jasaan Cemetery Management System" <${senderEmail}>`;

  console.log('\nUsing From header:', fromHeader);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  try {
    console.log('\nVerifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    console.log('\nSending test OTP email...');
    const info = await transporter.sendMail({
      from: fromHeader,
      to: user,
      subject: 'Test OTP from Cemetery Management',
      text: 'Your test OTP code is: 123456',
      html: '<p>Your test OTP code is: <strong>123456</strong></p>',
    });
    console.log('✅ Email sent! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

test();
