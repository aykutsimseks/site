function hoverInitElements(opts) {
	var theme_color = opts['color'] || 'rgba(222,94,96,1)'
	var index = opts.index;
	
	d3.select('#country_info'+ index)
		.style('color', theme_color)
		.style('display', 'inline-block')
		.style('float','left')
	
	d3.select('#hover_text'+ index)
		//.style('text-align', opts.index%2?'left':'right')
		.style('text-align', 'center')
		.style('font-size', '20px')
		.style('background', 'rgba(200,200,200,.25)')
		.style('padding', '5px 0px')
		.style('margin-bottom', '20px')
		.style('color', theme_color)
		.style('text-anchor', 'middle')
}

function hoverUpdateElements(feature, opts) {
	var index = opts.index;
	var hover_text = d3.select('#hover_text' + opts.index)
	var mean_value = d3.select('#mean_value'+ opts.index)
	var last_value = d3.select('#last_value'+ opts.index)
	var last_year = d3.select('#last_year'+ opts.index)
	
	function valueTemplate(label, value, value_type) {
		return '<div class="col-md-3">' + label +'</div><span class="col-md-1">:</span><div class="col-md-7">' + formatDisplayValue(value,value_type) + '</div>'
	}
	if(feature) {
		var indicator_index 	= jsonArraySearch(selected_indicator[index-1],'Indicator Code',feature.properties.indicator_data);
		var row					= feature.properties.indicator_data[indicator_index]
		hover_text.text(feature.properties.name);
		if(row) {
			var value_type		 = 'float1';
			var indicator_name	 = row['Indicator Name'];
			if(indicator_name.contains('$') || indicator_name.contains('USD')) {
				value_type = 'dollar'
			}
			else if(indicator_name.contains('%')) {
				value_type = 'percent'
			}		
			last_value.html('Current (' + (1960 + parseInt(row.last_index)) + ") : " + formatDisplayValue(row.last,value_type))
			mean_value.html('Avg : ' + formatDisplayValue(row.mean,value_type))
			//last_year.html(valueTemplate('Measured',1960 + parseInt(row.last_index),'string') )
		}
		else {
			mean_value.html('&nbsp;')
			last_value.html('&nbsp;')
			//last_year.html('&nbsp;')
		}
	}
	else {
		hover_text.html('&nbsp;');
		mean_value.html('&nbsp;')
		last_value.html('&nbsp;')
		//last_year.html('&nbsp;')
	}
}

function drawMap(elem_id, opts) {
	var width 	= Math.min($(elem_id).width(),$(window).height()*2);
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
        		//.style('margin-left','10px')
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
	var highlight_opacity = .8;
	
	var world_map = g
		.selectAll("path")
		.data(countries)
		.enter().append("path")
		.style('cursor','pointer')
		.style(default_path_style)
		.attr("d", path);
	
	hoverInitElements(opts)
	
	world_map
		.on("mouseover", function(d) {
			d3.select(this).style('opacity', highlight_opacity);
			hoverUpdateElements(d,opts)
		})
		.on("mouseout", function(d) {
			d3.select(this).style('opacity', 1);
			hoverUpdateElements(null,opts)
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
						.style('opacity', highlight_opacity)
						.on("mouseover", function(d) {
							d3.select(this).style('opacity',1);
							hoverUpdateElements(d,opts)
						})
						.on("mouseout", function(d) {
							var opacity = (d == centered)?1:highlight_opacity;
							d3.select(this).style('opacity',opacity);
							hoverUpdateElements(centered,opts)
						})
					d3.select(elem_id + " .centered").style('opacity', '1')
				})
				.each("end", function() {
					
					d3.select(elem_id + " .centered").style('opacity',1)
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
						.style('opacity', '1')
						.on("mouseover", function(d) {
							d3.select(this).style('opacity', highlight_opacity)
							hoverUpdateElements(d,opts)
						})
						.on("mouseout", function(d) {
							d3.select(this).style('opacity', '1')
							hoverUpdateElements(null,opts)
						})
				})
				.each("end", function() {
					locked=false;		
				})
		}
	}        
}