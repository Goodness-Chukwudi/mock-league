import 'dotenv/config'

interface IEnv {
    ENVIRONMENT: string;
    PORT: number;
    ALLOWED_ORIGINS: string[];
    API_VERSION: string;
    API_PATH: string;
    APP_URL: string;
    MONGODB_URI: string;
    JWT_PRIVATE_KEY: string;
    JWT_EXPIRY: string;
    REDIS_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
}


const Env: IEnv = {
    ENVIRONMENT: process.env.ENVIRONMENT as string,
    PORT: Number(process.env.PORT),
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(", ") as string[],
    API_VERSION: process.env.API_VERSION as string,
    API_PATH: "/api/" + process.env.API_VERSION,
    APP_URL: process.env.APP_URL as string,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY as string,
    JWT_EXPIRY: process.env.JWT_EXPIRY as string,
    MONGODB_URI: process.env.MONGODB_URI as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: Number(process.env.REDIS_PORT)
}

export default Env;