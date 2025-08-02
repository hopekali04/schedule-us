// src/lib/mailer.ts

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(email: string, inviteLink: string): Promise<void> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Schedule-Us <onboarding@resend.dev>',
      to: [email],
      subject: 'You\'ve been invited to join a group!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Group Invitation</h2>
          <p>You've been invited to join a group!</p>
          <p>Click the button below to accept the invitation:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
            ${inviteLink}
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send invite email: ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log('Email sent successfully:', data?.id);
  } catch (error) {
    throw new Error(`Failed to send invite email: ${error instanceof Error ? error.message : String(error)}`);
  }
}


