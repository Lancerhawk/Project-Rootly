import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import ConnectPgSimple from 'connect-pg-simple';

// Import routes
import authRoutes from './routes/auth';
import oauthRoutes from './routes/oauth';
import githubRoutes from './routes/github';
import projectRoutes from './routes/projects';
import ingestRoutes from './routes/ingest';
import incidentsRoutes from './routes/incidents';
import testRoutes from './routes/test';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize Rootly SDK to track our own errors
import { init } from 'rootly-runtime';

if (process.env.ROOTLY_API_KEY) {
    init({
        apiKey: process.env.ROOTLY_API_KEY,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'preview',
        debug: process.env.NODE_ENV !== 'production'
    });
    console.log('✅Rootly SDK initialized');
} else {
    console.warn('ROOTLY_API_KEY not set - error tracking disabled');
}

const app = express();
const prisma = new PrismaClient();
const PgSession = ConnectPgSimple(session);

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.BACKEND_URL || 'http://localhost:3001'
    ],
    credentials: true,
}));


// Session configuration
app.use(session({
    store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session', // Will be created automatically
    }),
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must be 'none' for cross-site auth (Vercel -> EC2)
    },
}));

// Trust proxy is required for secure cookies to work behind a proxy (like Nginx/EC2 load balancers)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Debug Middleware: Log Request Protocol & Headers (AFTER session/passport)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Secure:', req.secure);
    console.log('Protocol:', req.protocol);
    console.log('X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
    console.log('Session ID:', req.sessionID);
    console.log('User:', req.user ? 'Authenticated' : 'Not Authenticated');
    next();
});

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
},
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            // Upsert user in database
            const user = await prisma.user.upsert({
                where: { githubUserId: parseInt(profile.id) },
                update: {
                    githubUsername: profile.username,
                    githubEmail: profile.emails?.[0]?.value || null,
                    avatarUrl: profile.photos?.[0]?.value || null,
                },
                create: {
                    githubUserId: parseInt(profile.id),
                    githubUsername: profile.username,
                    githubEmail: profile.emails?.[0]?.value || null,
                    avatarUrl: profile.photos?.[0]?.value || null,
                },
            });

            // Attach access token to user object (for GitHub API calls)
            const userWithToken = {
                ...user,
                githubAccessToken: accessToken,
            };

            done(null, userWithToken);
        } catch (error) {
            done(error, null);
        }
    }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
    done(null, { id: user.id, githubAccessToken: user.githubAccessToken });
});

// Deserialize user from session
passport.deserializeUser(async (sessionData: any, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: sessionData.id },
        });

        if (!user) {
            return done(null, false);
        }

        // Reattach GitHub access token
        const userWithToken = {
            ...user,
            githubAccessToken: sessionData.githubAccessToken,
        };

        done(null, userWithToken);
    } catch (error) {
        done(error, null);
    }
});

// Routes
app.use('/auth', oauthRoutes); // /auth/github
app.use('/api', authRoutes);   // /api/me, /api/logout
app.use('/api/github', githubRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/incidents', incidentsRoutes); // JWT authenticated
app.use('/api/ingest', ingestRoutes); // API key authenticated
app.use('/api/test', testRoutes); // SDK testing endpoints

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await prisma.$disconnect();
    process.exit(0);
});
