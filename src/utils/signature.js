import crypto from 'crypto';

// Signs `${timestamp}.${payload}` with the subscriber's secret.
export function signPayload({ payload, secret, timestamp }) {
  const signedContent = `${timestamp}.${JSON.stringify(payload)}`;
  return crypto.createHmac('sha256', secret).update(signedContent).digest('hex');
}

// Timing-safe comparison — prevents leaking signature-match info via
// response-time differences (a timing attack).
export function verifySignature({ payload, secret, timestamp, signature }) {
  const expected = signPayload({ payload, secret, timestamp });

  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(signature, 'hex');

  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}