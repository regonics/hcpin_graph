var mongoose = require('mongoose');
var path = require('path');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

//schema declaration
var NodeSchema = mongoose.Schema({
	name: String,
	connections: [String]
});

//Connecting to database
mongoose.connect('mongodb://localhost/hcpin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
});


var NodeModel = mongoose.model('Node', NodeSchema);

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/input', function(req, res){
	res.sendfile('./input.html');
});

app.post('/testoutput', function(req, res){
	var words = req.body.data.trim().split(/\W+/);
	console.log(words);
	res.end();
});

app.get('/output', function(req, res){
	res.sendfile('./output.html');
});

app.get('/getData', function(req, res){
	//construct elements object to be used in cytoscape
	var nodes = [];
	var edges = [];
	var collection = [];

	console.log('getting data');

	NodeModel.find(function (err, query){
		for(var i = 0; i < query.length; i++){
			nodes.push({ data: { id: query[i].name, name: query[i].name } });
			//nodes.push({ group: 'nodes', data: { id: query[i].name, name: query[i].name }, position: { x: 200, y: 200 } });
		
			for(var j = 0; j < query[i].connections.length; j++){
				edges.push({ data: { source: query[i].name, target: query[i].connections[j] } });	
				//edges.push({ group: 'edges', data: { source: query[i].name, target: query[i].connections[j] } });	
			}	
		}

		for(var i = 0; i < edges.length; i++){
			var exists = false;
			for(var j = 0; j < nodes.length; j++){
				if(edges[i].data.target === nodes[j].data.id)
					exists = true;
			}

			if(!exists)
				nodes.push({ data: { id: edges[i].data.target, name: edges[i].data.target } });
		}
	
		console.log(nodes.length);	
		res.json({ nodes: nodes, edges: edges});
	});
});

server.listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});
