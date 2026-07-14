import { verifyAccessToken } from '../../services/auth.service.js'
import { UnauthorizedError } from '../../errors/UnauthorisedError.js'

import { asyncHandler } from '../../utils/asyncHandler.js'

export const requireAuth = asyncHandler(async(req,res,next)=>{
    const header = req.headers.authorization

    if(!header || !header.startsWith('Bearer ')){
        throw new UnauthorizedError('Missing or malformed Authorization header')
    }

    const token = header.split(' ')[1]
    const decoded = verifyAccessToken(token)

    req.user = { id: decoded.sub,email:decoded.email}
    next();
})