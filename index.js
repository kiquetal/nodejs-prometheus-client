const fastify = require('fastify');
const client = require('prom-client');

// Create a Fastify instance
const app = fastify();

// Create a Prometheus Registry
const registry = new client.Registry();

// Enable the collection of default metrics
client.collectDefaultMetrics({ register: registry });

// Create a Counter metric
const requestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status']
});

// Register the metric in the Prometheus Registry
registry.registerMetric(requestsCounter);


const codeCounter = new client.Counter({
  name: 'code_execution_count',
  help: 'Counts the number of times the specific code is executed',
  labelNames: ['code'],
});

// Register the metric in the Prometheus Registry
registry.registerMetric(codeCounter);

// Define a route handler
app.get('/code/:code', (request, reply) => {
  const code = request.params.code;

  // Increment the codeCounter metric
  codeCounter.labels(code).inc();

  // Send a response
  reply.send('Code execution counted!');
});

// Define a route handler
app.get('/', (request, reply) => {
  // Increment the requestsCounter metric
  requestsCounter.inc({ method: request.method, status: reply.statusCode });

  // Send a response
  reply.send('Hello, world!');
});

// Expose the metrics endpoint
app.get('/metrics', (request, reply) => {
  reply.header('Content-Type', registry.contentType);
  registry.metrics().then(data => reply.status(200).send(data))


});

// Start the server
app.listen({port:3000,host:'0.0.0.0'}, (err,addr) => {

  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server is listening on port 3000');
});

