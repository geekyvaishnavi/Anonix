# Anonix



Anonix is a modern anonymous messaging platform that allows users to send and receive messages without revealing their identity. Built with cutting-edge technologies for a seamless and secure experience.

---

## Features

- **Anonymous Messaging** - Send messages to users without revealing your identity
- **User Profiles** - Customizable profiles with username, display name, bio, and profile picture
- **Private Dashboard** - Manage your inbox and view all received messages
- **Reply System** - Answer anonymous messages and share them publicly
- **Public Feeds** - View answered messages on user profile pages
- **Secure Authentication** - JWT-based authentication with Supabase
- **Responsive Design** - Beautiful UI built with TailwindCSS
- **Fast Performance** - Powered by Bun runtime and Vite

---

## Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Framework**: [Elysia.js](https://elysiajs.com/) - Ergonomic web framework
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database
- **Authentication**: Supabase Auth with JWT
- **CORS**: @elysiajs/cors

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Project Structure

```
Anonix/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── supabase.js          # Supabase client configuration
│   │   ├── middleware/
│   │   │   └── auth.js              # Authentication middleware
│   │   ├── plugins/
│   │   │   └── auth.js              # Auth plugin
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication routes
│   │   │   ├── messages.js          # Message sending routes
│   │   │   ├── dashboard.js         # Dashboard & inbox routes
│   │   │   ├── profile.js           # Public profile routes
│   │   │   ├── replies.js           # Reply routes
│   │   │   └── edit.js              # Profile edit routes
│   │   └── index.js                 # Main server file
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx             # Landing page hero section
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   └── ScrollToTop.jsx      # Scroll to top utility
│   │   ├── context/
│   │   │   └── authContext.jsx      # Authentication context
│   │   ├── lib/
│   │   │   └── supabase.js          # Supabase client
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # User dashboard/inbox
│   │   │   ├── Profile.jsx          # Edit profile page
│   │   │   ├── PublicProfile.jsx    # Public user profile
│   │   │   ├── AnswerMessage.jsx    # Answer message page
│   │   │   ├── About.jsx            # About page
│   │   │   ├── Contact.jsx          # Contact page
│   │   │   ├── PrivacyPolicy.jsx    # Privacy policy
│   │   │   └── TermsConditions.jsx  # Terms & conditions
│   │   ├── utils/
│   │   │   └── api.js               # API utility functions
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase Account](https://supabase.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anonix.git
   cd anonix
   ```

2. **Backend Setup**

   ```bash
   cd backend
   
   # Install dependencies
   bun install
   
   # Create .env file
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   PORT=8080
   ```

   ```bash
   # Run development server
   bun run dev
   
   # Or run production server
   bun start
   ```

   Backend will run on `http://localhost:8080`

3. **Frontend Setup**

   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   ```bash
   # Run development server
   npm run dev
   
   # Build for production
   npm run build
   
   # Preview production build
   npm run preview
   ```

   Frontend will run on `http://localhost:5173`

---

## Database Setup

### Supabase Tables

You'll need to create the following tables in your Supabase project:

**1. profiles**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  pfp_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2. messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  status TEXT DEFAULT 'unanswered',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**3. replies**
```sql
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |

### Messages (`/messages`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/messages/send` | Send anonymous message | No |

### Dashboard (`/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/dashboard/me` | Get current user profile | Yes |
| GET | `/dashboard/inbox` | Get user's inbox | Yes |
| GET | `/dashboard/message/:id` | Get single message | Yes |
| PATCH | `/dashboard/message/:id/status` | Update message status | Yes |
| DELETE | `/dashboard/message/:id` | Delete message | Yes |

### Profile (`/u`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/u/:username` | Get public profile & feed | No |

### Replies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/replies` | Reply to message | Yes |

### Edit

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PATCH | `/edit/profile` | Update user profile | Yes |

---

## Usage

### For Users Receiving Messages

1. **Register/Login** - Create an account or login
2. **Share Your Profile** - Share your profile link (`/u/username`) with others
3. **Receive Messages** - Others can send you anonymous messages
4. **View Dashboard** - Check your inbox at `/user/dashboard`
5. **Reply to Messages** - Answer messages and they'll appear on your public profile
6. **Manage Messages** - Delete or update message status

### For Users Sending Messages

1. **Visit Profile** - Go to any user's public profile (`/u/username`)
2. **Send Message** - Write and send an anonymous message (no account needed)
3. **View Responses** - Check back to see if they've answered publicly

---

## Deployment

### Backend Deployment

The backend can be deployed to any platform that supports Bun:

- **Railway**: Connect your GitHub repo and deploy
- **Fly.io**: Use `fly launch` and configure for Bun
- **DigitalOcean**: Deploy on App Platform or Droplet

Make sure to set all environment variables in your deployment platform.

### Frontend Deployment (Vercel)

The frontend is configured for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

**Important**: Update the CORS settings in `backend/src/index.js` to include your production frontend URL.

---

## Security Features

- JWT-based authentication
- Secure password hashing via Supabase Auth
- CORS protection
- Input validation and sanitization
- Message length limits (500 characters)
- Protected routes with authentication middleware

---

## UI/UX Features

- Modern, minimalist design
- Dark theme with amber accents
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation
- Clean typography

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contributing

Contributions, issues, and feature requests are welcome!

---

## Contact

For questions or support, please visit the [Contact page](/contact-us) or open an issue on GitHub.

---

**Built with love using Bun, Elysia, React, and Supabase**
