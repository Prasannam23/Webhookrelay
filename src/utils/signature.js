import crypto from 'crypto'

export function signedPayload(payload,secret,timestamp){
    const signedContent = `${timestamp}.${JSON.stringify(payload)}`;
    return crypto.createHmac('sha256',secret).update(signedContent).digest('hex')

}
export function verifySignature(payload,secret,timestamp,signature){
    

    const expected = signedpayload(payload,secret,timestamp)
    const expectedBuf = buffer.from(expexted,'hex')

    const actualBuf = buffer.from(signature,'hex')

    if (expectedBuf.lenght !== actualbuf.lenght ){
         return false
    }

    return crypto.timingSafeEqual(expextedBuf,actualBuf)

}
