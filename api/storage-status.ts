import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const configured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (configured) return res.status(200).json({ configured: true });
  return res.status(200).json({ configured: false, message: 'BLOB_READ_WRITE_TOKEN missing' });
}
