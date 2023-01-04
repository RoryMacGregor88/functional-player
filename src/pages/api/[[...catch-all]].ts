import { NextApiRequest, NextApiResponse } from 'next';

export default function catchAll(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  res.status(404).json({ error: { message: 'Invalid API route' } });
}
