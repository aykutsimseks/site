d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
  this.parentNode.appendChild(this);
  });
};

function drawMap(height, elem_id) {
    var width = height * 2;
    var centered1;
    var centered2;
    var locked1 = false;
    var locked2 = false;

    var projection = d3.geo.kavrayskiy7()
        //.mercator()
        .center([60, 3])
        .scale((height * 5 / 4) / Math.PI)
        .translate([(height * 5 / 4), (height * 23 / 40)])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);


    var svg1 = d3.select(elem_id).append("svg")
        .attr("width", width)
        .attr("height", height)
        //.style("background-color","#E0F8F7")
        .style("border-radius", "4px")
        
    var svg2 = d3.select("#map_canvas2").append("svg")
        .attr("width", width/2)
        .attr("height", height/2)
        .style("border-radius", "4px")

    var g1 = svg1.append("g") //.style("border-radius","160px");
	var g2 = svg2.append("g") 
    
	d3.json("../static/data/countries.topojson", function(error, world) {

        //var neighborhoods = json.objects.neighborhoods
        //	  ,neighbors = topojson.neighbors(neighborhoods.geometries);
        var countries = topojson.feature(world, world.objects.land).features,
            neighbors = topojson.neighbors(world.objects.land.geometries);
        var world_map = g1.attr("id", "countries")
            .selectAll("path")
            .data(countries)
            .enter().append("path")
            .style('cursor','pointer')
            .attr("d", path);

        world_map
            .on("mouseover", function(d) {
                if (!locked1 || (locked1 && centered1 == d)) {
                    hover_text1.text(d.properties.name).style('visibility', 'visible')
                }
            })
            .on("mouseout", function(d) {
            	if (!locked1) {
                	hover_text1.style('visibility', 'hidden')
                }
            })
            .on("click", function(d) {
                clicked(d);
            })

        var hover_text1 = svg1.append('text')
            .style('position', 'fixed')
            .attr("transform", "translate(" + (width/2) + " , " + (height-10) + ")")
            .style('font-size', 24)
            .style('visibility', 'hidden')
            .style('text-anchor', 'middle')
            .style('stroke', glyph_colors[0])
            .style('fill', glyph_colors[0])



        function clicked(d) {
            var x, y, k;
            //g.selectAll("path").classed("neighbor", false);
            if (d && centered1 != d) {
                var centroid = path.centroid(d);
                //var bounds = path.bounds(d);

                var bounds = path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],
                    //x = (bounds[0][0] + bounds[1][0]) / 2,
                    //y = (bounds[0][1] + bounds[1][1]) / 2,
                    x = centroid[0],
                	y = centroid[1],
                	k = .3 / Math.max(dx / height, dy / height / 2);
                	
                if (k < 1) k = 1.4;
                translate = [width / 2 - k * x, height / 2 - k * y]

                //k = 9;
                centered1 = d;
                hover_text1.text(d.properties.name).style('visibility', 'visible')
				g1
            		.selectAll("path")
                	.classed("inactive", function(d) {
                    	return d != centered1;
                	});
                svg1
                    .transition()
                    .duration(750)
                    .style("width", ((width * 1 / 2) - 5) + "px")
                    .style("height", height * 1 / 2 + "px");
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered1 = null;
                //d3.select("#map_country_text").html("")
                hover_text1.style('visibility', 'visible')
                d3.select("#circle_hover").select("svg").remove();
                /*
                world_map
                	.style('fill', 'rgba(255,255,255,.6)')
                */
                svg1
                    .transition()
                    .duration(750)
                    .style("width", width + "px")
                    .style("height", height + "px");
                g1
            		.selectAll("path")
                	.classed("inactive", function(d) {
                    	return d == centered1;
                	});
            }
            
            g1
            		.selectAll("path")
                	.classed("active", centered1 && function(d) {
                    	return d == centered1;
                	});
                
            if (d && centered1 != d) {
                hover_text1             	
            		.style('fill', glyph_colors[0])	
            		.style('stroke', glyph_colors[0])
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 2 + "," + (height - 10) + ")")

                g1
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 2 + "," + height * 1 / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
            	
            	$('#map_canvas2').hide() 	
            	$("#select_list1").hide()
            	$("#select_list2").hide()
						
            	locked1 = false;
            } else {
            					
				locked1 = true;
            	
            	hover_text1
            		.style('fill', '#FFFFFF')
            		.style('stroke', '#FFFFFF')
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 4 + "," + ((height * 1 / 2) - 10) + ")")

                g1
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 4 + "," + height * 1 / 4 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
				
				if(!$("#map_canvas2").is(":visible")) {						
					svg2.select("text")
                		.transition()
                    	.duration(750)
                    	.attr("transform", "translate(" + width * 1 / 4 + "," + ((height * 1 / 2) - 10) + ")")
                    	
                    svg2
                    	.transition()
                    	.duration(350)
                    	.each("end", function() { $("#map_canvas2").show() })
				
					if(!centered2) {
                		g2
                		.transition()
                    	.duration(750)
                    	.attr("transform", "translate(" + width * 1 / 4 + "," + height * 1 / 4 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
                		
                	
                	}
                	
                }
                $("#select_list1").show()
                if(centered2) {
        			 $("#select_list2").show()
        		}
        		
            	select_country1 = d.properties.name
            	values[0]["yearly_values"] = json[select_country1][select_indicator1]
                half_circle_spatial("#circle_hover", values, glyph_colors, $(window).height() * 1 / 2, $(window).width(),select_indicator1==select_indicator2);
            }
        }
    });
    
    d3.json("../static/data/countries.topojson", function(error, world) {

        //var neighborhoods = json.objects.neighborhoods
        //	  ,neighbors = topojson.neighbors(neighborhoods.geometries);
        var countries = topojson.feature(world, world.objects.land).features,
            neighbors = topojson.neighbors(world.objects.land.geometries);
        var world_map = g2.attr("id", "countries2")
            .selectAll("path")
            .data(countries)
            .enter().append("path")
            
            .style('cursor','pointer')
            .attr("d", path);

        world_map
        //.each(function(d, i) { d.neighbors = d3.selectAll(neighbors[i].map(function(j) { return world_map[0][j]; })); })
            .on("mouseover", function(d) { /*d3.select("#circle_hover").select("circle").attr("visibility","visible");*/
                if (!locked2 || (locked2 && centered2 == d)) {
                    hover_text2.text(d.properties.name).style('visibility', 'visible')
                }
            })
            .on("mouseout", function(d) {
            	if (!locked2) {
                	hover_text2.style('visibility', 'hidden')
                }
            })
            .on("click", function(d) {
                clicked(d);
            })

        var hover_text2 = svg2.append('text')
            .style('position', 'fixed')
            .attr("transform", "translate(" + (width/2) + " , " + (height-10) + ")")
            .style('font-size', 24)
            .style('visibility', 'hidden')
            .style('text-anchor', 'middle')
            .style('stroke', glyph_colors[1])
            .style('fill', glyph_colors[1])



        function clicked(d) {
            var x, y, k;
            //g.selectAll("path").classed("neighbor", false);
            if (d && centered2 != d) {
                var centroid = path.centroid(d);
                //var bounds = path.bounds(d);

                var bounds = path.bounds(d),
                    dx = bounds[1][0] - bounds[0][0],
                    dy = bounds[1][1] - bounds[0][1],
                    //x = (bounds[0][0] + bounds[1][0]) / 2,
                    //y = (bounds[0][1] + bounds[1][1]) / 2,
                    x = centroid[0],
                	y = centroid[1],
                	k = .3 / Math.max(dx / height, dy / height / 2);
                	
                if (k < 1) k = 1.4;
                translate = [width / 2 - k * x, height / 2 - k * y]

                //k = 9;
                centered2 = d;
                hover_text2.text(d.properties.name).style('visibility', 'visible')
				g2
            		.selectAll("path")
                	.classed("inactive", function(d) {
                    	return d != centered2;
                	});
                svg2
                    .transition()
                    .duration(750)
                    .style("width", ((width * 1 / 2) - 5) + "px")
                    .style("height", height * 1 / 2 + "px");
				select_country2 = d.properties.name
                values[1]["yearly_values"] = json[select_country2][select_indicator2]
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered2 = null;
                //d3.select("#map_country_text").html("")
                hover_text2.style('visibility', 'visible')
                d3.select("#circle_hover").select("svg").remove();
                /*
                world_map
                	.style('fill', 'rgba(255,255,255,.6)')
                */
                svg2
                    .transition()
                    .duration(750)
                    .style("width", width + "px")
                    .style("height", height + "px");
                g2
            		.selectAll("path")
                	.classed("inactive", function(d) {
                    	return d == centered2;
                	});
            }
            
            g2
            		.selectAll("path")
                	.classed("active", centered2 && function(d) {
                    	return d == centered2;
                	});

            if (d && centered2 != d) {
                hover_text2              	
            		.style('fill', glyph_colors[1])	
            		.style('stroke', glyph_colors[1])
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 2 + "," + (height - 10) + ")")

                g2
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 2 + "," + height * 1 / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
            	
            	$(elem_id).hide()
				$("#select_list1").hide()
				$("#select_list2").hide()
            	locked2 = false;
            } else {
            	locked2 = true;
            	
            	hover_text2
            		.style('fill', '#FFFFFF')
            		.style('stroke', '#FFFFFF')
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 4 + "," + ((height * 1 / 2) - 10) + ")")

                g2
                	.transition()
                    .duration(750)
                    .attr("transform", "translate(" + width * 1 / 4 + "," + height * 1 / 4 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
				
				if(!$(elem_id).is(":visible")) {					
					svg1.select("text")
                		.transition()
                    	.duration(750)
                    	.attr("transform", "translate(" + width * 1 / 4 + "," + ((height * 1 / 2) - 10) + ")")
                    
                    svg1
                    	.transition()
                    	.duration(350)
                    	.each("end", function() { $(elem_id).show() })
				
					if(!centered1) {
	                	g1
    	            		.transition()
        	            	.duration(750)
            	        	.attr("transform", "translate(" + width * 1 / 4 + "," + height * 1 / 4 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
					}		
					//$(elem_id).show()				
                }
                $("#select_list2").show()
                 $("#indicator2_name").show()
                if(centered1) {
        			 $("#select_list1").show()
        		}
        		select_country2 = d.properties.name
            	values[1]["yearly_values"] = json[select_country2][select_indicator2]
                half_circle_spatial("#circle_hover", values, glyph_colors, $(window).height() * 1 / 2, $(window).width(),select_indicator1==select_indicator2);
            }
        }
    });
}