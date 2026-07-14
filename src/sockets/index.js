import { Server } from "socket.io";
import { env } from "../config/env.js";
import logger from "../config/logger.js";


let io = null

 function initSockets(httpServer){
  io = new Server(httpServer,{
    cors: { origin: env.CORS_ORIGIN}
  })


io.on('connection',(socket) => {
    logger.debug({ socketId: socket.id},'Socket connected')

    socket.on('subscribe:subscriber',(subscriberId)=>{
        socket.join(`subscriber: ${subscriberId}`)
    })

    socket.on('disconnect', () => {
      logger.debug({ socketId: socket.id }, 'Socket disconnected');
    });

})
 return io;

}
function emitDeliveryUpdate(deliveryAttempt) {
  if (!io) return;
  io.to(`subscriber:${deliveryAttempt.subscriberId}`).emit('delivery:update', deliveryAttempt);
}

export { initSockets, emitDeliveryUpdate }