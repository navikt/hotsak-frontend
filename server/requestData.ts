import { Request } from 'express';

const ipAddressFromRequest = (req: Request) =>
    req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown remote ip';

export { ipAddressFromRequest };
