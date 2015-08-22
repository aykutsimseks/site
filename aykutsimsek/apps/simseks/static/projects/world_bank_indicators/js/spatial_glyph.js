function half_circle_spatial (elem_id,values,colors,height,width,same){
	yearly_values = []
	/*
	values.forEach(function(d) {
		d["yearly_values"].forEach(function(y) {
    		yearly_values.push(y);
    	})
 	});
 	*/
 	var start_year = 1960;
 	var averages = [0,0];
 	var arc_lock = false;
 	
 	var l = Math.max.apply(Math, $.map(values, function (el) { return ((el['yearly_values'])?el['yearly_values'].length:0) }));
 	for(j=0; j < 2; j++)
 	{
 		var found = 0;
 		var total = 0;
 		
		
 		for(i=0; i < l; i++)
 		{
 			if(Number(values[j]["yearly_values"][i]) > 0)
 			{
 				found++;
 				values[j]["yearly_values"][i] = Number(values[j]["yearly_values"][i])
 				total += values[j]["yearly_values"][i]; 				
 			}
 			else
 			{
				 values[j]["yearly_values"][i] = 0;
 			}
 		}
 		/*
 		while(values[j]["yearly_values"].length < 54)
 		{
 			 values[j]["yearly_values"].push(0);
 		}
		 while(values[j]["yearly_values"].length > 54)
 		{
 		 	values[j]["yearly_values"].pop();
 		}
 		*/
 		if(found > 0)
 		{
 			averages[j] = total/found;
 		}
 	}	
 	var number_of_years = values[0]["yearly_values"].length/2;
 	var max0 = Number.MAX_VALUE;
 	max0 = Math.max.apply(Math, values[0]["yearly_values"])
 	var max1= Number.MAX_VALUE;
 	max1 = Math.max.apply(Math, values[1]["yearly_values"])
 	
 	if(same) {
 		max0,max1 = Math.max(max0,max1)
 	}
 	var margin = {top:55, bottom:25, left:35, right: 35};
	var radius  = Math.min(height - margin.top - margin.bottom, width - margin.left - margin.right)/2;

    var outerRadius = radius;
    var arcWidth = radius-1;
	var innerRadius = radius - arcWidth;
	console.log(values)
	if(d3.select(elem_id).select("svg"))
	{
		d3.select(elem_id).select("svg").remove();
	}
	//Make an SVG Container
 	var svg = d3.select(elem_id)
 				.append("svg")	
    			.attr("width", width)
    			.attr("height", (radius*2 + margin.top + margin.bottom) + "px")
    			.style("z-index",5)
  				.append("g")
  				.attr("transform", "translate(" + width/2 + "," + (radius + margin.top) + ")");
   				
	var arc0 = d3.svg.arc()
    			//.outerRadius(function(d,i){val = d.data["norm_value"];return (val > 0)?outerRadius*d.data["norm_value"]:innerRadius})
    			.outerRadius(function(d,i){return (outerRadius*d.data)/max0})
    			.innerRadius(innerRadius);
    			
    var arc1 = d3.svg.arc()
    			//.outerRadius(function(d,i){val = d.data["norm_value"];return (val > 0)?outerRadius*d.data["norm_value"]:innerRadius})
    			.outerRadius(function(d,i){return (outerRadius*d.data)/max1})
    			.innerRadius(innerRadius);

	var pie1 = d3.layout.pie()
    			.sort(null)
    			.value(function(d) { return 1; })
    			.startAngle(1.5*Math.PI)
    			.endAngle(2.5*Math.PI);
    
    var pie2 = d3.layout.pie()
    			.sort(null)
    			.value(function(d) { return 1; })
    			.startAngle(2.5*Math.PI)
    			.endAngle(3.5*Math.PI);
	var year_text = svg.append('text')
      				  //.attr("transform","translate(" + ( - (radius + margin.left)) + " , " + (- (radius + margin.top - 28)) + ")")
      				  .attr("transform","translate(" + 0 + " , " + (- (radius + margin.top - 28)) + ")")
      				  .style("fill","#ccc")
      				  .style('visibility','hidden')
      				  .attr('font-size',28)
      				  .attr('font-family','Amatic SC')
      				  .style('text-anchor', 'middle')
      				  .style("cursor","default")
    font = 18;
    var value_text1 = svg.append('text')
      				  //.attr("transform","translate(" + ( - (radius + margin.left)) + " , " + (- (radius + margin.top - font - 28)) + ")")
      				  .attr("transform","translate(" + 0 + " , " + (- (radius + margin.top - 28 - 2 - font )) + ")")
      				  //.style("fill","#666")
      				  .style("fill",colors[0])
      				  .style("font-size", font + "px")
      				  .style('visibility','hidden')
      				  .style('text-anchor', 'middle')
      				  .style("cursor","default")
      				  
     var value_text2 = svg.append('text')
      				   .attr("transform","translate(" + 0 + " , " + (+ (radius + margin.bottom - 8)) + ")")
      				  //.style("fill","#666")
      				  .style("fill",colors[1])
      				  .style("font-size", font + "px")
      				  .style('visibility','hidden')
      				  .style('text-anchor', 'middle')
      				  .style("cursor","default")
	
	var myLine = svg.append("line")
    				.attr("x1", -(radius + 28))
    				.attr("y1", 0)
    				.attr("x2", (radius + 28))
    				.attr("y2", 0)
    				.style("stroke", "rgba(200,200,200,.8)");
    				
    svg.append('text')
      	.attr("transform","translate(" + -(radius+28) + " , " + (-4) + ")")
      	.style('font-size',10)
      	.style("fill",colors[0])
      	.text("1960")
    
    	
	svg.append('text')
      	.attr("transform","translate(" + -(radius + 28) + " , " + 12 + ")")
      	.style('font-size',10)
      	.style("fill",colors[1])
      	.text("2013")
      	
    svg.append('text')
      	.attr("transform","translate(" + (radius + 6) + " , " + (-4) + ")")
      	.style('font-size',10)
      	.style("fill",colors[0])
      	.text("2013")

      	
    svg.append('text')
      	.attr("transform","translate(" + (radius+6) + " , " + 12 + ")")
      	.style('font-size',10)
      	.style("fill",colors[1])
      	.text("1960")
      	
  	var g1 = svg.selectAll(".arc0")
      			.data(pie1(values[0]["yearly_values"]))
    			.enter().append("g")
      			.attr("class", "arc0")
      			.style("opacity",".7")
      			.attr("id", function(d,i){return "sah0_"+i;});

  	g1.append("path")
      .style("fill", function(d,i) {return colors[0]})
      .on("mouseover", function(d,i) {
      		if(!arc_lock)
       		{
      			//svg.select("#sah1_" + i).style("opacity",.7);
				d3.select("body").selectAll("#sah1_" + i).style("opacity",1);
				d3.select("body").selectAll("#sah0_" + i).style("opacity",1);
				year_text
					.text(start_year+i)
					.style('visibility','visible')
				value_text1
					.text(formatValue(values[0]["yearly_values"][i],values[0]["format"]))
					.style('visibility','visible')
				
				value_text2
					.text(formatValue(values[1]["yearly_values"][i],values[1]["format"]))
					.style('visibility','visible')
				/*
				if(colors[1] == "#FFAD33"){
					val_text =  getIndicatorDefShort("Total")  + " : " + "$" + numberWithCommas(values[1]["yearly_values"][i].toFixed(0))
				}else if(colors[1] == "#A03737"){
					val_text =  getIndicatorDefShort("Health")  + " : " + values[1]["yearly_values"][i].toFixed(0)
				} 
				else if(colors[1] == "#6FBC1D"){
					val_text =  getIndicatorDefShort("Agriculture")  + " : " + values[1]["yearly_values"][i].toFixed(0) + "%"
				}
				else if(colors[1] == "#BC6F1D"){
					val_text =  getIndicatorDefShort("Education")  + " : " + values[1]["yearly_values"][i].toFixed(0) + "%"
				}
				else if(colors[1] == "#B6BC1D"){
					val_text =  getIndicatorDefShort("Law \& Justice")  + " : " + values[1]["yearly_values"][i].toFixed(0) + "%"
				}
				else if(colors[1] == "#1D95B9"){
					val_text = getIndicatorDefShort("Water")  + " : " +  values[1]["yearly_values"][i].toFixed(0) + "%"
				}
				value_text2
					.text(val_text)
					.style('visibility','visible')
				*/
			}
       })
       .on("mouseout",function(d,i) {
       		if(!arc_lock)
       		{
       			d3.select("body").selectAll("#sah1_" + i).style("opacity",.7);
       			d3.select("body").selectAll("#sah0_" + i).style("opacity",.7);
       			year_text.style('visibility','hidden')
       			value_text1.style('visibility','hidden')
       			value_text2.style('visibility','hidden')
       		}
       })
       .on("click",function(d,i) {
       		
       		svg.selectAll(".arc0").style("opacity",.7);
       		svg.selectAll(".arc1").style("opacity",.7);
       		year_text.style('visibility','hidden')
       		value_text1.style('visibility','hidden')
       		value_text2.style('visibility','hidden')
       		if(!arc_lock)
       		{
       			arc_lock = true;
       			d3.select("body").selectAll("#sah1_" + i).style("opacity",1);
				d3.select("body").selectAll("#sah0_" + i).style("opacity",1);
				year_text
					.text(start_year+i)
					.style('visibility','visible')
				value_text1
					.text(formatValue(values[0]["yearly_values"][i],values[0]["format"]))
					.style('visibility','visible')
				value_text2
					.text(formatValue(values[1]["yearly_values"][i],values[1]["format"]))
					.style('visibility','visible')
       		}
       		else
       		{
       			arc_lock = false;
       		}
       		
       })
       
      .transition().delay(function(d, i) { return i * 10; }).duration(10)
  	  .attrTween('d', function(d) {
       		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
       		return function(t) {
           		d.endAngle = i(t);
         		return arc0(d);
       		}
  		})					

       
    var g2 = svg.selectAll(".arc1")
      			.data(pie2(values[1]["yearly_values"]))
    			.enter().append("g")
      			.attr("class", "arc1")
      			.style("opacity",".7")
      			.attr("id", function(d,i){return "sah1_"+i;});

	g2.append("path")
      .style("fill", function(d,i) {return colors[1]})
      .on("mouseover", function(d,i) {
      		if(!arc_lock)
       		{
      			//svg.select("#sah1_" + i).style("opacity",.7);
				d3.select("body").selectAll("#sah1_" + i).style("opacity",1);
				d3.select("body").selectAll("#sah0_" + i).style("opacity",1);
				year_text
					.text(start_year+i)
					.style('visibility','visible')
				/*"Received aid: $" + */
				value_text1
					.text(formatValue(values[0]["yearly_values"][i],values[0]["format"]))
					.style('visibility','visible')
				
				value_text2
					.text(formatValue(values[1]["yearly_values"][i],values[1]["format"]))
					.style('visibility','visible')
			}
       })
       .on("mouseout",function(d,i) {
       		if(!arc_lock)
       		{
       			d3.select("body").selectAll("#sah1_" + i).style("opacity",.7);
       			d3.select("body").selectAll("#sah0_" + i).style("opacity",.7);
       			year_text.style('visibility','hidden')
       			value_text1.style('visibility','hidden')
       			value_text2.style('visibility','hidden')
       		}
       })
       .on("click",function(d,i) {
       		svg.selectAll(".arc0").style("opacity",.7);
       		svg.selectAll(".arc1").style("opacity",.7);
       		year_text.style('visibility','hidden')
       		value_text1.style('visibility','hidden')
       		value_text2.style('visibility','hidden')
       		if(!arc_lock)
       		{
       			arc_lock = true;
       			d3.select("body").selectAll("#sah1_" + i).style("opacity",1);
				d3.select("body").selectAll("#sah0_" + i).style("opacity",1);
				year_text
					.text(start_year+i)
					.style('visibility','visible')
				value_text1
					.text(formatValue(values[0]["yearly_values"][i],values[0]["format"]))
					.style('visibility','visible')
				value_text2
					.text(formatValue(values[1]["yearly_values"][i],values[1]["format"]))
					.style('visibility','visible')
       		}
       		else
       		{
       			arc_lock = false;
       		}
       		
       })
      .transition().delay(function(d, i) { return i * 10; }).duration(10)
  	  .attrTween('d', function(d) {
       		var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
       		return function(t) {
           		d.endAngle = i(t);
         		return arc1(d);
       		}
  		})					

	    
    arc_rad0 = (outerRadius*averages[0])/max0;
	var avg_arc0 = d3.svg.arc()
    		.innerRadius(arc_rad0-0.4)
    		.outerRadius(arc_rad0+0.4)
    		.startAngle(1.5*Math.PI)
    		.endAngle(2.5*Math.PI)
    
	svg.append("path")
    	.attr("d", avg_arc0)
    	.style("fill",colors[0])
    	
    arc_rad1 = (outerRadius*averages[1])/max1;
	var avg_arc1 = d3.svg.arc()
    		.innerRadius(arc_rad1-0.4)
    		.outerRadius(arc_rad1+0.4)
    		.startAngle(2.5*Math.PI)
    		.endAngle(3.5*Math.PI)
    
	svg.append("path")
    	.attr("d", avg_arc1)
    	.style("fill",colors[1])
};



function formatValue(value,format) {
	if(format == 'dollar') {
		return "$" + numberWithCommas(value.toFixed(0))
	}
	else if(format == 'percent') {
		return value.toFixed(1) + "%"
	}
	else if(format == 'number') {
		return numberWithCommas(value.toFixed(0))
	}
	else if(format) {
		return value + " " + format
	}
	return value
}