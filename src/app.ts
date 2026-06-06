import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.get("/", (req, res) => {
  res.send("welcome to livilon! ✌");
});

app.set("trust proxy", 1); // for rate limiting in northflank
// ─── API Routes ──────────────────────────────────────────
app.use('/api', routes);

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

export default app;
