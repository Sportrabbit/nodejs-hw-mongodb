import path from 'path';

export const ENV_VARS = {
    PORT: 'PORT',
    JWT_SECRET: 'JWT_SECRET',
    APP_DOMAIN: 'APP_DOMAIN',
    IS_CLOUDINARY_ENABLED: 'IS_CLOUDINARY_ENABLED'
};

export const EMAIL_VARS = {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASSWORD: 'SMTP_PASSWORD',
    SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'upload');

export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
    API_KEY: 'CLOUDINARY_API_KEY',
    API_SECRET: 'CLOUDINARY_API_SECRET',
};
