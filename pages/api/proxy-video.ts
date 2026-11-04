import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // URL Cloud:
  const videoUrl = (req.query.url as string) || 'https://fie.nl.tab.digital/s/MRoWgcg7exqrGrA/download';

  try {
    // Server-to-server (CORS)
    const response = await fetch(videoUrl);

    if (!response.ok) {
      return res.status(response.status).send('Gagal mengambil video dari cloud');
    }

    // 2. Set header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');

    // 3. Stream
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