'use server';

export async function sendSmsNotification(phone: string, message: string) {
  try {
    // Format Philippine numbers starting with 09 to +639
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('09') && formattedPhone.length === 11) {
      formattedPhone = '+63' + formattedPhone.substring(1);
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone || accountSid === 'your_twilio_account_sid_here') {
      return { success: false, error: 'Twilio credentials are not configured in the .env file.' };
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
      To: formattedPhone,
      From: fromPhone,
      Body: message,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Failed to send SMS via Twilio' };
    }
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return { success: false, error: error?.message || 'Failed to send SMS' };
  }
}
