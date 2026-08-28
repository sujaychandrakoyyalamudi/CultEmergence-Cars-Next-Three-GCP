export function GET() {
  return Response.json({ status: 'ok', service: 'cultemergence-cars', timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}
