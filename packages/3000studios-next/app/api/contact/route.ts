import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    // For now, we log the submission
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Message received successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

