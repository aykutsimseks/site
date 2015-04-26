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
	
	var points;

	var startDate = new Date('02/01/2015')
	var currentDate = new Date();

	cartodb.createVis('map', 'http://aykutsimseks.cartodb.com/api/v2/viz/73dba65c-eb63-11e4-a391-0e9d821ea90d/viz.json', {
			shareable: true,
			zoomControl: true
		})
		.done(function(vis, layers) {
			var map = vis.getNativeMap();
			$('#map > div:nth-child(2) > div > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div').prepend('Map by <a href="http://www.aykutsimseks.com" target="_blank">Aykut Şimşek</a> | ')
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

			var updateUI = function(title, description, sources, location, date, marker, k) {
				return O.Action(function() {
					//$('#milestone > #picture').attr('src',images[k])
					$('#milestone > #top-section >  h3').html(title)
					$('#milestone > #top-section > #location').html(location)
					$('#milestone > #top-section > #date').html(date)
					$('#milestone > #text-description').html(description)
					$('#milestone > #text-sources').html(sources)
					$('#footer > #buttons > span').html(story.state() + 1 + ' / ' + (points.length + 1))
				});
			}

			var action = O.Step(
				map.actions.setView([0, 52.0186], 3),
				//O.Debug().log("state " + 0),
				updateUI(
					"Altuğ Firarda",
					"", (tr ? "6 Aylık dünya turumda gezdiklerim, gördüklerim ve yaşadıklarım." : "English"), (tr ? ((daydiff(startDate, currentDate) + 1) + ". Gün") : ("Day " + (daydiff(startDate, currentDate) + 1))),
					"<span class='glyphicon glyphicon-calendar'></span> " + startDate.toLocaleDateString() + " - " + currentDate.toLocaleDateString() + " (" + (daydiff(startDate, currentDate) + 1) + (tr ? (" gün") : (" days")) + ")",
					marker, 0),
				O.Location.changeHash('#' + 0)
			)
			story.addState(seq.step(0), action);


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
								'', (tr ? ((daydiff(startDate, begin) + 1) + ". Gün") : ("Day " + (daydiff(startDate, begin) + 1))),
								"<span class='glyphicon glyphicon-calendar'></span> " + begin.toLocaleDateString() + " - " + end.toLocaleDateString() + " (" + (daydiff(begin, end) + 1) + (tr ? (" gün") : (" days")) + ")",
								marker, (i + 1)
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

				})
				.error(function(errors) {
					// errors contains a list of errors
					console.log("errors:" + errors);
				});

		});

}