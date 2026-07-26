# Yebone local development — see workspace LOCAL_DEVELOPMENT.md

Quick start from workspace root (`GURIRALINE PROJECT/`):

```bash
npm install
npm run local
npm run verify:local
```

Ports: frontend **3000**, backend **5000**, AI health **http://localhost:5000/api/v2/marketplace/ai/health**

Development never uses Render or GitHub Pages URLs. Production URLs live in `.env.production` only.
