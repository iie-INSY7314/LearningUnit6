const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport');

class GrafanaOtlpTransport extends Transport {
  constructor(options = {}) {
    super(options);

    this.url = options.url;
    this.instanceId = options.instanceId;
    this.apiKey = options.apiKey;
    this.serviceName = options.serviceName || 'SecureAPI';
    this.environment = options.environment || 'development';

    const authPair = `${this.instanceId}:${this.apiKey}`;
    this.authorizationHeader = `Basic ${Buffer.from(authPair).toString('base64')}`;
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (!this.url || !this.instanceId || !this.apiKey) {
      callback();
      return;
    }

    const timestamp = Date.now() * 1e6;

    const body = {
      resourceLogs: [
        {
          resource: {
            attributes: [
              {
                key: 'service.name',
                value: { stringValue: this.serviceName }
              },
              {
                key: 'deployment.environment',
                value: { stringValue: this.environment }
              }
            ]
          },
          scopeLogs: [
            {
              scope: {
                name: 'winston'
              },
              logRecords: [
                {
                  timeUnixNano: String(timestamp),
                  severityText: String(info.level).toUpperCase(),
                  severityNumber: this.getSeverityNumber(info.level),
                  body: {
                    stringValue: info.message
                  },
                  attributes: this.mapAttributes(info)
                }
              ]
            }
          ]
        }
      ]
    };

    fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.authorizationHeader
      },
      body: JSON.stringify(body)
    })
      .then(async (response) => {
        if (!response.ok) {
          const responseBody = await response.text();
          console.error(`Grafana OTLP log failed with status ${response.status}: ${responseBody}`);
        }
      })
      .catch((error) => {
        console.error('Grafana OTLP log error:', error.message);
      })
      .finally(() => {
        callback();
      });
  }

  getSeverityNumber(level) {
    const severityMap = {
      error: 17,
      warn: 13,
      info: 9,
      http: 9,
      verbose: 5,
      debug: 5,
      silly: 1
    };

    return severityMap[level] || 9;
  }

  mapAttributes(info) {
    const ignoredKeys = new Set([
      'level',
      'message',
      'timestamp',
      'service',
      'environment'
    ]);

    return Object.entries(info)
      .filter(([key, value]) => !ignoredKeys.has(key) && value !== undefined && value !== null)
      .map(([key, value]) => ({
        key,
        value: {
          stringValue: typeof value === 'object'
            ? JSON.stringify(value)
            : String(value)
        }
      }));
  }
}

const loggerTransports = [
  new transports.Console()
];

if (
  process.env.GRAFANA_OTLP_LOGS_URL &&
  process.env.GRAFANA_INSTANCE_ID &&
  process.env.GRAFANA_API_KEY
) {
  loggerTransports.push(
    new GrafanaOtlpTransport({
      url: process.env.GRAFANA_OTLP_LOGS_URL,
      instanceId: process.env.GRAFANA_INSTANCE_ID,
      apiKey: process.env.GRAFANA_API_KEY,
      serviceName: process.env.APP_NAME || 'SecureAPI',
      environment: process.env.NODE_ENV || 'development'
    })
  );
}

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: {
    service: process.env.APP_NAME || 'SecureAPI',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: loggerTransports
});

module.exports = logger;