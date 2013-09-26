var mongoose = require('mongoose');
var express = require('express');
var app = express();

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

app.use(express.static(__dirname));

app.get('/', function(req, res){
	res.sendfile('./index.html');
});

app.get('/getData', function(req, res){
	//construct elements object to be used in cytoscape
	var nodes = [];
	var edges = [];

	console.log('getting data');

	NodeModel.find(function (err, query){
		for(var i = 0; i < query.length; i++){
			nodes.push({ data: { id: query[i].name, name: query[i].name } });
		
			for(var j = 0; j < query[i].connections.length; j++){
				edges.push({ data: { source: query[i].name, target: query[i].connections[j] } });	
			}	
		}

		res.json({ nodes : nodes, edges : edges });
	});
});

app.listen(8000);
