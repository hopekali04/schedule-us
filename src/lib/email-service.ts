// lib/email-service.ts
interface InviteEmailData {
  email: string;
  groupName: string;
  inviterName: string;
  inviteLink: string;
}

export async function sendInviteEmail({ email, groupName, inviterName, inviteLink }: InviteEmailData): Promise<boolean> {
  // For now, this is a placeholder implementation
  // In a real environment, you would integrate with:
  // - SendGrid
  // - Nodemailer + SMTP
  // - AWS SES
  // - Other email service providers
  
  console.log('📧 Email would be sent to:', email);
  console.log('📧 Subject: Invitation to join', groupName);
  console.log('📧 Inviter:', inviterName);
  console.log('📧 Invite Link:', inviteLink);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For development, we'll just return true
  // In production, you would check if the email was actually sent
  return true;
}

export function generateInviteEmailTemplate({ groupName, inviterName, inviteLink }: Omit<InviteEmailData, 'email'>): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invitation to Join ${groupName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 You're Invited!</h1>
            <p>Join ${groupName} on Schedule Us</p>
        </div>
        <div class="content">
            <p>Hi there!</p>
            <p><strong>${inviterName}</strong> has invited you to join the group <strong>"${groupName}"</strong> on Schedule Us.</p>
            <p>Schedule Us is a powerful goal management platform where you can:</p>
            <ul>
                <li>Set and track personal and group goals</li>
                <li>Collaborate with team members</li>
                <li>Monitor progress with detailed analytics</li>
                <li>Never miss important milestones</li>
            </ul>
            <p>Click the button below to accept the invitation:</p>
            <p style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept Invitation</a>
            </p>
            <p><small>If the button doesn't work, copy and paste this link into your browser: <br>
            <a href="${inviteLink}">${inviteLink}</a></small></p>
            <p><em>This invitation will expire in 7 days for security reasons.</em></p>
        </div>
        <div class="footer">
            <p>Sent by Schedule Us | Goal Management Made Simple</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Email service configuration interface for future implementation
export interface EmailConfig {
  service: 'gmail' | 'outlook' | 'sendgrid' | 'ses' | 'smtp';
  apiKey?: string;
  user?: string;
  pass?: string;
  host?: string;
  port?: number;
}

// Future implementation placeholder
export async function configureEmailService(config: EmailConfig) {
  console.log('Email service configuration:', config.service);
  // This would set up the actual email service based on the config
}