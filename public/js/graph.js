/*
setTimeout( function(){
	$.ajax({
		url: '/getData',
		complete: function(data){
			HCPIN_GRAPH.data = $.parseJSON(data.responseText);
			console.log(HCPIN_GRAPH.data.nodes);
		}
	});
}, 1000);
*/

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
   		nodes: HCPIN_GRAPH.nodes,
    		edges: HCPIN_GRAPH.edges
  	},
	layout: { 
		name: "arbor" 
	},
	ready: function(){
   		window.cy = this;
    		cy.elements().unselectify();
		options = { 	
			name: 'breadthfirst', 
			fit: true,
			ready: undefined,
			stop: undefined,
			directed: true,	
			padding: 30,
			circle: false,
			roots: undefined,
		};  
	
		cy.layout(options); 
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
});