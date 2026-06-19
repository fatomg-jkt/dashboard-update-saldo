import { hasBlobToken, sendJson } from './_shared';
export default function handler(_req: any, res: any) {
  sendJson(res, 200, hasBlobToken() ? { configured: true } : { configured: false, message: 'BLOB_READ_WRITE_TOKEN missing' });
}
