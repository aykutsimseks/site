// Original tempalte from http://cartodb.com/v/maya-angelou
// Altug Firarda, by Aykut Simsek (aykutsimseks@gmail.com)

var months = {
	//'eng' : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	//'tr'  : ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
	
	'eng' : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	'tr'  : ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
}

var daydiff = function(first, second) {
	return parseInt((second - first) / (1000 * 60 * 60 * 24));
}

var daydiff_str = function(first,second) {
	return (daydiff(first,second)+1) + (tr ? (" gün") : (" days"))
}

function formatDateInterval(s,e) {
	var string = ""
	if(s.getMonth() == e.getMonth()) {
		if(s.getUTCDate() !=  e.getUTCDate()) {
			string = s.getUTCDate() + " - " 
		}
		string += e.getUTCDate() + " " + months[tr?'tr':'eng'][e.getMonth()]
	}
	else {
		string = formatDate(s) + " - " + formatDate(e)
	}
	var date_diff = daydiff(s, e)
	if(date_diff > 0) {
		string += " (" + daydiff_str(s,e) + ")"
	}
	return string
}

function instagramEmbedCode(instagram_link,width) {
	return '<blockquote class="instagram-media" data-instgrm-version="1" style="margin:auto;width:' + width + 'px;border-radius:0;">'
			+ '<a href="' + instagram_link + '"></a>'
			+ '</blockquote> '
}

function formatDate (date) {
	return  date.getUTCDate() + " " + months[tr?'tr':'eng'][date.getMonth()]//.slice(0,3)
}

var urlParam = function(name, w) {
	w = w || window;
	var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
		val = w.location.search.match(rx);
	return !val ? '' : val[1];
}


// Day line cross index for crossing dayline 
var dlci = 87;
var tr = true;

var current_link = null;
var create_vis = function() {
	if (urlParam('l') == 'en') {
		tr = false;
	}
	
	
	var marker = L.icon({
		iconUrl: '/static/projects/altug_firarda/img/location.png',
		iconSize: [24, 34],
		iconAnchor: [12, 32]
	});
	var map;
	
	var points;
	var line_data = []
	var line_lookup = {};
	var polyline;
	var transMarkers = new L.FeatureGroup();
		
	var startDate = new Date('02/02/2015')
	var endDate = new Date('08/21/2015');
	var panel_width;
	var insta_height;
	
	
	var view_setup = function() {
		panel_width  = Math.min( 
			350, // Max limit
			$('#container').width(),
			(($('#content').height()) * 0.8)
		)
			
		insta_height= panel_width * 1.25;
		$('#instagram-caption').width(($('#container').width() - 20) + 'px')
		$('#instagram-caption').height(($('#content').height() - insta_height) + "px")
		
		$('#cover').css('background-position-x', $('#container').width()/2)
	}
	view_setup();
	
	// Mini Map
	function drawMiniMap() {
		var vis_color_sets = [colorbrewer['Blues'], colorbrewer['Greens']]

		selected_indicator 	= [null,null]
		selected_polygons 	= [null,null]
		world_polygons 		= null
		countries	   		= null
		visited = ["Turkey","United Arab Emirates","India","Sri Lanka","Maldives","Singapore","Indonesia","Malaysia","Australia","Thailand","Laos","Vietnam","Cambodia","Japan","China","Macau","Hong Kong","United States of America","Mexico","Cuba","Germany"]


		d3.json("/static/projects/altug_firarda/data/countries.topojson", function(error, world) {
			world_polygons = world
	
			// Extend polygons data with csv data
			countries = topojson.feature(world_polygons, world_polygons.objects.land).features;
			// Parse yearly values, calculate mean and last value

			// Draw maps
			drawMap("#map_canvas1", { 'index': 1, 'color' : 'rgba(51, 122, 183,1)' })
			$('#map-panel').hide();
		})		
	}
	drawMiniMap()
	////
		
	var add_line_icons = function(start,end, icons) {
		var line = [];
		var icon;
		var prev_loc = [];
		var curr_loc = [];
		icons = icons||true;
		
		if(start < -1) {
			start = 0;
			end   = points['length']; 
			icons = false;
		}
		
		var transportMarker = L.AwesomeMarkers.icon({
    		icon: 'plane',
    		prefix: 'fa', 
    		iconColor: '#990000',
    		iconSize: [24, 34], 
    		iconAnchor: [12, 16]
  		});
  		
  		
  		transMarkers.clearLayers();
		for (var m = start; m < end; ++m) {
  			if(points[m]) {
  				if(points[m]['cartodb_id'] == dlci) {
  					curr_loc = [points[m]['lat'],points[m]['lon']];
  					line.push(L.latLng(curr_loc[0],curr_loc[1]+360,true));
  					line.push(L.latLng(prev_loc[0],prev_loc[1]-360,true));
  					line.push(L.latLng(curr_loc,true));
  					continue
  				}
		
  			
  				curr_loc = [points[m]['lat'],points[m]['lon']];
	    		line.push(L.latLng(curr_loc,true));
	    		if(prev_loc.length > 0 && icons) {
	    			try {
	    				transportMarker.options.icon = points[m]['arrived_by'];
	    				var t_mark = L.marker([(points[m]['lat'] + points[m-1]['lat'])/2,(points[m]['lon'] + points[m-1]['lon'])/2],{icon: transportMarker });    				
			    		transMarkers.addLayer(t_mark);
			    	}
			    	catch(err) {
			    		console.log(err)
			    	}
				}
				prev_loc = curr_loc;
			}
		};
		
		map.addLayer(transMarkers);
		
		var polyline_options = {
    		color: '#990000',
    		weight: 2,
    		dashArray: [4,5],
    		smoothFactor: 0

  		};
		if(polyline) {
			try {
				map.removeLayer(polyline);
			}
			catch(err) {
				console.log(err);
			}
		}
		// Overview
		if(start == 0 && end > 3) {
			line = [line.slice(0,87),line.slice(87)]
		}
		// Hong Kong -> NYC
		else if(start == dlci-3) {
			line = [[line[0],line[1],line[2]]]
		}
		// NYC -> Cancun
		else if(start == dlci-2 || start == dlci-1) {
			line = [[line[2],line[3],line[4]]]
		}
		else { 
			line = [line]
		}
		polyline = new L.multiPolyline(line, polyline_options)
		map.addLayer(polyline);
		
	}
	
	if(tr) {
		$('#loader span').html("&nbsp;Yükleniyor...");
		$('#info-text').html('* Klayvenizin sağ/sol tuşlarını veya yukarıdaki ok tuşlarını kullanarak günleri değiştirebilir, ülke isimlerine tıklayarak direkt o ülkere ulaşabilirsiniz.')
	}
	else {
		$('#loader span').html("&nbsp;Loading...");
		$('#info-text').html('* Use the left/right arrow keys on your keyboard or on the screen to navigate the map. You can click on country names above for direct access to those countries.');
	}
	
	cartodb.createVis('map', 'http://aykutsimseks.cartodb.com/api/v2/viz/73dba65c-eb63-11e4-a391-0e9d821ea90d/viz.json', {
			shareable		: false,
			zoomControl		: false,
			cartodb_logo 	: false,
			mobile_layout	: true,
			force_mobile	: true
		})
		.done(function(vis, layers) {
			if(tr) {
				$('#map div.aside h3').html('Toplam ' + ($('#map div.cartodb-legend ul li').length -1) + " Ülke")
			}
			else {
				$('#map div.aside h3').html(($('#map div.cartodb-legend ul li').length -1) + " Countries")
			}
			map = vis.getNativeMap()
			
			map.setActiveArea({
				position: 'absolute',
				top: 0,
				bottom: 0,
				left:	$('#container').width() + 'px',
				right: 0,
			});
			
			$('#map div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div, .cartodb-attribution li')
			.prepend('<a href="http://www.aykutsimsek.com" target="_blank">Aykut Simsek</a> | <a href="http://cartodb.github.io/odyssey.js/index.html" target="_blank">Odyssey.js</a> | ')

			new L.Control.Zoom({ position: 'topright' }).addTo(map);
					
			var seq = O.Sequential();
			var story = O.Story();
			var update 	= function(point,index) {				
				return O.Action(function() {
					var pos 			= 	[point.lat, point.lon];
					var zoom 			= 	point.zoom;
					
					$('#map-panel').hide();
					
					map.setView(pos,zoom);
					add_line_icons(index-2,index+1)	
					$('#page-counter').html((story.state() + 1) + ' / ' + (points.length + 1))
					
					
					var place 			= (tr?point.place_tr:point.place);
					var country 		= (tr?point.country_tr:point.country);
					var title			= $.grep([place, country], Boolean).join(', ')
					$('#place').html(title)
					
					//var begin_arr		= point.begin_date.split('T')[0].split('-')
					//var begin 			= new Date(begin_arr.slice(0,3));
					//var end_arr			= point.end_date.split('T')[0].split('-')
					//var end 			= new Date(end_arr.slice(0,3));
					var begin 			= Date.parse( point.begin_date.split('T')[0])
					var end 			= Date.parse( point.end_date.split('T')[0])
					var date			=  "<span class='glyphicon glyphicon-calendar'></span> " + formatDateInterval(begin,end)
					$('#date').html(date)
					
					
					var day_count		= '<div style="width:100%;text-align:center;margin-bottom:-.3em;">' + (tr?"Gün":"Day") + '</div><div style="font-size:1.5em;line-height: 1em;text-align:center;">' + (daydiff(startDate, begin) + 1) + '</div>';//(tr ? ((daydiff(startDate, begin)+1) + ". Gün") : ("Day " + (daydiff(startDate, begin) + 1)));
					$('#day_count').html(day_count)
					//var description 	= point.description;
					
					
					var caption 		= (tr?point.story_tr:point.story);
					if(caption) {
						$('#instagram-caption').html(
						[	'<div class="Embed" ><div class="EmbedCaption normal-text">',
							twemoji.parse(caption.replace(/#(\S*)/g,'<div class="hashtag" style="color:#3f729b;display:inline-block;">#$1</div>')),
							'</div></div>'
						].join(''))
					}
					else {
						$('#instagram-caption').html('');
					}
					
					var instagram_link 	=	point.instagram_links
					if(instagram_link) {
						current_link = instagram_link;
						$('#loader').css("display","inline-block");
						$('#instagram-embed').html(instagramEmbedCode(instagram_link, panel_width))
						//$('#instagram-modal .modal-body').html(instagramEmbedCode(instagram_link, Math.min($(window).height()-300,$('#instagram-modal').width())))
						
						var modal_width = Math.min($(window).height()-240,$('#instagram-modal').width());
						if(panel_width < 220) {
							window.instgrm.Embeds.process();
							$('#instagram-modal .modal-body').html("")
							$('button.full-screen').prop('disabled', true);
						}
						else {
							$('button.full-screen').prop('disabled', false);
						}
						
						$('#instagram-modal .modal-footer-content').html("<span style='font-weight:800;font-size:1.2em;padding-right:20px;'>"  + title + "</span></br>" + date)
						$.ajax({
							url: 'https://api.instagram.com/oembed?url=' + instagram_link + '&hidecaption=true&maxwidth=' + modal_width,
							dataType: 'jsonp',
							async: false,
							success: function(json, textStatus, jqXHR) {
								$('#instagram-modal .modal-dialog').width(modal_width)
								$('#instagram-modal .modal-body').html(json.html)
								window.instgrm.Embeds.process()
							}
						})
						//$('#instagram-modal .modal-body').html('<iframe height="100%" width="100%" src=' + instagram_link + '></iframe>')
						
					}
					else {
						$('#instagram-embed').html("")
						$('#loader').css("display","none")
					}	
					
					
					if(index == 0) {
						//var day_count = (daydiff(startDate, endDate)+1) + " " +(tr?"Gün":"Days");
						$('#day_count').html('')
						$('#instagram-embed').html(caption);
						$('#instagram-caption').html('');
						$('#instagram-modal .modal-body').html(caption);
						$('#map-panel').show();
						
						$('#map-panel').clone().prependTo('#instagram-modal .modal-body');
					}
					view_setup();
					
					
				});
			}
			
			
			O.Keys().left().then(seq.prev, seq);
			O.Keys().right().then(seq.next, seq);
			$('button.next').click(function() {
				seq.next();
			})
			$('button.prev').click(function() {
				seq.prev();
			})
			$('button.restart').click(function() {
				seq.current(0);
				story.go(0);
			})
			$('button.full-screen').click(function() {
				//$('#instagram-modal .modal-body')
				$('#instagram-modal').modal('toggle');
			})
			$('a.tr').click(function() {
				window.location="/altug-firarda?l=tr#"+seq.current();
			})
			$('a.en').click(function() {
				window.location="/altug-firarda?l=en#"+seq.current();
			})

			
			
			/// SET UP WELCOME PAGE
			
			
			/////////
			var start_page = {
				'place' 	: "<i class='fa fa-globe' style='font-size:18px;'></i>&nbsp; Altug Firarda &nbsp;<i class='fa fa-globe' style='font-size:18px;'></i>",
				'place_tr' 	: "<i class='fa fa-globe' style='font-size:18px;'></i>&nbsp; Altuğ Firarda &nbsp;<i class='fa fa-globe' style='font-size:18px;'></i>",
				'begin_date': startDate.toISOString(),
				'end_date'	: endDate.toISOString(),
				'story'		: [
							  "<div style='padding:0 10px 10px 10px;height:" + ($('#content').height() - 202) + "px;overflow-y: auto;text-overflow: ellipsis;'>"
							  ,"<p>This is the summary of my world trip which I traveled 4 continents, 20 countries, 82 cities in 6.5 months by taking 26 flights, countless bus, train, car, ferry and motorcycle trips after taking a one way flight to India with my backpack without any proper plan on 2nd February 2015.</p>"
 							  ,"<p>For more detailed pictures and stories you can also check my <a href='https://instagram.com/altugsimsek/' target='_blank'>Instagram</a> account.</p>"
							  ,"<p>To move between days and places, use the left/right arrow keys on your keyboard or on the screen. You can directly access countries by clicking the name of the country at the bottom of the screen.</p>"
							  ,"<p>If you have any questions, you can reach me via <a href='mailto:simsekaltug@gmail.com' target='_blank'>simsekaltug@gmail.com</a></p>"
							  ,"<p>Enjoy your trip.</p>"
							  ,"</div>"
							  ].join('') ,
				'story_tr'	: [
							  "<div style='padding:0 10px 10px 10px;height:" + ($('#content').height() - 202) + "px;overflow-y: auto;text-overflow: ellipsis;'>"
							  ,"<p>2 şubat 2015 tarihinde sadece bir sırt çantası ve Hindistan’a tek yön bir bilet alarak başladığım ve 6.5 ayda, 4 kıta, 20 ülke, 82 şehir gezdiğim; 26 uçak yolculuğu, sayısız otobüs, tren, araba, gemi ve motosiklet yolculukları yaptığım 200 günlük dünya turumun haritasını ve maceralarımın bir kısmını bu sitede bulabilirsiniz.</p>"
							  ,"<p>Daha detaylı fotoğraflar ve hikayeler için <a href='https://instagram.com/altugsimsek/' target='_blank'>Instagram</a> hesabıma göz atabilirsiniz.</p>"
							  ,"<p>Seyahatimdeki günleri ilerletmek ve rotamı görebilmek için klavyenizin sağ/sol ok tuşlarını veya ekrandaki ok tuşlarını kullanabilirsiniz. Bulunduğum ülkelere direkt ulaşabilmek için ise ekranın altındaki ülke isimlerine tıklayabilirsiniz.</p>"
							  ,"<p>Seyahate başlamadan önce Altuğ Şimşek kimdir derseniz <a href='http://altugfirarda.blogspot.com.tr/2015/03/ben-kimim-neden-ve-nasl-dunya-turu.html' target='_blank'>buraya</a>, gezi öncesindeki hazırlıklarımı öğrenmek için <a href='http://altugfirarda.blogspot.com.tr/2015/03/seyahat-hazrlklarm-ve-turkiyede-son.html' target='_blank'>buraya</a> tıklayabilirsiniz.</p>"
							  ,"<p>Bunlara ek olarak seyahat sonrası yorumlarım veya başka sorularınız için <a href='mailto:simsekaltug@gmail.com' target='_blank'>simsekaltug@gmail.com</a> adresinden benimle iletişime geçebilirsiniz.</p>"
 							  ,"<p>Keyifli yolculuklar.</p>"
 							  ,"</div>"
							  ].join(''),
				'lat'		: 10,
				'lon'		: -10,
				'zoom'		: 2
			}
			var action0		= O.Step(
				update(start_page, 0),
				O.Location.changeHash('#' + 0)
			)
			story.addState(seq.step(0), action0);
			
			var sql = new cartodb.SQL({
				user: 'aykutsimseks'
			});
			sql.execute("SELECT * FROM altug_firarda ORDER BY cartodb_id ASC")
				.done(function(data) {
					points = data.rows;
					for (var i = 0; i < points.length; ++i) {
						var point = points[i]
						var action = O.Step(
							L.marker([point.lat, point.lon], { icon: marker }).actions.addRemove(map),
							update(point, (i+1)),
							O.Location.changeHash('#' + (i + 1))
						)
						story.addState(seq.step((i + 1)), action);
					}
					
					if (location.hash && location.hash.slice(1)>0) {
						seq.current(+location.hash.slice(1));
					} else {
						seq.current(0);
						story.go(0);
					}
					
					
					for (var i = 0; i < points.length; i++)  {
						var point = data.rows[i];
						if(!(point['country'] in line_lookup)) {
							line_data.push({
								'color':'rgba(255,255,255,.5)',
								//'date':point['begin_date'].split('-')[2].split('T')[0]  + "." + point['begin_date'].split('-')[1], 
								'date':line_data.length+'.00', 
								'seq_id': i,
								'id': (line_data.length+1), 
								'image': "",
								'text':point['country'],
								'text-offset': 0,
								'd':[]
							})
							
							line_lookup[point['country']] = i
						}
					}
					$('#map div.cartodb-legend ul li').click(function() {
						story.go(line_lookup[$(this).text().trim()]+1)
						seq.current(line_lookup[$(this).text().trim()]+1)
					})
					
				})
				.error(function(errors) {
					// errors contains a list of errors
					console.log("errors:" + errors);
			});
		});

}



/// Map
function initElements(opts) {
	var theme_color = opts['color'] || 'rgba(222,94,96,1)'
	var index = opts.index;
	
	d3.select('#hover_text'+ index)
		.style('text-align', 'right')//opts.index%2?'left':'right')
		//.style('min-height', '56px')
		.style('font-size', '13px')
		.style('color', theme_color)
	
}

function hoverUpdateElements(feature, opts) {
	var index = opts.index;
	var hover_text = d3.select('#hover_text' + opts.index)
	if(feature) {
		hover_text.html("<div style='vertical-align:middle'>" + feature.properties.name + "</div>");
	}
	else {
		hover_text.html('&nbsp;');
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
	
	var highlight_opacity 	= .7;
	var default_opacity 	= 1;
	
	var world_map = g
		.selectAll("path")
		.data(countries)
		.enter().append("path")
		.style('cursor','pointer')
		.attr('style', function(d,i){
			var style_json = {
					'cursor' 			: 'pointer',
					'fill'	 			: (visited.contains(d.properties.name))?opts['color']:'#f0f0f0',
					'stroke' 			: '#444',
					'stroke-width'		: '.4px',
					'stroke-linejoin'	: 'round',
					'opacity'			: default_opacity
				}
			
			if(visited.contains(d.properties.name)) { var index = visited.indexOf(d.properties.name);visited.splice(index, 1);}
			var style = ""
			for (var s in style_json) {
				style += s + ":" + style_json[s] + ";"
			}
			return style
		})
		.attr("d", path);
	console.log(visited)
	initElements(opts)
	
	world_map
		.on("mouseover", function(d) {
			d3.select(this).style('opacity', highlight_opacity);
			hoverUpdateElements(d,opts)
		})
		.on("mouseout", function(d) {
			d3.select(this).style('opacity', default_opacity);
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
							d3.select(this).style('opacity',default_opacity);
							hoverUpdateElements(d,opts)
						})
						.on("mouseout", function(d) {
							var opacity = (d == centered)?default_opacity:highlight_opacity;
							d3.select(this).style('opacity',opacity);
							hoverUpdateElements(centered,opts)
						})
					d3.select(elem_id + " .centered").style('opacity', default_opacity)
				})
				.each("end", function() {
					
					d3.select(elem_id + " .centered").style('opacity',default_opacity)
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
						.style('opacity', default_opacity)
						.on("mouseover", function(d) {
							d3.select(this).style('opacity', highlight_opacity)
							hoverUpdateElements(d,opts)
						})
						.on("mouseout", function(d) {
							d3.select(this).style('opacity', default_opacity)
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