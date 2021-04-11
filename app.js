var http = require("http");
var morgan = require("morgan");
var express = require("express");
var ejs = require("ejs");
var mongodb = require("mongodb");
var promclient = require("prom-client");
var config = require("./config");

// Assign app variable
app = express();

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

// Test MongoDB config
if(!config.mongoURL) {
  console.log("Bad config parameter!");
  return;
}

app.get("/", function(request, response) {
  response.render("index.html");
});

// Expose our metrics at the default URL for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promclient.register.contentType);
  res.send(await promclient.register.metrics());
});

// Start http server
app.listen(config.port, config.ip);
console.log('Server running on http://%s:%s', config.ip, config.port);
