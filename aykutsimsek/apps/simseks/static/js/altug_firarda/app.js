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
	iconUrl: '../static/img/altug_firarda/location.png',
	iconSize: [24, 34],
	iconAnchor: [12, 32]
});



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
	var currentDate = new Date('08/17/2015');
	
	
	var add_line_icons = function(start,end) {
		var line = [];
		var icon;
		var prev_loc = [];
		var curr_loc = [];
		
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
  				curr_loc = [points[m]['lat'],points[m]['lon']];
	    		line.push(L.latLng(curr_loc));
	    		if(prev_loc.length > 0) {
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
    		dashArray: [4,5]
  		};
		
		try {
			map.removeLayer(polyline);
		}
		catch(err) {
			console.log(err);
		}
		polyline = new L.polyline(line, polyline_options)
		map.addLayer(polyline);
	}
	
	
	cartodb.createVis('map', 'http://aykutsimseks.cartodb.com/api/v2/viz/73dba65c-eb63-11e4-a391-0e9d821ea90d/viz.json', {
			shareable: true,
			zoomControl: true
		})
		.done(function(vis, layers) {
			map = vis.getNativeMap();
			$('#map > div:nth-child(2) > div > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div')
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
					if(instagram_link) {
						var html = '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="4" style="width:310px;">'
								   + '<a href="' + instagram_link + '"></a>'
								   + '</blockquote> '
						$('#milestone > #instagram-embed').html(html)
                		window.instgrm.Embeds.process()
					}
					else {
						$('#milestone > #instagram-embed').html("")
					}
					
					$('#milestone > #text-description').html(description)
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
				map.actions.setView([10, 32.0186], 2),
				//O.Debug().log("state " + 0),
				updateUI(
					"Altuğ Firarda",
					"", (tr ? "6 Aylık dünya turumda gezdiklerim, gördüklerim ve yaşadıklarım." : "English"), (daydiff(startDate, currentDate) + 1) + (tr ? " Gün" :" Days"),
					"<span class='glyphicon glyphicon-calendar'></span> " + startDate.toLocaleDateString() + " - " + currentDate.toLocaleDateString() + " (" + (daydiff(startDate, currentDate) + 1) + (tr ? (" gün") : (" days")) + ")",
					marker, 0),
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
								text + '</br> ' + story_html.join(", "),
								'', (tr ? ((daydiff(startDate, begin)) + ". Gün") : ("Day " + (daydiff(startDate, begin)))),
								"<span class='glyphicon glyphicon-calendar'></span> " + begin.toLocaleDateString() + " - " + end.toLocaleDateString() + " (" + (daydiff(begin, end)) + (tr ? (" gün") : (" days")) + ")",
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
					
					
					for (var i = 0; i < points.length; ++i)  {
						var point = data.rows[i];
						if(/*point['begin_date'] && */!line_lookup[point['country']]) {
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
					console.log(line_lookup)
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
