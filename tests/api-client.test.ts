import { test } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import { apiRequest } from '../src/lib/api-client.js';

test('API Client HTTP Unit Tests', async () => {
  let capturedHeaders: any = null;

  const server = http.createServer((req, res) => {
    capturedHeaders = req.headers;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: { status: 'healthy' } }));
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;

  process.env.NEXT_PUBLIC_API_URL = `http://127.0.0.1:${port}`;

  const res = await apiRequest('/test-route');
  assert.strictEqual(res.success, true);
  assert.strictEqual((res.data as any)?.status, 'healthy');

  assert.strictEqual(capturedHeaders['content-type'], 'application/json');
  assert.strictEqual(capturedHeaders['accept'], 'application/json');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});
