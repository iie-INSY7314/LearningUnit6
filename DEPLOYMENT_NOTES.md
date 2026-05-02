# LU6 Deployment Notes

## Backend deployment
Use Render or a lecturer-approved platform. Configure these environment variables on the platform, not in source control:

- NODE_ENV=production
- USE_HTTPS=false
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN=1h
- CLIENT_ORIGIN=https://your-frontend-url
- GRAFANA_OTLP_LOGS_URL
- GRAFANA_INSTANCE_ID
- GRAFANA_API_KEY
- APP_NAME=SecureAPI

Platform TLS normally provides HTTPS at the public URL, so the Node process can run HTTP internally.

## Frontend deployment
Build the client with:

```bash
cd client
npm install
npm run build
```

Set `VITE_API_URL` to the deployed backend URL before building.

## CORS
After the frontend is deployed, update the backend `CLIENT_ORIGIN` value to the hosted frontend URL.
