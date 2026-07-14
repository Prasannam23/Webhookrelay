 import { PrismaClient } from '@prisma/client'
import { env } from '../config/env.js';
import logger from '../config/logger.js';


export const prisma = new PrismaClient({
    log:
    env.NODE_ENV === 'development'?[{emit:'event',level:'query'},'warn','error']
    :['warn','error'],
})

if(env.NODE_ENV === 'development'){
    prisma.$on('query',(e)=>{
        logger.debug({query:e.query,params:e.query,duration: `${e.duration}ms` },'prisma query')
    })
}