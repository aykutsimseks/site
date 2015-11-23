var list_item_template = function(data) {
	var imdb_url    = 'http://www.imdb.com/title/' +  data.imdbID + '/'
	var image_url   = '/static/projects/moviera/download/imdb_thumbnails/' + data.imdbID + '.png'
	var genres_str  = data.Genre
	var actors_str	= data.Actors
	var year		= (data.Year||0)
	var month_text  = data.Released.split(' ')[1]
	var month		= (months.indexOf(month_text) || 0)
	
	var air_date	= (parseInt(data.Year||0)*120 + parseInt(month||0)*10 + Number(data.imdbRating||0))
	var imdb_rating	= (Number(data.imdbRating||0)*300000 + parseInt(data.Year||0)*12 + parseInt(month||0))
	
    
	stars_html = ''
	//var rating_text_html  = data.imdbRating +' <small> / </small> 10'
	var imdb_html = '<div class="rating-box">'
				  + 	'<span class="m_imdb_rating" style="display:none">' + imdb_rating + '</span>' + data.imdbRating + '<span class="source">/10</span><div class="source">IMDb</div>'
				  + '</div>'
				  
	
	
	var rotten_tomates_html = '<div class="rating-box">'
	if(data.tomatoRating && data.tomatoRating != 'N/A') {
		rotten_tomates_html +=  data.tomatoRating + '<span class="source">/10</span><div class="source">Rotten Tomatoes</div>'
	}
	rotten_tomates_html += '</div>'
	
	var metacritic_html = '<div class="rating-box">'
	if(data.Metascore  && data.Metascore != 'N/A') {
		metacritic_html +=  data.Metascore + '<span class="source" style="vertical-align: 5px;">%</span><div class="source">Critic Score</div>'
	}
	metacritic_html += '</div>'
	
	var netflix_html = '<div class="rating-box"> '
	if(data.netflixID) {
		//<div class="source"><img height=20 class="netflix-icon" src="/static/projects/moviera/img/netflix_red.png"></img></div>\
		netflix_html += 
						'<a title="Available on Netflix" target="_blank" href="http://www.netflix.com/WiPlayer?movieid=' + data.netflixID + '">\
						' + data.netflixRating + '<span class="source">/5</span><div class="source"><span class="m_netflix" style="display:none">netflix</span>\
								Netflix \
							</div></a>'
	}
	netflix_html += '</div>'
	
	
	var html = [
		'<div class="list-group-item">',
			'<a class="movie-thumb pull-left" href="' + imdb_url +'" target="_blank">',
				'<img class="media-object img-responsive" width="80" height="100" src="/static/projects/moviera/img/movie-placeholder.png"  data-original="' + image_url + '"  alt="' + data.Title +'" />',
			'</a>',
			'<div class="movie-content">',
				'<div class="col-md-12 nopadding">',
					'<div class="col-md-12 nopadding">',
						'<div class="col-md-7">',
							'<a href="' + imdb_url +'" target="_blank" class="list-group-item-heading"><span class="m_title">' + data.Title + '</span></a>',
						'</div>',
						'<div class="col-md-5 align-right">',
							'<p  class="small">',
								'<span class="m_air_date" style="display:none;">' + air_date + '</span>',
								'<span class="m_month"    style="display:none;">' + month    + '</span>' + month_text + ', ',
								'<span class="m_year"     style="display:none;">' + year     + '</span>' + year + " | ",
								'<span class="m_genres">' + genres_str + '</span> | <span> ' + data.Runtime + '</span>',
							'</p>',
						'</div>',
					'</div>',
					'<div class="col-md-12">',
						'<p class="list-group-item-text">',
							'<span class="m_description">' + data.Plot + '</span>',
						'</p>',
					'</div>',
					'<div class="col-md-4">',
						'<p class="list-group-item-text">',
							'<small>Director: <span class="m_director">' + data.Director + '</span></small>',
						'</p>',
					'</div>',
					'<div class="col-md-8 align-right">',
						'<p class="list-group-item-text">',
							'<small> Actors: <span class="m_stars">' + actors_str + '</span></small>',
						'</p>',
					'</div>',
					'<div class="col-md-12 text-center">',
						stars_html,
						imdb_html,
						rotten_tomates_html,
						metacritic_html,
						netflix_html,
					'</div>',	
				'</div>',
			'</div>',
		'</div>'
	]
	
	return html.join('');
}

function init_list() {
	var options = {
		valueNames: [ 'm_title','m_genres','m_month', 'm_year', 'm_imdb_rating', 'm_air_date', 'm_description', 'm_director', 'm_stars', 'm_netflix'],
		page: 25,
		plugins: [ ListPagination({'innerWindow': 1, 'outerWindow': 1}) ] 
	};

	featureList = new List('list-panel', options);
	
	filterList = function(gen,start,end,nf) {
		var g = gen||genre;
		var s = start||start_date;
		var e = end||end_date;
		var n = nf||netflix;
		
		featureList.filter(function(item) {
			var values = item.values()
			if (!g || g == "All" || values.m_genres.search(g) >= 0) {
				var air_date = parseInt(values.m_month-1) + parseInt(values.m_year)*12;
				if( air_date >= start_date && air_date <= end_date && (!n||values.m_netflix == 'netflix')) { 
					//console.log(air_date + " " + start_date + " " + end_date)
					return true;
				}
			}
			return false;
		});
	}
	
	featureList.on('updated', function() {
		console.log(featureList.matchingItems.length  + " " + featureList.items.length)
		$(window).trigger("scroll")	
	})
	$('#cover').fadeOut(2000);
}

function formatDate ( date ) {
	return 	months[date%12] + ", " +
			parseInt(date/12);
}

function dateVal(d) {
	return d.getMonth() + d.getFullYear()*12
}	
		
function init_date_slider() {
	start_date = dateVal(new Date(Date.parse('01/01/2011')));
	end_date   = dateVal(new Date());


	dateSlider = document.getElementById('date-slider');
	dateValues = [
		document.getElementById('event-start'),
		document.getElementById('event-end')
	];
	noUiSlider.create(dateSlider, {
		// Create two timestamps to define a range.
		range: {
			min: start_date,
			max: end_date
		},

		// Steps of one week
		step: 12,

		// Two more timestamps indicate the handle starting positions.
		start: [ dateVal(new Date('01/01/2015')), end_date],

		// Display a colored bar between the handles
		connect: true,

		// Move handle on tap, bar is draggable
		behaviour: 'tap-drag', 
	});

	dateSlider.noUiSlider.on('update', function( values, handle ) {
		var pre = ""
		if(handle == 0) pre = "From:"
		else pre = "To:"
		dateValues[handle].innerHTML = pre + "&nbsp;&nbsp;<span style='display:inline-block;'>" +formatDate(+values[handle]) +  "</span>";
	})

	dateSlider.noUiSlider.on('change', function( values, handle ) {
		start_date = +values[0];
		end_date   = +values[1];
		filterList(genre,start_date,end_date);
	});


	start_date = dateVal(new Date('01/01/2015'))

}