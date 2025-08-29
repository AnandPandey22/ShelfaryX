# 📚 ShelfaryX - Library Management System

A comprehensive library management system built with React, TypeScript, and Supabase. Features multi-institution support, student portals, admin panels, and real-time email notifications.

## ✨ Features

### 🏫 Multi-Institution Support
- Multiple colleges/universities can register
- Separate data isolation for each institution
- Institution-specific admin panels

### 👨‍🎓 Student Portal
- Book search and borrowing
- Personal dashboard with statistics
- Due date notifications and overdue alerts
- Invoice generation and download
- Mobile-responsive design

### 📚 Institution Management
- Complete book catalog management
- Student registration and management
- Book issuing and return tracking
- Overdue book monitoring
- Detailed reports and analytics

### 👨‍💼 Admin Panel
- Global view of all institutions
- System-wide statistics
- User management across institutions
- Comprehensive analytics

### 🔐 Authentication & Security
- Multi-user type authentication (Institution, Student, Admin)
- Password reset via EmailJS
- Secure token management
- Role-based access control

### 📱 Mobile Responsive
- Fully responsive design
- Mobile-optimized navigation
- Touch-friendly interfaces
- Progressive Web App features

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: EmailJS
- **PDF Generation**: jsPDF
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account
- EmailJS account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bookzone.git
   cd shelfaryx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # EmailJS Configuration
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```

4. **Set up the database**
   - Run the SQL scripts in `DATABASE_SETUP.md`
   - Configure Supabase tables and policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

See `DATABASE_SETUP.md` for detailed database setup instructions.

## 📧 Email Configuration

1. **EmailJS Setup**
   - Create an account at [EmailJS.com](https://www.emailjs.com/)
   - Add your email service (Gmail, Outlook, etc.)
   - Create a password reset template
   - Update the service and template IDs in `src/services/passwordReset.ts`

2. **Template Variables**
   Your EmailJS template should use these variables:
   - `{{to_name}}` - Recipient name
   - `{{email}}` - Recipient email
   - `{{reset_link}}` - Password reset link
   - `{{user_type}}` - User type
   - `{{from_name}}` - Sender name
   - `{{message}}` - Email message

## 🚀 Deployment

### Netlify Deployment

1. **Connect to GitHub**
   - Push your code to GitHub
   - Connect your repository to Netlify

2. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

3. **Environment Variables**
   Add these in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EMAILJS_PUBLIC_KEY`

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-app-name.netlify.app`

## 📱 Usage

### For Institutions
1. Register your institution
2. Add books to your catalog
3. Register students
4. Issue and manage books
5. Monitor overdue books

### For Students
1. Register with your institution
2. Search and borrow books
3. View your dashboard
4. Download invoices
5. Receive notifications

### For Admins
1. Login with admin credentials
2. View all institutions
3. Monitor system statistics
4. Manage global data

## 🔧 Configuration

### Customization
- Update colors in `tailwind.config.js`
- Modify email templates in EmailJS
- Customize database schema as needed

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the setup guides

## 🎯 Roadmap

- [ ] Advanced reporting features
- [ ] Book recommendations
- [ ] Integration with external libraries
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for educational institutions worldwide** 
