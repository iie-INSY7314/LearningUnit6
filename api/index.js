require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gadgetRoutes = require('./routes/gadgetRoutes');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./logging/logger');

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'], connectSrc: ["'self'", CLIENT_ORIGIN],
      objectSrc: ["'none'"], baseUri: ["'self'"], frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'same-site' }
}));
app.use(cors({ origin: CLIENT_ORIGIN, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

app.get('/', (req, res) => res.status(200).json({ app: process.env.APP_NAME || 'SecureAPI', message: 'API is running securely' }));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', protocol: USE_HTTPS ? 'HTTPS' : 'HTTP' }));

app.use('/api/auth', authRoutes);
app.use('/api/gadgets', gadgetRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use(errorHandler);

if (USE_HTTPS) {
  const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'certs', 'localhost-key.pem');
  const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'certs', 'localhost-cert.pem');
  const httpsOptions = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  https.createServer(httpsOptions, app).listen(PORT, () => logger.info(`HTTPS server running on port ${PORT}`));
} else {
  app.listen(PORT, () => logger.info(`HTTP server running on port ${PORT}`));
}
