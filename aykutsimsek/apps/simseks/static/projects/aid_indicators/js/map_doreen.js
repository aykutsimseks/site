	var glyph_colors = ["#ff9900","#CC6633"];
	//var max_per_capita_aids = [14721,4497,10145,1615,3517,1153]
	var max_per_capita_aids = [1500,300,300,300,300,300]
	//var max_indicator_values = [46075,70.2,142.3,1330,310.3,100]
	var max_indicator_values = [6000,8,80,400,60,100];
	var box_height = 66;
	var box_width = 102;
	var selected = [];
	
	function clearSelected()
	{
		selected=[];
	}
	
	function toggleCheckBox()
	{
		if(selected.length>0)
		{
			d3.select("#check_div").style('visibility','visible')
		}
		else
		{
			d3.select("#check_div").style('visibility','hidden')
			d3.select("#check_box")[0][0].checked = false;
		}
	}
	
	function drawDoreen(sortorder , res) 
	{
		//"#8A0808", "#B45F04", "#5FB404", "#AEB404", "#0489B1"]
		removeoption("-all_total_aid_reason");
		removeoption("-all_total_aid");
		addoption("Aid for reason","-all_total_aid_reason");
		addoption("Total Aid","-all_total_aid")
		$("#dropselect").val( sortorder ).prop('selected',true);
		toggleCheckBox();

		
		switch(res)
		{
			case "Agriculture":
  				glyph_colors = ["#AED980","#6FBC1D"];			
  				break;
  			case "Education":
  				glyph_colors = ["#D4A36E","#BC6F1D"];
  				break;
  			case "Health":
  				glyph_colors = ["#BC7171","#A03737"];
  				break;
  			case "Law \& Justice":
  				glyph_colors = ["#D0D46E","#B6BC1D"];
  				break;
  			case "Water":
  				glyph_colors = ["#A4D4E3","#1D95B9"];
  				break;
			default:
				removeoption("-all_total_aid_reason");
  				glyph_colors = ["#FFCE85","#FFAD33"];
		}
		
		
		d3.select("#countrycontainer").remove();
		d3.select("#glyph_sample").remove();
		
		
		//$("#reasondiv").text(getIndicatorDef(res));

		var timer = setTimeout(function() {
			var window_width = $(window).width()
			
			var n = parseInt((window_width - 240)/box_width);
			var width = (window_width - 240)
			var height = (n * (box_height + 2) + 3);
			var centered;
			var elem_id = "#map_canvas"
	

			var max_pop = 50000000;
			var max_per_cap = 1000;
			
			//Create country container
			var svg = d3.select(elem_id).append("ul")
							.attr("id" , "countrycontainer")
			    			.style("width", width+"px")
			    			.style("height", height+"px")
							.attr("class" , "sortable");

			
			//create sample rect
			var rect_sample = d3.select("#sample_glyph").append("div")
					.style("width","50px")
					.style("height","60px")
					.style("float","left")
				  	.style("position" , "relative")
					.attr("id", "glyph_sample" )
					
			var values = [{"value":max_per_cap,"norm_value": .6},{"value":max_pop,"norm_value":.6}];
			half_circle("#glyph_sample",values,glyph_colors,box_height);
			rect_sample.append('div')
						.attr('id','legendtext1')
		    			.style("width","200px")
		      			.style('top','21px')
		      			.style('left', (-185) + 'px')
				  		.style("position" , "absolute")
				  		.style('font-weight',500)
				  		.style('font-size','9px')
				  		.style('color','#333')				  		
				  		.style('text-align','right')
		      			.html(res + " aid per capita")
		      			
		    rect_sample.append('div')
		    			.attr('id','legendtext2')
		    			.style("width","200px")
		      			.style('top','35px')
		      			.style('left', (-185) + 'px')
				  		.style("position" , "absolute")
				  		.style('font-weight',500)
				  		.style('line-height','7px')
				  		.style('color','#333')				  		
				  		.style('text-align','right')
		      			.html(getIndicatorDef(res))
		      			
			rect_sample.selectAll("path").style("cursor","default");
	
	
			//read the file and get country + code
			//var file = "data/aiddata_final_education_health_water.csv";
			
			var file = "/static/projects/aid_indicators/data/aid_vis_master_table.csv";
			d3.csv(file, function(err, cnt) {
				c = cnt;

				cnt.forEach(function(i){
					i.gdp_indicator_yearly = (i.gdp_indicator_yearly.split(",").map(function(x) { return x / i.population; })).join(",")
					i.gdp_indicator_average = Number(i.gdp_indicator_average) / i.population;
				})
				var totalaidreason= 0;
				var totalaid = 0;
				switch(sortorder)
				{
					case "-all_total_aid_reason":
						if(res == "Agriculture" ) { 
							sortorder = "-agriculture_total_aid";

						} else if(res == "Law & Justice" ) {
							sortorder = "-law_and_justice_total_aid";
							
						} else if(res == "Water" ) {
							sortorder = "-water_total_aid";
							
						} else if(res == "Education" ) {
							sortorder = "-education_total_aid";
							
						} else if(res == "Health" ) {
							sortorder = "-health_total_aid";
							
						} else {
							sortorder = "-all_total_aid"
						}
						
		  				break;
		  			case "-all_per_capita_aid":	
					if(res == "Agriculture" ) { 
						sortorder = "-agriculture_per_capita_aid";
					} else if(res == "Law & Justice" ) {
						sortorder = "-law_and_justice_per_capita_aid";
						
					} else if(res == "Water" ) {
						sortorder = "-water_per_capita_aid";
						
					} else if(res == "Education" ) {
						sortorder = "-education_per_capita_aid";
						
					} else if(res == "Health" ) {
						sortorder = "-health_per_capita_aid";
						
					} else {
						sortorder = "-all_per_capita_aid";
					}
					
						break;
		  			case "-indicator":
						if(res == "Agriculture" ) { 
							sortorder = "-agriculture_indicator_average";
						} else if(res == "Law & Justice" ) {
							sortorder = "-law_and_justice_indicator_average";
						} else if(res == "Water" ) {
							sortorder = "-water_indicator_average";
						} else if(res == "Education" ) {
							sortorder = "-education_indicator_average";
						} else if(res == "Health" ) {
							sortorder = "-health_indicator_average";
						} else {
							sortorder = "-gdp_indicator_average";
						}
						break;
					default:
						break;
				}
			 	cnt.sort(dynamicSort(sortorder));
			 	var count = 0; 
			 	var h =0;
			 	cnt.forEach(function(i){
		 		var divname = "circle_hover"+ "_"+ i.country_code;
		 					
				
				if(d3.select("#check_box")[0][0].checked)
				{
					if($.inArray(divname, selected) < 0)
					{
						return;
					}
				}

				var left = (0) + "px"//((80 * count) + 4) + "px"; 
				var top = (0) + "px"//((75 * h) + 4) + "px";
	
				var upper, upperfactor,upper_year_values,lower,lowerfactor,lower_year_values;
				totalaid = i.all_total_aid;

				if(res == "Law & Justice" ) {
					totalaidreason = i.law_and_justice_total_aid;
					upper = i.law_and_justice_per_capita_aid;
					upperfactor = (upper/max_per_capita_aids[4]);
				    upper_year_values = i.law_and_justice_aid_yearly.split(",");
				    	
					lower = i.law_and_justice_indicator_average;
					lowerfactor = (lower  / max_indicator_values[4]);
					lower_year_values = i.law_and_justice_indicator_yearly.split(",");
				}
				else if(res == "Agriculture" ) {
					totalaidreason = i.agriculture_total_aid;
					upper = i.agriculture_per_capita_aid;
					upperfactor = (upper /max_per_capita_aids[1]);
					upper_year_values = i.agriculture_aid_yearly.split(",");
				
					lower = i.agriculture_indicator_average;
					lowerfactor = (lower  / max_indicator_values[1]);
					lower_year_values = i.agriculture_indicator_yearly.split(",");
				}
				else if(res == "Water" ) {
					totalaidreason = i.water_total_aid;
					upper = i.water_per_capita_aid;
					upperfactor = (upper /max_per_capita_aids[5]);
					upper_year_values = i.water_aid_yearly.split(",");
					
					lower = i.water_indicator_average;
					lowerfactor = (lower  / max_indicator_values[5]);
					lower_year_values = i.water_indicator_yearly.split(",");
				}
				else if(res == "Health" ) {
					totalaidreason = i.health_total_aid;
					upper = i.health_per_capita_aid;
					upperfactor = (upper/max_per_capita_aids[3]);
					upper_year_values = i.health_aid_yearly.split(",");
				
					lower = i.health_indicator_average;
					lowerfactor = (lower  / max_indicator_values[3]);
					lower_year_values = i.health_indicator_yearly.split(",");
				}
				else if(res == "Education" ) {
					totalaidreason = i.education_total_aid;
					upper = i.education_per_capita_aid;
					upperfactor = (upper/max_per_capita_aids[2]);
					upper_year_values = i.education_aid_yearly.split(",");
				
					lower = i.education_indicator_average;
					lowerfactor = (lower/max_indicator_values[2]);
					lower_year_values = i.education_indicator_yearly.split(",");
				}
				else {
					upper = i.all_per_capita_aid;
					upperfactor = (upper/max_per_capita_aids[0]);
					upper_year_values = i.all_aid_yearly.split(",");
				
					lower = i.gdp_indicator_average;
					lowerfactor = (lower  / max_indicator_values[0]);
					lower_year_values = i.gdp_indicator_yearly.split(",");
				}
				 var rec= svg.append("li")
					.attr("data-country",i.country)
					.attr("data-code", i.country_code)
					.style("width", box_width + "px")
					.style("height",box_height + "px")
					.style("float","left")
					.style("z-index",2)
					.style("cursor","pointer")
				  	.style("position" , "relative")
					.style("border" , "1px solid")
					.style("border-color","rgba(200,200,200,.3)")
					.on("mouseover", function(){
						if($.inArray(d3.select(this).attr("id"), selected) < 0)
						{
							d3.select("#"+divname).selectAll("path").style("opacity",1);
						}
						if(res != "Total") {
							
							if(res == "Law & Justice" ) {
								totalaidreason = i.law_and_justice_total_aid;
							} else if(res == "Agriculture" ) {
								totalaidreason = i.agriculture_total_aid;
								
							}else if(res == "Water" ) {
								totalaidreason = i.water_total_aid;
								
							}else if(res == "Health" ) {
								totalaidreason = i.health_total_aid;
								
							}else if(res == "Education" ) {
								totalaidreason = i.education_total_aid;
								
							}else 
							{
								totalaidreason =  0;
							}
							
							d3.select("#hover_totalaidreason")
							.attr("visibility","visible")
							.text("Total " + res + " Aid:      " + 
							"$" + numberWithCommas(totalaidreason));
						} else {
							d3.select("#hover_totalaidreason")
							.attr("visibility","hidden");
						}
						//#hover_totalaidreason
						d3.select("#hover_country")
						.attr("visibility","visible")
						.text($(this).attr("data-country"));
		
						d3.select("#hover_population")
						.attr("visibility","visible")
						.text("Population:         " +
						 numberWithCommas(i.population));
				
						
						d3.select("#hover_totalaid")
						.attr("visibility","visible")
						.text("Total Aid:            " + 
						"$" + numberWithCommas(i.all_total_aid));
						
						if(res == "Total" || res == "All" || res == ""){
								indicator_text =  "$" + numberWithCommas(lower.toFixed(0))
						}
						else if(res == "Health")
						{
								indicator_text =  Number(lower).toFixed(1)
						}
						else{
								indicator_text =  Number(lower).toFixed(1) + "%";
						}
						d3.select("#hover_indicator")
						  .attr("visibility","visible")
						  .text(getIndicatorDefShort(res) + " : " +  indicator_text);
						
						d3.select("#hover_aidpercapita")
						.attr("visibility","visible")
						.text("Aid Per Capita:  " + "$" 
						+ numberWithCommas(upper));
						
						d3.select("#hover_clicktoseemore")
								.attr("visibility","visible");
								
						d3.select("#hover_bar").selectAll("g").remove()
						aid_totals = [i.agriculture_total_aid,i.education_total_aid,i.health_total_aid,i.law_and_justice_total_aid,i.water_total_aid]
  						for(ai=0; ai < aid_totals.length; ai++){
  							if(Number(aid_totals[ai]))
  							{								
  								aid_totals[ai]=Number(aid_totals[ai]);
  							}
  							else
  							{
  								aid_totals[ai]=0;
  							}
  						}
  						horizontal_stacked_bar("#hover_bar",aid_totals);

					})
					.on("mouseout",  function(d,i) {
						if($.inArray(d3.select(this).attr("id"), selected) < 0)
						{
							d3.select("#"+divname).selectAll("path").style("opacity",.8);
						}
						d3.select("#hover_country")
								.attr("visibility","hidden");
						d3.select("#hover_population")
								.attr("visibility","hidden");
						d3.select("#hover_totalaid")
								.attr("visibility","hidden");
						d3.select("#hover_aidpercapita")
								.attr("visibility","hidden");
						d3.select("#hover_clicktoseemore")
								.attr("visibility","hidden");
						d3.select("#hover_indicator")
								.attr("visibility","hidden");		
						d3.select("#hover_totalaidreason")
								.attr("visibility","hidden");
						d3.select("#hover_bar").selectAll("g").remove()
					})
					.on("click",  function(d,i) {
						console.log(d3.select(this));
						if(($.inArray(d3.select(this).attr("id"), selected) < 0 || d3.select("#check_box")[0][0].checked) && (d3.select(this)[0][0].clientHeight < 200))
						{

							d3.select(this).selectAll("path").style("opacity",.35);
							selected.push(d3.select(this).attr("id"));
							n = 5;
							large_width = (n*box_width + (n-1)*2)+1;
							large_height = (n*box_height + (n-1)*2)-2;
							d3.select(this)
											.transition()
											.duration(300)
											.style("width", large_width + "px")
											.style("height", large_height + "px");
								
							d3.select(this)
										.select("svg")
										.transition()
										.duration(300)
										.style("width", large_width + "px")
										.style("height", large_height + "px")
										.selectAll("path")
										.attr("transform", "translate(" + (large_width-box_width+15)/2 + "," + (large_height-box_height+18)/2 + ")")
							
							var yearly_values = [
								{"value":upper,"norm_value": upperfactor,"yearly_values":upper_year_values},
								{"value":lower,"norm_value":lowerfactor,"yearly_values":lower_year_values}
							];

							half_circle_spatial("#"+d3.select(this).attr("id"),yearly_values,glyph_colors,large_height);
							toggleCheckBox();							
						}
						else
						{
							if(d3.select("#check_box")[0][0].checked==false)
							{					
								selected.pop(d3.select(this).attr("id"));
							}
							d3.select(this).selectAll("path").style("opacity",.8);
							d3.select(this)
								.transition()
								.duration(300)
								.style("width",box_width + "px")
								.style("height", box_height + "px")
						
							d3.select(this)
								.select("svg")
								.transition()
								.duration(300)
								.style("width",box_width + "px")
								.style("height", box_height + "px")
								.selectAll("path")
								.attr("transform", "translate(" + 0 + "," +  0 + ")")

							for(k=1; k<4; k++)
							{
								if(d3.select(this).selectAll("svg")[0][k])
								{
									d3.select(this).selectAll("svg")[0][k].remove()
								}
								else
								{
									break;
								}
							}
							toggleCheckBox();
						}
					})
					.attr("id", divname ); 
					
					count ++;
					var country_text = rec.append('div')
		      							.attr('class', 'country_text')
		      							.style('top','8px')
				  						.style("position" , "absolute")
		      							.text(i.country);
					
					
					//working on this right now
					var values = [
						{"value":upper,"norm_value": upperfactor,"yearly_values":upper_year_values},
						{"value":lower,"norm_value":lowerfactor,"yearly_values":lower_year_values}
						];
					half_circle("#"+divname,values,glyph_colors,box_height);
					
	
			  });

			});				
		
		
			var sortabletimmer = setTimeout(function() { 
			    $( ".sortable" ).sortable();
			    $( ".sortable" ).disableSelection();
			}, 1500);
 	
		}, 1300);
		
	}
	
