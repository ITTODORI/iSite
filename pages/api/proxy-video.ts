import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Query Dynamic Route
  let videoUrl = req.query.url as string;

  // Check if it's provided in the path parameter (e.g., /api/proxy-video/[...path])
  if (!videoUrl && req.query.path) {
    const pathArray = req.query.path as string[];
    videoUrl = pathArray.join('/');
  }

  if (!videoUrl) {
    return res.status(400).send('URL video tidak ditemukan');
  }

  try {
    const response = await fetch(videoUrl);

    if (!response.ok) {
      return res.status(response.status).send('Gagal mengambil video dari cloud');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    
    res.end();
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}