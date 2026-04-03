// lib/email-service.ts
interface InviteEmailData {
  email: string;
  groupName: string;
  inviterName: string;
  inviteLink: string;
}

interface ReminderEmailData {
  email: string;
  userName: string;
  goalName: string;
  reminderType: string;
  goalEndDate: string;
  daysLeft: number;
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

export async function sendReminderEmail({ email, userName, goalName, reminderType, goalEndDate, daysLeft }: ReminderEmailData): Promise<boolean> {
  console.log('🔔 Reminder email would be sent to:', email);
  console.log('🔔 User name:', userName);
  console.log('🔔 Subject: Reminder for goal:', goalName);
  console.log('🔔 Reminder type:', reminderType);
  console.log('🔔 Goal end date:', goalEndDate);
  console.log('🔔 Days left:', daysLeft);
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For development, we'll just return true
  // In production, you would integrate with your email service
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

export function generateReminderEmailTemplate({ userName, goalName, reminderType, goalEndDate, daysLeft }: Omit<ReminderEmailData, 'email'>): string {
  const reminderMessages = {
    'check-progress': `It's time to check your progress on "${goalName}"`,
    'deadline-approaching': `Your deadline for "${goalName}" is approaching`,
    'next-step': `Time to work on the next step for "${goalName}"`,
    'milestone': `Milestone check for "${goalName}"`
  };

  const reminderMessage = reminderMessages[reminderType as keyof typeof reminderMessages] || `Reminder for "${goalName}"`;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Goal Reminder: ${goalName}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Goal Reminder</h1>
            <p>${reminderMessage}</p>
        </div>
        <div class="content">
            <p>Hi ${userName}!</p>
            <p>This is your scheduled reminder for your goal: <strong>"${goalName}"</strong></p>
            
            <div class="highlight">
                <p><strong>📅 Goal Deadline:</strong> ${goalEndDate}</p>
                <p><strong>⏰ Days Remaining:</strong> ${daysLeft} days</p>
                <p><strong>🎯 Reminder Type:</strong> ${reminderType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>

            <p>Stay focused and keep pushing towards your goal! Every step counts.</p>
            
            <p style="text-align: center;">
                <a href="#" class="button">View Goal Dashboard</a>
            </p>
            
            <p><strong>💡 Quick Tips:</strong></p>
            <ul>
                <li>Break down your goal into smaller, manageable steps</li>
                <li>Track your progress regularly</li>
                <li>Celebrate small victories along the way</li>
                <li>Stay consistent with your efforts</li>
            </ul>
        </div>
        <div class="footer">
            <p>Sent by Schedule Us | Never Miss Your Goals</p>
            <p><small>You can manage your reminder preferences in your dashboard.</small></p>
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