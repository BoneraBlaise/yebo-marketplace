const fs = require("fs");
const path = require("path");

const metrics = [];

function recordMetric(name, durationMs, meta = {}) {
  metrics.push({
    name,
    durationMs: Math.round(durationMs),
    ...meta,
    at: new Date().toISOString(),
  });
}

async function measure(name, fn, meta = {}) {
  const start = performance.now();
  const result = await fn();
  recordMetric(name, performance.now() - start, meta);
  return result;
}

function summarizeMetrics() {
  const byName = {};
  for (const entry of metrics) {
    if (!byName[entry.name]) byName[entry.name] = [];
    byName[entry.name].push(entry.durationMs);
  }

  const summary = {};
  for (const [name, values] of Object.entries(byName)) {
    const total = values.reduce((a, b) => a + b, 0);
    summary[name] = {
      count: values.length,
      avgMs: Math.round(total / values.length),
      minMs: Math.min(...values),
      maxMs: Math.max(...values),
    };
  }
  return summary;
}

function writePerformanceReport() {
  const reportDir = path.join(__dirname, "..", "playwright-report");
  fs.mkdirSync(reportDir, { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    metrics,
    summary: summarizeMetrics(),
  };
  fs.writeFileSync(path.join(reportDir, "performance.json"), JSON.stringify(payload, null, 2));
  return payload;
}

module.exports = {
  recordMetric,
  measure,
  summarizeMetrics,
  writePerformanceReport,
};
