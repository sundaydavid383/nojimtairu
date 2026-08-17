# Nojim Tairu & Co. — Property & Payment Records Management

A role-based web application for managing property conveyancing records, payment tracking, and audit trails for Nojim Tairu & Co. law firm.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite, Motion (Framer Motion)
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth
- **Hosting**: Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Quick Start

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Set Up Environment Variables

Create `.env` in the root:
```
VITE_API_BASE_URL="/api"
VITE_APP_NAME="Nojim Tairu & Co. — Property & Payment Records"
VITE_ENABLE_PAYPAL_DEMO="true"
VITE_ENABLE_FORECASTING="false"
VITE_DEFAULT_THEME="light"
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ntc_property_records
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Start MongoDB

Ensure MongoDB is running locally, or use MongoDB Atlas cloud connection string.

### 4. Seed Initial Data

```bash
cd backend
npm run seed
```

This creates the default users (password: `password123`):
- `nojim.tairu@ntlaw.ng` — Admin
- `folashade.a@ntlaw.ng` — Staff
- `m.balogun@ntlaw.ng` — Staff
- `audu.ibrahim@veritas-audit.ng` — Viewer

### 5. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Project Structure

```
├── src/
│   ├── components/       # React UI components
│   ├── context/          # React Context (Auth, Property state)
│   ├── services/         # API service layer (calls backend)
│   ├── types/            # TypeScript interfaces
│   ├── data/             # Mock data (fallback)
│   ├── config.ts         # Frontend config
│   └── App.tsx           # Main app layout
├── backend/
│   ├── src/
│   │   ├── models/       # Mongoose schemas (User, Property, Payment, Activity)
│   │   ├── routes/       # Express routes (auth, properties, payments, staff, activities, dashboard)
│   │   ├── middleware/   # Auth, CORS, error handling
│   │   ├── scripts/      # Database seed script
│   │   ├── config.ts     # Backend env config
│   │   └── server.ts     # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/properties` | List properties (with search/filter/sort) |
| GET | `/api/properties/:id` | Get single property |
| POST | `/api/properties` | Create property (staff/admin) |
| PUT | `/api/properties/:id` | Update property (staff/admin) |
| DELETE | `/api/properties/:id` | Delete property (admin only) |
| POST | `/api/payments/:propertyId` | Record payment (staff/admin) |
| GET | `/api/staff` | List all users |
| POST | `/api/staff` | Add staff (admin only) |
| PUT | `/api/staff/:id` | Update staff (admin only) |
| DELETE | `/api/staff/:id` | Delete staff (admin only) |
| GET | `/api/activities` | List activity logs |
| POST | `/api/activities` | Log activity |
| GET | `/api/dashboard` | Get dashboard statistics |

## Deployment

- **Frontend**: Deploy to Vercel (free tier sufficient)
- **Backend**: Deploy to Render (free tier or $7/month for always-on)
- **Database**: MongoDB Atlas (free 512MB tier)
- **Images**: ImageKit or Cloudinary for property photos

## License

Proprietary — Nojim Tairu & Co. (Barristers & Solicitors)
