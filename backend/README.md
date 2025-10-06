# Backend Setup Instructions

## 1. Install dependencies

Open a terminal in the `backend` directory and run:

```
npm install
```

## 2. Configure Environment Variables

Edit the `.env` file and set:
- `MONGODB_URI` to your MongoDB Atlas connection string
- `JWT_SECRET` to a strong secret for JWT signing

## 3. Start the Server

For development with auto-reload:
```
npm run dev
```

Or to start normally:
```
npm start
```

## 4. API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user (username, password)
- `POST /api/auth/login` — Login and receive a JWT token

### Founder
- `POST /api/founder` — Add founder info (name, email, company)
- `GET /api/founder` — List all founders

## 5. Notes
- All credentials and founder info are stored in MongoDB Atlas.
- Protect sensitive endpoints with authentication as needed.
