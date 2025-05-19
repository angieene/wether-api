import * as path from 'path';

import { config as dotenv } from 'dotenv-flow';

const root = path.join.bind(this, __dirname);

dotenv({ path: root('../../'), pattern: '.env' });

export function getConfiguration() {
  return {
    port: parseInt(process.env.PORT!, 10) || 3000,
    isProduction: process.env.NODE_ENV === 'production',
    weather: {
      apiKey: process.env.WEATHER_API_KEY,
    },
    email: {
      service: process.env.EMAIL_SERVICE || 'Gmail',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT!,
      password: process.env.REDIS_PASSWORD,
    },
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10) || 3306,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  };
}

export const config = getConfiguration();

export default getConfiguration;
