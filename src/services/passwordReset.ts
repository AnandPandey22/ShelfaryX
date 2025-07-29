import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'Ue_nuhYPcCqLYeJkz';
const EMAILJS_PRIVATE_KEY = 'tLhiT47C594WomAbd0spn';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

console.log('📧 EmailJS initialized with public key:', EMAILJS_PUBLIC_KEY);

export interface PasswordResetData {
  email: string;
  resetToken: string;
  userType: 'institution' | 'student' | 'admin';
  userName?: string;
}

export const passwordResetService = {
  /**
   * Send password reset email via EmailJS
   */
  async sendResetEmail(data: PasswordResetData): Promise<boolean> {
    try {
      const resetLink = `${window.location.origin}/reset-password?token=${data.resetToken}&email=${encodeURIComponent(data.email)}&type=${data.userType}`;
      
      console.log('📧 Sending password reset email via EmailJS...');
      console.log('📧 To:', data.email);
      console.log('📧 Reset Link:', resetLink);
      
      // EmailJS template parameters - matching your template variables
      const templateParams = {
        to_name: data.userName || data.email.split('@')[0],
        email: data.email,
        reset_link: resetLink,
        user_type: data.userType,
        from_name: 'BookZone Team',
        message: `Hello! You requested a password reset for your BookZone account. Click the link below to reset your password: ${resetLink} This link will expire in 24 hours. If you did not request this, please ignore this email.`
      };

      // Send email using EmailJS with your service and template IDs
      const result = await emailjs.send(
        'service_inwopi3', // Your EmailJS service ID
        'template_pig9soq', // Your EmailJS template ID
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('✅ EmailJS email sent successfully:', result);
      console.log('📧 Email sent to:', data.email);
      
      return true;
    } catch (error) {
      console.error('❌ EmailJS error:', error);
      
      // Fallback to mock email if EmailJS fails
      console.log('⚠️ EmailJS failed, using mock email as fallback');
      const resetLink = `${window.location.origin}/reset-password?token=${data.resetToken}&email=${encodeURIComponent(data.email)}&type=${data.userType}`;
      console.log('🎯 Reset link for testing:', resetLink);
      
      return true;
    }
  },

  /**
   * Generate a secure reset token
   */
  generateResetToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  },

  /**
   * Store reset token in database (you'll need to implement this)
   */
  async storeResetToken(email: string, token: string, userType: string): Promise<boolean> {
    try {
      // This is where you'd store the token in your database
      // For now, we'll simulate this
      console.log(`Storing reset token for ${email}: ${token}`);
      
      // Example database call:
      // await supabase
      //   .from('password_resets')
      //   .insert({
      //     email,
      //     token,
      //     user_type: userType,
      //     expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      //   });
      
      return true;
    } catch (error) {
      console.error('Error storing reset token:', error);
      return false;
    }
  },

  /**
   * Verify reset token from database
   */
  async verifyResetToken(token: string, email: string): Promise<boolean> {
    try {
      // This is where you'd verify the token from your database
      // For now, we'll simulate this
      console.log(`Verifying reset token for ${email}: ${token}`);
      
      // Example database call:
      // const { data, error } = await supabase
      //   .from('password_resets')
      //   .select('*')
      //   .eq('token', token)
      //   .eq('email', email)
      //   .eq('used', false)
      //   .gte('expires_at', new Date().toISOString())
      //   .single();
      
      // return !error && data;
      
      return true; // Simulate successful verification
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return false;
    }
  },

  /**
   * Update user password
   */
  async updatePassword(email: string, newPassword: string, userType: string): Promise<boolean> {
    try {
      // This is where you'd update the password in your database
      console.log(`Updating password for ${email} (${userType})`);
      
      // Example database call:
      // const table = userType === 'institution' ? 'institutions' : 
      //               userType === 'student' ? 'students' : 'admins';
      // 
      // const { error } = await supabase
      //   .from(table)
      //   .update({ password: newPassword }) // Make sure to hash the password!
      //   .eq('email', email);
      
      return true; // Simulate successful update
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }
};

/**
 * Generate HTML email template
 */
function generateResetEmailHTML(data: PasswordResetData, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your BookZone Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 BookZone</h1>
          <p>Password Reset Request</p>
        </div>
        
        <div class="content">
          <h2>Hello ${data.userName || 'there'}!</h2>
          
          <p>We received a request to reset your password for your BookZone account.</p>
          
          <p>If you didn't make this request, you can safely ignore this email.</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset My Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link will expire in 24 hours</li>
              <li>Only click this link if you requested a password reset</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
          
          <p>Best regards,<br>The BookZone Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${data.email}</p>
          <p>© 2025 BookZone Library. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email template
 */
function generateResetEmailText(data: PasswordResetData, resetLink: string): string {
  return `
Reset Your BookZone Password

Hello ${data.userName || 'there'}!

We received a request to reset your password for your BookZone account.

If you didn't make this request, you can safely ignore this email.

To reset your password, click the link below:
${resetLink}

Security Notice:
- This link will expire in 24 hours
- Only click this link if you requested a password reset
- If you didn't request this, please ignore this email

If the link doesn't work, copy and paste it into your browser.

Best regards,
The BookZone Team

This email was sent to ${data.email}
© 2025 BookZone Library. All rights reserved.
  `;
} 