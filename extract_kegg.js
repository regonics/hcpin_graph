var request = require("request");

var uniprot_id = "P11473";

var uniprot_link = "http://www.uniprot.org/uniprot/" + uniprot_id;

request({
    uri: uniprot_link,
}, function(error, response, body){
	console.log(body);


	//find location of KEGG tag
	var i;
	for(i = 0; i < body.length; i++){
		if(body.substring(i, i+6) == ">KEGG<"){
			console.log("KEGG FOUND");
			break;
		}
	}

	//find location of KEGG link
	var x;
	for(x = i; x < body.length; x++){
		if(body.substring(x, x+4) == "http"){
			console.log("KEGG LINK FOUND");
			break;
		}	
	}

	//extract http link
	for(i = x; i < body.length; i++){
		if(body[i] == '"')
			break;
	}

	var kegg_link = body.substring(x,i);
	console.log(kegg_link);

	request({
		uri: kegg_link,
	}, function(error, response, body){
		var count = 0;
		var pathway_urls = [];
/*	
		for(var i = 0; i < body.length; i++){
			if(body.substring(i, i+22) == "/kegg-bin/show_pathway"){
				//extract link
				
				for(var x = i; x < body.length; x++){
					if(body[x] == '"')
						break;
				}

				pathway_urls.push(body.substring(i, x));
				
			}
		}
*/		
		console.log(pathway_urls);	
	});
});
