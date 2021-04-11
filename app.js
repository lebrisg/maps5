var http = require("http");
var morgan = require("morgan");
var app = require("express");
var ejs = require("ejs");
var mongodb = require("mongodb");
var promclient = require("prom-client");
var config = require("./config");

// Enable prom-client to expose default application metrics
const collectDefaultMetrics = promclient.collectDefaultMetrics;

// Define a custom prefix string for application metrics
collectDefaultMetrics({ prefix: 'maps5:' });

// Define render engine used
app.engine('html', ejs.renderFile);

// Define public directory
//app.use(express.static(__dirname + '/public'));

// Display requests at the console
app.use(morgan("combined"));

// Display initial configuration
config.display();

app.get("/", function(request, response) {
  response.render("index");
});

// Expose our metrics at the default URL for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promclient.register.contentType);
  res.send(await promclient.register.metrics());
});

// Start http server
app.listen(config.port, config.ip);
console.log('Server running on http://%s:%s', config.ip, config.port);
