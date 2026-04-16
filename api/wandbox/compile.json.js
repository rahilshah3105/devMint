const WANDBOX_URL = 'https://wandbox.org/api/compile.json';

function setCorsHeaders(res) {
  // Same-origin in production, but these headers keep the route usable for manual/API testing.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'Wandbox proxy is live. Send POST to execute code.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const upstreamResponse = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await upstreamResponse.text();
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    return res.status(upstreamResponse.status).json(parsed);
  } catch (error) {
    return res.status(502).json({
      error: 'Failed to reach Wandbox compile API',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
