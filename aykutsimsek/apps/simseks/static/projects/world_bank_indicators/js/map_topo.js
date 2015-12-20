function drawMap(elem_id, opts) {
	var width 	= Math.min($(elem_id).width(),$(window).height()*2)-20;
	var height 	= width/2;
	
	var centered;
    var locked = false;
    
    var fill_color = opts['color'] || 'rgba(222,94,96,1)';
    
    var projection = d3.geo.kavrayskiy7()
        //.mercator()
        .center([60, 3])
        .scale((height * 5 / 4) / Math.PI)
        .translate([(height * 5 / 4), (height * 23 / 40)])
        .precision(.1);
    
    var path = d3.geo.path()
        .projection(projection);
        
    var svg = d3.select(elem_id).append("svg")
        		.attr("width", width)
        		.attr("height", height)
        		.style('margin-left','10px')
        		//.style('display','block')
        		//.style('margin','auto')
        		//.style("border-radius", "4px")
    
    var g = svg.append("g") 
    
	var neighbors = topojson.neighbors(world_polygons.objects.land.geometries);
	
	var default_path_style = {
			'cursor' 			: 'pointer',
			'fill'	 			: '#ccc',
			'stroke' 			: '#444',
			'stroke-width'		: '.4px',
			'stroke-linejoin'	: 'round'
	}
	
	var alternative_path_style = {
			'cursor' 			: 'pointer',
			'fill'	 			: '#444',
			'stroke' 			: '#2F3238',
			'stroke-width'		: '.4px',
			'stroke-linejoin'	: 'round'
	}
	
	var world_map = g
		.selectAll("path")
		.data(countries)
		.enter().append("path")
		.style('cursor','pointer')
		.style(default_path_style)
		.attr("d", path);
		
	var hover_text = svg.append('text')
		.style('position', 'fixed')
		.attr("transform", "translate(" + (width/2) + " , " + (height-10) + ")")
		.style('font-size', '20px')
		//.style('visibility', 'hidden')
		.style('stroke-width', 0)
		.style('fill', fill_color)
		.style('text-anchor', 'middle')
	
	world_map
		.on("mouseover", function(d) {
			//d3.select(this).style('fill', fill_color);
			hover_text
				.style('visibility', 'visible')
				.text(d.properties.name)
		})
		.on("mouseout", function(d) {
			//d3.select(this).style('fill', default_path_style.fill);
			hover_text.style('visibility', 'hidden')
		})
		.on("click", function(d) {
			d3.select(elem_id + " .centered").classed('centered', false)
			d3.select(this).classed('centered',true)
			clicked(d);
		})
		
	function clicked(d) {
		var x, y, k;
		if (d && centered != d) {
			var centroid = path.centroid(d);
			var bounds = path.bounds(d),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				//x = (bounds[0][0] + bounds[1][0]) / 2,
				//y = (bounds[0][1] + bounds[1][1]) / 2,
				x = centroid[0],
				y = centroid[1],
				k = .55 / Math.max(dx / height, dy / height / 2);
				
			if (k < 1) k = 1.4;
			translate = [width / 2 - k * x, height / 2 - k * y]
			
			centered = d;
			g
				.transition()
				.duration(750)
				.attr("transform", "translate(" + width * 1 / 2 + "," + height * 1 / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
				.each("start", function() {
					g.selectAll("path")
						//.style(alternative_path_style)
						.on("mouseout", function(d) {
							var color = (d == centered)?fill_color:alternative_path_style.fill;
							//d3.select(this).style('fill',color);
							hover_text.text(centered.properties.name)
						})
					//d3.select(elem_id + " .centered").style('fill',fill_color)
				})
				.each("end", function() {
					hover_text
						.style('fill', '#fff')	
						.text(d.properties.name)
						.style('visibility', 'visible')
					
					//d3.select(elem_id + " .centered").style('fill',fill_color)
					locked = true;
				})
		} 
		else {
			k = 1;
			centered = null;
			
			d3.select(elem_id + " .centered").classed('centered', false)
			g
				.transition()
				.duration(750)
				.attr("transform", "scale(" + k + ")")
				.each("start", function() {
					g.selectAll("path")
						//.style(default_path_style)
						.on("mouseout", function(d) {
							//d3.select(this).style('fill',default_path_style.fill);
							hover_text.style('visibility', 'hidden')
						})
				})
				.each("end", function() {
					hover_text      
						.style('fill', fill_color)	
						.style('stroke', fill_color)  
					
					locked=false;		
				})
		}
	}        
}