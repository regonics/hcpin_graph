var request = require('request');
var async = require('async');

var getKeggImgs = function(uniprot_id, return_urls, finished){
	var uniprot_link = "http://www.uniprot.org/uniprot/" + uniprot_id;
	console.log(uniprot_link);

	function getKeggImg(url, storage){
		request.get(url, function(error, response, body){
			var i;
			for(i = 0; i < body.length; i++){
				if(body.substring(i, i+10) == '<img src="'){
					break;
				}
			}

			var x;
			for(x = i+10; x < body.length; x++){
				if(body[x] == '"')
					break;
			}

			var img_url = "http://www.genome.jp" + body.substring(i+10, x);
			storage.push(img_url);	
		});
	}

	function runExtract(uniprot_link){
		request.get(uniprot_link, function(error, response, body){
			if(body.indexOf("The service is temporarily unavailable.") != -1){
				console.log("Error in request.");
				runExtract(uniprot_link);
			}else{
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

				request.get(kegg_link, function(error, response, body){
					var count = 0;
					var pathway_urls = [];
					var img_urls = [];
					
					for(var i = 0; i < body.length; i++){
						if(body.substring(i, i+22) == "/kegg-bin/show_pathway"){
							//extract link
							for(var x = i; x < body.length; x++){
								if(body[x] == '"')
									break;
							}

							if(pathway_urls.indexOf(body.substring(i, x)) == -1)
								pathway_urls.push(body.substring(i, x));
						}
					}
					
					for(var i = 0; i < pathway_urls.length; i++)
						pathway_urls[i] = "http://www.genome.jp" + pathway_urls[i];

					var kegg_functions = [];
					for(var i = 0; i < pathway_urls.length; i++)
						kegg_functions.push(getKeggImg(pathway_urls[i], img_urls));
			
					async.series(kegg_functions,
						function(err, results){
						    console.log('extraction complete');
						}
					);

					async.doUntil(
						function(callback){
							setTimeout(callback, 100);
						},

						function(){
							return (img_urls.length == pathway_urls.length);
						},
						
						function(err){
							for(var i = 0; i < img_urls.length; i++){
								return_urls.push(img_urls[i]);
							}

							console.log('set to true');					
							finished.status = true;	
						}
					);
				});
			}
		});
	}

	runExtract(uniprot_link);
};

module.exports.getKeggImgs = getKeggImgs;
