const fetch = global.fetch || require('node-fetch');

async function run() {
  try {
    const r = await fetch('http://localhost:3000/api/health');
    const j = await r.json();
    console.log('health', j);

    const cfg = await (await fetch('http://localhost:3000/api/config')).json();
    console.log('config:', cfg);
    process.exit(0);
  } catch (err) {
    console.error('smoke test failed:', err.message);
    process.exit(2);
  }
}

run();
