import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URL video cloud
  const videoUrl = 'https://fie.nl.tab.digital/s/MRoWgcg7exqrGrA/download';

  try {
    // Server-to-server ( CORS)
    const response = await fetch(videoUrl);

    if (!response.ok) {
      return new NextResponse('Gagal mengambil video dari cloud', { status: response.status });
    }

    // Set CORS headers
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}