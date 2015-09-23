function init() {
	// Initialize Variables
	featureList = null;
	filterList  = null;
	genre = null;

	// Create a list of day and monthnames.
	months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	genres = ["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Musical","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western"]


	start_date = dateVal(new Date(Date.parse('01/01/2011')));
	end_date   = dateVal(new Date());


	dateSlider = document.getElementById('date-slider');
	dateValues = [
		document.getElementById('event-start'),
		document.getElementById('event-end')
	];
}


// Create a string representation of the date.
function formatDate ( date ) {
	return 	months[date%12] + " " +
			parseInt(date/12);
}

function dateVal(d) {
	return (d.getMonth()+1) + d.getFullYear()*12
}




function init_list() {
	genres.forEach(function(g) {
		$('.filter').append('<li class="btn">' + g + '</li>')
	})

	var options = {
		valueNames: [ 'name', 'description', 'metascore', 'genres', 'director', 'stars', 'month', 'year', 'air_date'],
		page: 20,
		plugins: [ ListPagination({'innerWindow': 1, 'outerWindow': 1}) ] 
	};

	featureList = new List('lovely-things-list', options);
	
	filterList = function(gen,start,end) {
		var g = gen||genre;
		var s = start||start_date;
		var e = end||end_date;
		featureList.filter(function(item) {
			var values = item.values()
			if (!g || g == "All" || values.genres.search(g) >= 0) {
				var air_date = parseInt(values.month) + parseInt(values.year)*12;
				if( air_date >= start_date && air_date <= end_date) { 
					//console.log(air_date + " " + start_date + " " + end_date)
					return true;
				}
			}
			return false;
		});
	}
	

	$('.filter li.btn').click(function() {
		genre = $(this).text();
		$(".filter li").removeClass("highlight");
		$(this).addClass("highlight");
		filterList(genre)
		return false;
	})
	
	

	// Slider
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
	
	
	start_date = dateVal(new Date('01/01/2014'))
	filterList('All',start_date,end_date);
	featureList.sort('metascore', { order: "desc" });
}

