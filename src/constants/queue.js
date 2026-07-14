export const QUEUE_NAMES = Object.freeze({
    DELIVERY : 'delivery-queue',
})

export const DELIVERY_JOB_OPTIONS = Object.freeze({
    attempts: 8,
    backoff:{
        type : 'exponential',
        delay: 5000,

    },
    removeComplete : {
        age : 60*60*24,
        count: 1000,
    },
 
})
 export const DELIVERY_TIMEOUT_MS = 10_000