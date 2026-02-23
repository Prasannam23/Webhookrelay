import {PrismaClient} from '@prisma/client'

const Prisma = new PrismaClient()

async function main(){
    try {
        await Prisma.$connect()
        console.log('databse connection established')

    }catch(error){
        console.log(error)
        console.error('database connection failed')

    }finally {
        await Prisma.$disconnect()
    }
}

main()