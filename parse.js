var mongoose = require('mongoose');
var fs = require('fs');

//schema declaration 

var NodeSchema = mongoose.Schema({
	name : String,
	connections : [String]
});

var NodeModel = mongoose.model('Node', NodeSchema);

//Connecting to database
mongoose.connect('mongodb://localhost/hcpin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log('connected');
});

//read data file and load database
fs.readFile('data.txt', 'utf8', function(err, data){
	if(err)
		return console.log(err);

	var lines = data.split('\n');

	var testNode;
	var pathway;
	var tokens;
	for(var i = 0; i < lines.length; i++){
		if(lines[i].length == 1){
			i++;   //skip over the '#' line		
			while(lines[i].charAt(0) != '#'){
				i++;
			}
			i--; //sets i to the line right before '#xxxxxx'
		}else if(lines[i].charAt(0) == '#'){
			pathway = lines[i].substring(1);
			pathway = pathway.trim();
			testNode = new NodeModel;
			testNode.name = pathway;
		}else{
			tokens = lines[i].trim().split('\t');
	
			if(tokens.length > 2 || tokens.length==1){
				//ignore >2 interactions
			}else if(tokens.length == 2){
				if(tokens[0].trim() == pathway){
					testNode.connections.push(tokens[1].trim());
				}else{
					testNode.connections.push(tokens[0].trim());
				}

			}

			testNode.save();
		}	
	}

});

//construct elements object to be used in cytoscape
var nodes = [];
var edges = [];

setTimeout(function(){
	NodeModel.find(function (err, query){
		for(var i = 0; i < query.length; i++){
			nodes.push({ data: { id: query[i].name, name: query[i].name } });
			
			for(var j = 0; j < query[i].connections.length; j++){
				edges.push({ data: { source: query[i].name, target: query[i].connections[j] } });	
			}	
		}

		console.log(edges);
		//console.log(edges);

		if (err)
			console.log(query);
	});
}, 1000);

