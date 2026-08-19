import express from 'express';
import cors from 'cors';

import profileRoutes from './routes/profile.routes.js';
import matchRoutes from './routes/match.routes.js';
import requestRoutes from './routes/request.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', profileRoutes);
app.use('/api', matchRoutes);
app.use('/api', requestRoutes);

export default app;
