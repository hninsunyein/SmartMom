import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

async function handler(request, context) {
  const { params } = await context;
  const path = (await params).path.join('/');
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}/api/${path}${url.search}`;

  const forwardHeaders = new Headers();
  const contentType = request.headers.get('content-type');
  const authorization = request.headers.get('authorization');
  if (contentType) forwardHeaders.set('content-type', contentType);
  if (authorization) forwardHeaders.set('authorization', authorization);

  let body = null;
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = Buffer.from(await request.arrayBuffer());
  }

  const backendResponse = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body,
  });

  const data = await backendResponse.arrayBuffer();

  return new NextResponse(data, {
    status: backendResponse.status,
    headers: {
      'content-type': backendResponse.headers.get('content-type') || 'application/json',
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
