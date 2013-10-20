var mongoose = require('mongoose');
var path = require('path');
var q = require('q');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

//schema declaration
var NodeSchema = mongoose.Schema({
	name: String,
	connections: [String]
});

var EdgeSchema = mongoose.Schema({
	nodes : [String]
});

//Connecting to database
mongoose.connect('mongodb://localhost/hcpin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
});


var NodeModel = mongoose.model('Node', NodeSchema);
var EdgeModel = mongoose.model('Edge', EdgeSchema);

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, '/public')));
});

app.get('/input', function(req, res){
	res.sendfile('./input.html');
});

app.post('/testoutput', function(req, res){
	var ids = req.body.data.trim().split(/\W+/);
	
	var node_string = [];
	var nodes = [];
	var edges = [];

	console.log(ids);

/*	
	function queryData(callback){
		for(var i = 0; i < ids.length; i++){
			console.log("finding..." + ids[i]);	
			EdgeModel.find({nodes: ids[i]}, function(err, query){
				for(var j = 0; j < query.length; j++){
					edges.push(query[j]);
				}
			});
		}

		callback();
	}
*/

	EdgeModel.find({nodes: {$in: ids} }, function(err, query){
		console.log(query);
		for(var i = 0; i < query.length; i++){
			//add edges for every possible pair	
			for(var p1 = 0; p1 < query[i].nodes.length-1; p1++){
				for(var p2 = p1+1; p2 < query[i].nodes.length; p2++){
					edges.push({ data: { source: query[i].nodes[p1], target: query[i].nodes[p2] } });	
				}
			}

			//add new nodes
			for(var x = 0; x < query[i].nodes.length; x++){
				if(node_string.indexOf(query[i].nodes[x]) == -1)
					node_string.push(query[i].nodes[x]);	
			}
		}

		for(var i = 0; i < node_string.length; i++){
			nodes.push({ data: { id: node_string[i], name: node_string[i] } });
		}

		console.log(nodes);
		console.log(edges);
		res.render('testoutput.jade', {nodes: JSON.stringify(nodes), edges: JSON.stringify(edges)});
	});
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
