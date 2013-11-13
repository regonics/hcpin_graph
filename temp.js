var request = require('request');
var async = require('async');
var kegg = require('./extract_kegg.js');

var return_urls = [];
var finished = { 'status': false };

kegg.getKeggImgs('P11473', return_urls, finished);

async.until(
	function(){
		return finished.status;
	},

	function(callback){
		setTimeout(callback, 200);
	},

	function(err){
		console.log(return_urls);
	}
);
