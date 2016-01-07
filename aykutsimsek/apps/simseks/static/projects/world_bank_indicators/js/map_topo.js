function initElements(opts) {
	var theme_color = opts['color'] || 'rgba(222,94,96,1)'
	var index = opts.index;
	
		
	data1 = [-2.2, -2.2, -2.3, -2.5, -2.7, -3.1, -3.2,
					-3.0, -3.2, -4.3, -4.4, -3.6, -3.1, -2.4,
					-2.5, -2.3, -1.2, -0.6, -0.2, -0.0, -0.0]
	data2 = [2.1, 2.0, 2.2, 2.4, 2.6, 3.0, 3.1, 2.9,
					3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
					1.8, 1.2, 0.6, 0.1, 0.0]
	drawChart(data1,data2)
	
	d3.select('#country_info'+ index)
		.style('color', theme_color)
		.style('display', 'inline-block')
		//.style('background', 'rgba(200,200,200,.25)')
		.style('float','left')
		.style('padding', '5px 0px')
		.style('text-align', 'center')
	
	d3.select('#hover_text'+ index)
		.style('text-align', 'center')//opts.index%2?'left':'right')
		//.style('min-height', '56px')
		.style('font-size', '20px')
		.style('color', theme_color)
	
}

function drawChart(d1,d2) {
	if(d1 && selected_indicator[0]) {
		var indicator_index 		= jsonArraySearch(selected_indicator[0],'Indicator Code',d1.properties.indicator_data);
		var data1					= d1.properties.indicator_data[indicator_index]
	}
	else {
		var data1 = []
	}
	
	if(d2 && selected_indicator[1]) {
		var indicator_index 		= jsonArraySearch(selected_indicator[1],'Indicator Code',d2.properties.indicator_data);
		var data2					= d2.properties.indicator_data[indicator_index]
	}
	else {
		var data2 = []
	}
	var height = $("#map_canvas1").height();
	d3.select('#container').style('height', ($(window).height() - height - 140) + "px")
	
	var categories = ['0-4', '5-9', '10-14', '15-19',
            '20-24', '25-29', '30-34', '35-39', '40-44',
            '45-49', '50-54', '55-59', '60-64', '65-69',
            '70-74', '75-79', '80-84', '85-89', '90-94',
            '95-99', '100 + '];
            
	$('#container').highcharts({
			chart: {
				type: 'bar',
				backgroundColor: 'none'
			},
			/*
			title: {
				text: 'Population pyramid for Germany, 2015'
			},
			*/
			subtitle: {
				text: 'Source: <a href="http://populationpyramid.net/germany/2015/">Population Pyramids of the World from 1950 to 2100</a>'
			},
			xAxis: [{
				categories: categories,
				reversed: false,
				labels: {
					step: 1
				}
			}, { // mirror axis on right side
				opposite: true,
				reversed: false,
				categories: categories,
				linkedTo: 0,
				labels: {
					step: 1
				}
			}],
			yAxis: {
				title: {
					text: null
				},
				labels: {
					formatter: function () {
						return Math.abs(this.value) + '%';
					}
				}
			},

			plotOptions: {
				series: {
					stacking: 'normal'
					//animation: false
				}
			},

			tooltip: {
				formatter: function () {
					return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
						'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
				}
			},

			series: [{
				name: 'Male',
				data: data1,
				color: vis_color_sets[0][5][2]
			}, {
				name: 'Female',
				data: data2,
				color: vis_color_sets[1][5][2]
			}]
		});

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
		hover_text.html("<div style='vertical-align:middle'>" + feature.properties.name + "</div>");
		if(row) {
			var value_type		 = 'float1';
			var indicator_name	 = row['Indicator Name'];
			if(indicator_name.contains('$') || indicator_name.contains('USD')) {
				value_type = 'dollar'
			}
			else if(indicator_name.contains('%')) {
				value_type = 'percent'
			}		
			last_value.html("<span style='font-size:12px'>Current (" + (1960 + parseInt(row.last_index)) + ")</span></br><span style='font-size:16px'>" + formatDisplayValue(row.last,value_type))
			mean_value.html("<span style='font-size:12px'>Avg</span></br><span style='font-size:16px'>" + formatDisplayValue(row.mean,value_type) + "</span>")
			//last_year.html(valueTemplate('Measured',1960 + parseInt(row.last_index),'string') )
		}
		else {
			mean_value.html('&nbsp;</br>&nbsp;')
			last_value.html('&nbsp;</br>&nbsp;')
			//last_year.html('&nbsp;')
		}
	}
	else {
		hover_text.html('&nbsp;');
		mean_value.html('&nbsp;</br>&nbsp;')
		last_value.html('&nbsp;</br>&nbsp;')
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
	
	initElements(opts)
	
	world_map
		.on("mouseover", function(d) {
			d3.select(this).style('opacity', highlight_opacity);
			hoverUpdateElements(d,opts)
			var data1 = opts.index==1?d:selected_polygons[0]
			var data2 = opts.index==2?d:selected_polygons[1]
			drawChart(data1,data2)
		})
		.on("mouseout", function(d) {
			d3.select(this).style('opacity', 1);
			hoverUpdateElements(null,opts)
			var data1 = selected_polygons[0]
			var data2 = selected_polygons[1]
			drawChart(data1,data2)
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
				k = .4 / Math.max(dx / height, dy / height / 2);
				
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
				
			selected_polygons[opts.index] = d;
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
			selected_polygons[opts.index] = null;
		}
	}        
}