// Original tempalte from http://cartodb.com/v/maya-angelou
// Altug Firarda, by Aykut Simsek (aykutsimseks@gmail.com)

var daydiff = function(first, second) {
	return parseInt((second - first) / (1000 * 60 * 60 * 24));
}

var urlParam = function(name, w) {
	w = w || window;
	var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
		val = w.location.search.match(rx);
	return !val ? '' : val[1];
}

var marker = L.icon({
	iconUrl: '/static/projects/altug_firarda/img/location.png',
	iconSize: [24, 34],
	iconAnchor: [12, 32]
});

// Day line cross index for crossing dayline 
var dlci = 87;

window.onload = function() {


}

window.onload = function() {
	var tr = true;
	if (urlParam('l') == 'en') {
		tr = false;
	}
	var map;
	
	var points;
	var line_data = []
	var line_lookup = {};
	var polyline;
	var transMarkers = new L.FeatureGroup();
		
	var startDate = new Date('02/01/2015')
	var currentDate = new Date('08/20/2015');
	

  // Parse the document body and
  // insert <img> tags in place of Unicode Emojis

	
	
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
		$('#instagram-loader').html("<i style='font-size:36px;vertical-align:-4px;' class='fa fa-spinner fa-pulse' ></i>&nbsp;Yükleniyor...");
		$('#controls-text').html('* Klayvenizin sağ/sol tuşlarını veya yukarıdaki ok tuşlarını kullanarak günleri değiştirebilir, ülke isimlerine tıklayarak direkt o ülkere ulaşabilirsiniz.')
	}
	else {
		$('#instagram-loader').html("<i style='font-size:36px;vertical-align:-4px;' class='fa fa-spinner fa-pulse' ></i>&nbsp;Loading...");
		$('#controls-text').html('* Use the left/right arrow keys on your keyboard or on the screen to navigate the map. You can click on country names above for direct access to those countries.')
	}
	
	cartodb.createVis('map', 'http://aykutsimseks.cartodb.com/api/v2/viz/73dba65c-eb63-11e4-a391-0e9d821ea90d/viz.json', {
			shareable: true,
			zoomControl: true
		})
		.done(function(vis, layers) {
			map = vis.getNativeMap();
			$('#map > div:nth-child(3) > div > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div')
				.prepend('<a href="http://www.aykutsimseks.com" target="_blank">Aykut Simsek</a> | <a href="http://cartodb.github.io/odyssey.js/index.html" target="_blank">Odyssey.js</a> | ')
							
			var seq = O.Sequential();
			O.Keys().left().then(seq.prev, seq);
			O.Keys().right().then(seq.next, seq);
			$('a.next').click(function() {
				seq.next();
			})
			$('a.prev').click(function() {
				seq.prev();
			})

			var story = O.Story();

			var updateUI = function(title, description, sources, location, date, marker, k, instagram_link) {				
				return O.Action(function() {
					/* http://api.instagram.com/publicapi/oembed/?url=http://instagr.am/p/ynan9PR-1N/ */
					/* data-instgrm-captioned  */
					$('#milestone > #text-description').html('')
					if(instagram_link) {
						var html = '<blockquote class="instagram-media" data-instgrm-version="4" style="width:320px;border-radius:0">'
								   + '<a href="' + instagram_link + '"></a>'
								   + '</blockquote> '
						
						$('#instagram-loader').css("display","inline-block");
						$('#milestone > #instagram-embed').html(html)
                		window.instgrm.Embeds.process()
                		console.log(twemoji.parse(description))
        	        	if(description) {
							$('#milestone > #text-description').show().html(
							[	'<div class="Embed" ><div class="EmbedCaption">',
								twemoji.parse(description.replace(/#(\S*)/g,'<div class="hashtag" style="color:#3f729b;display:inline-block;">#$1</div>')),
								'</div></div>'
							].join(''))
						}
						else {
							$('#milestone > #text-description').show().html('');
						}
					}
					else {
						$('#milestone > #instagram-embed').html("")
						$('#instagram-loader').css("display","none")
						$('#milestone > #text-description').hide();
					}
					
					
					//$('#milestone > #picture').attr('src',images[k])
					$('#milestone > #top-section >  h3').html(title)
					$('#milestone > #top-section #location').html(location)
					$('#milestone > #top-section #date').html(date)
					$('#milestone > #text-sources').html(sources)
					$('#buttons > span').html(story.state() + 1 + ' / ' + (points.length + 1))
					add_line_icons(k-2,k+1)			
				});
			}

			var action = O.Step(
				map.actions.setView([10, -10], 2),
				//O.Debug().log("state " + 0),
				updateUI(
					"<i class='fa fa-globe' style='font-size:18px;'></i>&nbsp; Altuğ Firarda",
					"", (tr ? ["2 şubat 2015 tarihinde sadece bir sırt çantası ve Hindistan’a tek yön bir bilet alarak başladığım ve 6.5 ayda, 4 kıta, 20 ülke, 82 şehir gezdiğim; 26 uçak yolculuğu, sayısız otobüs, tren, araba, gemi ve motosiklet yolculukları yaptığım 200 günlük dünya turumun haritasını ve maceralarımın bir kısmını bu sitede bulabilirsiniz."
							  ,""
							  ,"Daha detaylı fotoğraflar ve hikayeler için <a href='https://instagram.com/altugsimsek/' target='_blank'>Instagram</a> hesabıma göz atabilirsiniz."
							  ,""
							  ,"Seyahatimdeki günleri ilerletmek ve rotamı görebilmek için klavyenizin sağ/sol ok tuşlarını veya ekrandaki ok tuşlarını kullanabilirsiniz. Bulunduğum ülkelere direkt ulaşabilmek için ise ekranın altındaki ülke isimlerine tıklayabilirsiniz."
							  ,""
							  ,"Seyahate başlamadan önce Altuğ Şimşek kimdir derseniz buraya, gezi öncesindeki hazırlıklarımı öğrenmek için buraya tıklayabilirsiniz."
							  ,""
							  ,"Bunlara ek olarak seyahat sonrası yorumlarım veya başka sorularınız için <a href='mailto:simsekaltug@gmail.com' target='_blank'>simsekaltug@gmail.com</a> adresinden benimle iletişime geçebilirsiniz."
 							  ,""
 							  ,"Keyifli yolculuklar."].join('<br/>') 
 							  : 
 							  ["This is the summary of my world trip which I traveled 4 continents, 20 countries, 82 cities in 6.5 months by taking 26 flights, countless bus, train, car, ferry and motorcycle trips after taking a one way flight to India with my backpack without any proper plan on 2nd February 2015."
 							  ,""
 							  ,"For more detailed pictures and stories you can also check my <a href='https://instagram.com/altugsimsek/' target='_blank'>Instagram</a> account."
							  ,""
							  ,"To move between days and places, use the left/right arrow keys on your keyboard or on the screen. You can directly access countries by clicking the name of the country at the bottom of the screen."
 							  ,""
							  ,"If you have any questions, you can reach me via <a href='mailto:simsekaltug@gmail.com' target='_blank'>simsekaltug@gmail.com</a>"
							  ,""
							  ,"Enjoy your trip."].join('<br/>') 
						), (daydiff(startDate, currentDate) + 1) + (tr ? " Gün" :" Days"),
					"<span class='glyphicon glyphicon-calendar'></span> " + startDate.toLocaleDateString('en-GB') + " - " + currentDate.toLocaleDateString('en-GB') + " (" + (daydiff(startDate, currentDate) + 1) + (tr ? (" gün") : (" days")) + ")",
					marker, -1, null),
				O.Location.changeHash('#' + 0)
			)
			story.addState(seq.step(0), action);
			//story.go(0)
			//seq.current(0)
	
			var sql = new cartodb.SQL({
				user: 'aykutsimseks'
			});
			sql.execute("SELECT * FROM altug_firarda ORDER BY cartodb_id ASC")
				.done(function(data) {
					points = data.rows;
					for (var i = 0; i < points.length; ++i) {
						var point = data.rows[i];
						var pos = [point.lat, point.lon];

						if (tr) {
							var place = point.place_tr;
							var country = point.country_tr;
							var text = point.story_tr;
						} else {
							var place = point.place;
							var country = point.country;
							var text = point.story;
						}

						var begin = new Date(point.begin_date);
						var end = new Date(point.end_date);

						var story_html = []
						if (point.blog_url) {
							story_html.push("<a href=\"" + point.blog_url + "\" target='_blank'>" + (tr ? 'Devamı..' : 'Read more..') + "</a>")
						}
						var description = point.description;
						var summary = point.summarys;

						var zoom = point.zoom;


						var action = O.Step(
							map.actions.setView(pos, zoom),
							//O.Debug().log("state " + (i+1)),
							L.marker(pos, {
								icon: marker
							}).actions.addRemove(map),
							updateUI(
								[place, country].join(', '),
								text /* + '</br> ' + story_html.join(", ")*/,
								'', (tr ? ((daydiff(startDate, begin)) + ". Gün") : ("Day " + (daydiff(startDate, begin)))),
								"<span class='glyphicon glyphicon-calendar'></span> " + begin.toLocaleDateString('en-GB') + " - " + end.toLocaleDateString('en-GB') + " (" + (daydiff(begin, end)+1) + (tr ? (" gün") : (" days")) + ")",
								marker, 
								(i + 1),
								point.instagram_links
							),
							O.Location.changeHash('#' + (i + 1))
						)
						story.addState(seq.step((i + 1)), action);
					}
					if (location.hash) {
						seq.current(+location.hash.slice(1));
					} else {
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
					//console.log(line_lookup)
					//draw_line(line_data)
						
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
