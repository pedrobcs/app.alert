import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL;

const buildEndpoint = () => {
  if (!API_BASE_URL) {
    return null;
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/panic`;
};

export async function POST(request: Request) {
  const endpoint = buildEndpoint();

  if (!endpoint) {
    return NextResponse.json(
      { success: false, error: 'API_BASE_URL environment variable is not configured.' },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || `Request failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message || 'Emergency alert sent successfully',
      },
      { status: response.status }
    );
  } catch (error) {
    console.error('Emergency alert proxy error:', error);

    return NextResponse.json(
      { success: false, error: 'Unable to forward emergency alert request.' },
      { status: 500 }
    );
  }
}
