$(function(){ 
/*
var width = 100;
var height = 25;
var x = d3.scale.linear().range([0, width - 2]);
var y = d3.scale.linear().range([height - 4, 0]);
var parseDate = d3.time.format("%b %d, %Y").parse;
var line = d3.svg.line()
             .interpolate("basis")
             .x(function(d) { return x(d.date); })
             .y(function(d) { return y(d.close); });

function sparkline(elemId, stockdata) {
  stockdata.forEach(function(d) {
    d.date = parseDate(d.Date);
    d.close = +d.Close;
  });
  x.domain(d3.extent(stockdata, function(d) { return d.date; }));
  y.domain(d3.extent(stockdata, function(d) { return d.close; }));

  var svg = d3.select(elemId)
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(0, 2)');
  svg.append('path')
     .datum(stockdata)
     .attr('class', 'sparkline')
     .attr('d', line);
  /*
  svg.append('circle')
     .attr('class', 'sparkcircle')
     .attr('cx', x(stockdata[0].date))
     .attr('cy', y(stockdata[0].close))
     .attr('r', 1.5);
  
}
	d3.csv('http://www.tnoda.com/csv/goog.csv', function(error, stockdata) {
  		sparkline('body', stockdata);
	});
*/
});