# 🔐 Password Reset Feature Setup Guide

## 📋 Overview
This guide will help you set up the complete password reset functionality for BookZone, allowing all user types (institution, student, admin) to reset their passwords via email.

## 🚀 Quick Setup Steps

### 1. **Database Setup** ✅
Run the SQL in `PASSWORD_RESET_SETUP.sql` in your Supabase SQL editor to create the required table.

### 2. **Email Service Setup** 📧

#### **Option A: Resend (Recommended - Free)**
1. Go to [resend.com](https://resend.com) and create a free account
2. Get your API key from the dashboard
3. Add to your environment variables:
   ```env
   REACT_APP_RESEND_API_KEY=your_resend_api_key_here
   ```

#### **Option B: Other Email Services**
- **Brevo**: 300 emails/day free
- **Mailgun**: 5,000 emails/month free
- **SendGrid**: 100 emails/day free
- **AWS SES**: Very cheap (~$0.10 per 1,000 emails)

### 3. **Domain Verification** 🌐
For production, verify your domain with your email service provider:
- Add DNS records (MX, SPF, DKIM)
- Update the `from` email in `src/services/passwordReset.ts`:
  ```typescript
  from: 'BookZone <noreply@yourdomain.com>'
  ```

### 4. **Environment Variables** ⚙️
Create a `.env` file in your project root:
```env
REACT_APP_RESEND_API_KEY=your_api_key_here
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 How It Works

### **Step 1: User Requests Reset**
1. User clicks "Forgot Password?" on login form
2. Enters their email address
3. System validates email exists in database
4. Generates secure 32-character token
5. Stores token in `password_resets` table
6. Sends email with reset link

### **Step 2: User Receives Email**
- Professional HTML email template
- Secure reset link with token
- 24-hour expiration
- Clear instructions and security warnings

### **Step 3: User Resets Password**
1. Clicks link in email
2. System validates token
3. User enters new password
4. Password updated in database
5. Token marked as used
6. Success confirmation

## 📧 Email Template Features

### **Professional Design**
- BookZone branding
- Responsive layout
- Clear call-to-action button
- Security warnings
- Fallback text link

### **Security Features**
- 24-hour expiration
- One-time use tokens
- Secure token generation
- Email validation
- User type verification

## 🛡️ Security Considerations

### **Token Security**
- 32-character random tokens
- Database storage with expiration
- One-time use only
- Automatic cleanup of expired tokens

### **Email Security**
- HTTPS reset links
- Domain verification
- SPF/DKIM authentication
- Clear security warnings

### **Database Security**
- Row Level Security (RLS) enabled
- Proper indexing for performance
- Automatic timestamp updates
- Input validation

## 🔄 User Flow

```
Login Form → Forgot Password → Email Input → Token Generation → Email Sent
                                                                    ↓
Reset Page ← Email Link ← Professional Email ← Database Storage ← Token Storage
     ↓
Password Input → Validation → Database Update → Success Page → Login
```

## 📱 Features by User Type

### **Institution Users**
- Reset password via email
- Professional email template
- Secure token validation
- Database password update

### **Student Users**
- Same secure process
- Email validation
- Password strength requirements
- Success confirmation

### **Admin Users**
- Special handling for admin@bookzone.com
- Same security features
- Database integration

## 🧪 Testing

### **Test Scenarios**
1. **Valid Email**: Should send reset email
2. **Invalid Email**: Should show "not found" error
3. **Expired Token**: Should show "expired" error
4. **Used Token**: Should show "invalid" error
5. **Weak Password**: Should show validation error
6. **Mismatched Passwords**: Should show error

### **Test Commands**
```bash
# Build the project
npm run build

# Check TypeScript
npx tsc --noEmit

# Run development server
npm run dev
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Email Not Sending**
- Check API key configuration
- Verify domain settings
- Check email service quotas
- Review console errors

#### **Token Validation Fails**
- Check database connection
- Verify table structure
- Check token expiration
- Review database logs

#### **Password Update Fails**
- Check user type determination
- Verify database permissions
- Check password hashing
- Review error logs

### **Debug Steps**
1. Check browser console for errors
2. Verify environment variables
3. Test database connections
4. Check email service status
5. Review Supabase logs

## 📊 Monitoring

### **Key Metrics to Track**
- Password reset requests
- Email delivery rates
- Token validation success
- Password update success
- Error rates by user type

### **Logging**
- All reset requests logged
- Token generation/validation
- Email sending status
- Password update attempts
- Error details for debugging

## 🔮 Future Enhancements

### **Potential Improvements**
- Rate limiting for reset requests
- SMS verification option
- Security questions
- Password strength indicators
- Audit trail for password changes
- Multi-factor authentication

### **Advanced Features**
- Password history tracking
- Account lockout after failed attempts
- IP-based security
- Device fingerprinting
- Security notifications

## 📞 Support

### **Getting Help**
1. Check this guide first
2. Review console errors
3. Test with different email services
4. Verify database setup
5. Check environment variables

### **Useful Resources**
- [Resend Documentation](https://resend.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)

## ✅ Checklist

- [ ] Database table created
- [ ] Email service configured
- [ ] Environment variables set
- [ ] Domain verified (production)
- [ ] Email templates customized
- [ ] Testing completed
- [ ] Security review done
- [ ] Documentation updated

---

**🎉 Congratulations!** Your password reset feature is now ready to use. Users can securely reset their passwords through a professional email-based system. 