//returns html with uniprot id href link
function makeUniprotLink(id){
	var link = '<a href="http://www.uniprot.org/uniprot/' + id + '">';
	link = link + id + '</a>';
	return link;
}

//group queries together
//x is id to be sorted
var group_count = 0;
for(var x = 0; x < HCPIN_GRAPH.queries.length; x++){
	//run through queries and pull HCPIN_GRAPH.queries to the top
	for(var i = group_count; i < HCPIN_GRAPH.raw.length; i++){
		//mismatch found
		if(HCPIN_GRAPH.raw[i].nodes[0] != HCPIN_GRAPH.queries[x]){
			var swap_index = -1;
			//find next match
			for(var y = group_count; y < HCPIN_GRAPH.raw.length; y++){
				if(HCPIN_GRAPH.raw[y].nodes[0] == HCPIN_GRAPH.queries[x]){
					swap_index = y;
				}	
			}
			
			if(swap_index == -1){
				break;
			}else{
				var temp = HCPIN_GRAPH.raw[i].nodes[0];
				HCPIN_GRAPH.raw[i].nodes[0] = HCPIN_GRAPH.raw[swap_index].nodes[0];
				HCPIN_GRAPH.raw[swap_index].nodes[0] = temp;
				group_count++;
			}
		}
		group_count++;
	}
}

$("#uniprotLink").hide();
$("#showKeggImagesButton").hide();
$("#idList").hide();
$("#kegg_container").hide();

for(var i = 0; i < HCPIN_GRAPH.raw.length; i++){
	var listitem = "<li>";

	for(var x = 0; x < HCPIN_GRAPH.raw[i].nodes.length; x++){
		listitem += makeUniprotLink(HCPIN_GRAPH.raw[i].nodes[x]);
		listitem += ", " 
	}
	
	listitem = listitem.substring(0, listitem.length - 2);
	listitem += "</li>";

	console.log(listitem);
	$("#idList").append(listitem);
	console.log('item appended');
}


$('#showListButton').on('click', function(){
	$('#cy').hide();
	$('#kegg_container').hide();
	$('#hcpin_container').hide();
	$('#idList').show();
});

$("#showGraphButton").on('click', function(){
	$('#idList').hide();
	$('#kegg_container').hide();
	$('#hcpin_container').show();
	$('#cy').show();	
});

$('#showKeggImagesButton').on('click', function(){
	$('#kegg_container').empty();

	$.get('/getKeggImage', { 'uniprot_id': HCPIN_GRAPH.uniprot_id }, 
		function(data){
			for(var i = 0; i < data.img_urls.length; i++){
				var img = document.createElement('img');
				img.src = data.img_urls[i];
				$('#kegg_container').append(img);
			}
		}
	);

	$('#cy').hide();
	$('#idList').hide();
	$('#hcpin_container').hide();
	$('#kegg_container').show();
});


$("#uniprotLink").on('click', function(){
	window.open(HCPIN_GRAPH.uniprotLink)
});
