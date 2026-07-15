import { Queue } from 'bullmq'
import { connection } from './connection.js'
import { QUEUE_NAMES, DELIVERY_JOB_OPTIONS } from '../constants/index.js'

export const deliveryQueue = new Queue(QUEUE_NAMES.DELIVERY, { connection })

export async function enqueueDelivery(jobData){
    return deliveryQueue.add('deliver', jobData, DELIVERY_JOB_OPTIONS)
}