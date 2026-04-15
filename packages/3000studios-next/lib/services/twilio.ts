/**
 * Twilio Service
 * Handles SMS and voice notifications
 */

import axios from 'axios';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;

const twilioApi = axios.create({
  baseURL: `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`,
  auth: {
    username: TWILIO_ACCOUNT_SID || '',
    password: TWILIO_AUTH_TOKEN || '',
  },
});

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface VoiceCall {
  to: string;
  from?: string;
  url: string; // TwiML URL for call instructions
}

export async function sendSMS(message: SMSMessage): Promise<string> {
  try {
    const response = await twilioApi.post(
      '/Messages.json',
      new URLSearchParams({
        To: message.to,
        From: message.from || TWILIO_PHONE || '',
        Body: message.body,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.sid;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to send SMS');
  }
}

export async function makeVoiceCall(call: VoiceCall): Promise<string> {
  try {
    const response = await twilioApi.post(
      '/Calls.json',
      new URLSearchParams({
        To: call.to,
        From: call.from || TWILIO_PHONE || '',
        Url: call.url,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.sid;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to make voice call');
  }
}

export async function getMessageStatus(messageSid: string): Promise<string> {
  try {
    const response = await twilioApi.get(`/Messages/${messageSid}.json`);
    return response.data.status;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to get message status');
  }
}

export async function sendOrderNotification(
  phoneNumber: string,
  orderNumber: string,
  total: number
): Promise<void> {
  const message = `Thank you for your order #${orderNumber}! Your total is $${total.toFixed(2)}. You'll receive tracking information soon. - 3000 Studios`;

  await sendSMS({
    to: phoneNumber,
    body: message,
  });
}

export async function sendStreamNotification(
  phoneNumber: string,
  streamTitle: string,
  streamUrl: string
): Promise<void> {
  const message = `🔴 LIVE NOW: ${streamTitle}! Watch at ${streamUrl} - 3000 Studios`;

  await sendSMS({
    to: phoneNumber,
    body: message,
  });
}

