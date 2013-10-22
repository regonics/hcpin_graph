var mongoose = require('mongoose');
var fs = require('fs');

//schema declaration 

var EdgeSchema = mongoose.Schema({
	nodes : [String]
});

var EdgeModel = mongoose.model('Edge', EdgeSchema);

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

	var testEdge;
	var pathway;
	var tokens;
	for(var i = 0; i < lines.length; i++){
		tokens = lines[i].trim().split('\t');
		
		for(var x = 0; x < tokens.length; x++){
			if(tokens[x] == ""){
				tokens.splice(x,1);
			}
		}
	
		if(tokens.length > 1){
			testEdge = new EdgeModel;
	
			for(var j = 0; j < tokens.length; j++){
				testEdge.nodes.push(tokens[j].trim());
			}


			testEdge.save();
		}
	}

});
