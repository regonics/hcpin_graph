//returns html with uniprot id href link
function makeUniprotLink(id){
	var link = '<a href="http://www.uniprot.org/uniprot/' + id + '">';
	link = link + id + '</a>';
	return link;
}

$("#idList").hide();
for(var i = 0; i < HCPIN_GRAPH.raw.length; i++){
	var listitem = "<li>";

	for(var x = 0; x < HCPIN_GRAPH.raw[i].nodes.length; x++){
		listitem += makeUniprotLink(HCPIN_GRAPH.raw[i].nodes[x]);
		listitem += ", " 
	}
	
	listitem = listitem.substring(0, listitem.length - 2);
	listitem += "</li>";

	$("#idList").append(listitem);
}

$('#showListButton').on('click', function(){
	$('#cy').hide();
	$('#idList').show();
});

$("#showGraphButton").on('click', function(){
	$('#idList').hide();
	$('#cy').show();	
});
