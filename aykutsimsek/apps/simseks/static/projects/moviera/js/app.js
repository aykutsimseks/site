
var list_item_template = function(data) {
			String.prototype.parseHex = function(){
				return this.replace(/\\x([a-fA-F0-9]{2})/g, function(a,b){
					return String.fromCharCode(parseInt(b,16));
				});
			};
		
			var parse_str_as_array = function(str) {
				if(!str) return []
				var array_match = /['"]([^'"]*)['"]/gi;
				var match = str.match(array_match);
				if(match) {
					return match.map(function(str) { return str.slice(1, -1).parseHex()})
				}
				return []
			}
		
			var html = "\
				<div class='list-group-item' style='cursor:default;float:none'>	\
					<div class='col-md-10'> \
						<a href='" + data.url + "' target='_blank'>\
						<figure class='pull-left' style='padding:0 10px 0 0px;margin-left:-15px;'>	\
							<img class='media-object img-responsive' width=80 height=100 src='/static/projects/moviera/img/movie-placeholder.png' data-src='/static/projects/moviera/img/thumbnails/" + data.unique_id + ".png'  alt='" + data.title +"' >\
						</figure>	\
						</a>\
						<div style='padding-left:80px;width:calc(100%-80px);'> \
							<h4 class='list-group-item-heading col-md-12'  style='padding-left:0;'><a href='" + data.url + "' target='_blank' class='list-group-item-heading'><span class='m_title'>" + data.title + "</span></a>\
								<div  class='small pull-right' style='vertical-align:5px;'> \
									<span class='m_genres'>" +parse_str_as_array(data.genres).join(', ') + "</span> | <span style=''> " + data.run_time + " min</span>\
								</div> \
							</h4> \
							<div class='list-group-item-text col-md-12' style='padding:10px 0px'> \
								<span class='m_description'>" + data.description + "</span>\
							</div> \
							<div class='col-md-4' style='padding:0'> \
								<p class='list-group-item-text'> \
									<small>Director: <span class='m_director'>" + data.director + "</span></small> \
								</p> \
							</div> \
							<div class='col-md-8' style='padding:0'> \
								<p class='list-group-item-text'> \
									<small> Stars: <span class='m_stars'>" + parse_str_as_array(data.stars).join(', ') + "</span></small> \
								</p> \
							</div> \
						</div> \
					</div> \
					<div class='col-md-2 text-center record-card'> \
						<!-- <h2> 14240 <small> votes </small></h2> --> \
						<!-- <button type='button' class='btn btn-primary btn-lg btn-block'> Vote Now! </button> --> \
						<div><span class='m_air_date' style='display:none;'>" + (parseInt(data.year||0)*1200 + parseInt(data.month||0)*100 + parseInt(data.metascore||0)) + "</span><span class='m_month' style='display:none;'>" + (data.month||0) + "</span>" + months[data.month-1] + ", <span class='m_year' style='display:none;'>" + (data.year||0) + "</span>" + data.year +"</div> \
						<div class='stars'> \
					"
					var stars = Math.round((data.metascore||0)/10)
					
					for( var i=1; i <= 10; ) {
						var diff = stars-i;
						if(diff > 0) {
							if(diff > 1) {
								html += " <i class='fa fa-star'></i>"
							} 
							else {
								html += " <i class='fa fa-star-half-o'></i>"
							}
						} 
						else {
							html += " <i class='fa fa-star-o'></i>"
						}
						i += 2;
					}
					
					html += "\
						</div> \
						<div><span class='m_metascore' style='display:none'>" + (parseInt(data.metascore||0)*30000 + parseInt(data.year||0)*12 + parseInt(data.month||0)) +"</span>" + data.metascore +" <small> / </small> 100 </div> \
						" + ((data.netflix_url != "")?"<span class='m_netflix' style='display:none'>netflix</span><a title='Available on Netflix' href='" + data.netflix_url + "'><img height=20 class='netflix-icon' src='/static/projects/moviera/img/netflix_red.png'></img></a>":"") + "\
					</div> \
				</div>\
				"
			return html;
		}

function init_list() {
	genres.forEach(function(g) {
		//$('.filter').append('<li class="btn">' + g + '</li>')
		$(".custom-dropdown select").append(
			"<option value='" + g + "'>" + g + "</option>"
		)
	})

	var options = {
		valueNames: [ 'm_title','m_genres','m_month', 'm_year', 'm_metascore', 'm_air_date', 'm_description', 'm_director', 'm_stars', 'm_netflix'],
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
}



function dynamicSort(property) { 
    return function (obj1,obj2) {
        return obj1[property] > obj2[property] ? 1
            : obj1[property] < obj2[property] ? -1 : 0;
    }
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function formatDate ( date ) {
	return 	months[date%12] + ", " +
			parseInt(date/12);
}

function dateVal(d) {
	return d.getMonth() + d.getFullYear()*12
}	
		
var init_date_slider = function() {
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