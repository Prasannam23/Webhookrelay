import { PrismaClient } from '@prisma/client'
import { env } from '../config/env' 
import logger from '../config/logger'

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