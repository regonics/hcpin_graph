var HCPIN_GRAPH = {};

setTimeout( function(){
	$.ajax({
		url: '/getData',
		complete: function(data){
			HCPIN_GRAPH.data = $.parseJSON(data.responseText);
		}
	});
}, 1000);

setTimeout( function(){
	$('#cy').cytoscape({
  		style: cytoscape.stylesheet()
    		.selector('node')
      		.css({
       		 'content': 'data(name)',
       		 'text-valign': 'center',
          	 'color': 'white',
       		 'text-outline-width': 2,
    		 'text-outline-color': '#888'
      		})
 		.selector('edge')
      		.css({
        	 'target-arrow-shape': 'triangle'
      		})
    		.selector(':selected')
      		.css({
   		 'background-color': 'black',
       		 'line-color': 'black',
      		 'target-arrow-color': 'black',
    		 'source-arrow-color': 'black'
      		})
   		.selector('.faded')
      		.css({
        	 'opacity': 0.25,
        	 'text-opacity': 0
      		}),
	elements: {
   		nodes: HCPIN_GRAPH.data.nodes,
    		edges: HCPIN_GRAPH.data.edges
  	},
  
	ready: function(){
   		window.cy = this;
    		cy.elements().unselectify();
		cy.layout({ name: 'grid', fit: true});  
 
   	 	cy.on('tap', 'node', function(e){
      			var node = e.cyTarget; 
      			var neighborhood = node.neighborhood().add(node);
      			cy.elements().addClass('faded');
      			neighborhood.removeClass('faded');
    		});
    
   		 cy.on('tap', function(e){
      			if( e.cyTarget === cy ){
       				cy.elements().removeClass('faded');
      			}
    		});
  	}
}); }, 4000);
