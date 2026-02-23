import dotenv from 'dotenv'

dotenv.config()

export const env = {
    DATABASE_URL:process.env.DATABASE_URl,
    REDIS_DATABASE_URL:process.env.REDIS_DATABASE_URL,
    NODE_ENV:process.env.NODE_ENV
}