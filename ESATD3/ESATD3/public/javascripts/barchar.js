// Mike Bostock "margin conventions"
var margin = { top: 40, right: 10, bottom: 55, left: 60 },
    width = 300 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


var zoomBarras = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

function zoomed() {
    d3.select("#tablainfo").attr("transform", "translate(" + d3.event.translate + ")scale(1," + d3.event.scale + ")");
}

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxisB = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxisB = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, ".0");

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svgbar = d3.select("#tablainfo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoomBarras)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

svgbar.append("g")
    .attr("class", "y axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Satisfacción");

var tipba = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {       
        return "<div><strong>Nivel:</strong> <span style='color:red'>" + d.MEDICION + "</span></div><div><strong>Grade:</strong> <span style='color:forestgreen'>" + Math.round(d.PORCENTAJE*100)/100 + "</span></div>";
    });
svgbar.call(tipba);


// d3.tsv is a wrapper around XMLHTTPRequest, returns array of arrays (?) for a TSV file
// type function transforms strings to numbers, dates, etc.
updateBar("Universidad",1)
function updateBar(valor, nivel) {
    var consulta;
    if (nivel == 5)
        consulta = "programa";
    if (nivel == 4)
        consulta = "departamento";
    if (nivel == 3)
        consulta = "facultad";
    if (nivel == 2)
        consulta = "estudios";
    if (nivel == 1)
        consulta = "";
    if (valor == "")
        valor = "Otros";

    d3.json("/resumen?" + consulta + "=" + valor, function (error, data) {
        d3.select("#tituloTablaInfo").text(valor);
        replay(data);
       
    });
}

function type(d) {
    // + coerces to a Number from a String (or anything)
    d.frequency = +d.frequency;
    return d;
}

function replay(data) {
   draw(data)
}

function draw(data) {
    // measure the domain (for x, unique letters) (for y [0,maxFrequency])
    // now the scales are finished and usable
    x.domain(data.map(function (d) { return d.MEDICION; }));
    y.domain([0,5]);

    // another g element, this time to move the origin to the bottom of the svgbar element
    // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
    //   for everything in the selection\
    // the end result is g populated with text and lines!
    svgbar.select('.x.axis').transition().duration(100).call(xAxisB);

    // same for yAxis but with more transform and a title
    svgbar.select(".y.axis").transition().duration(100).call(yAxisB)

    // THIS IS THE ACTUAL WORK!
    var bars = svgbar.selectAll(".bar").data(data, function (d) { return d.MEDICION; })
        .on("mouseover", tipba.show)
        .on("mouseout", tipba.hide)     // (data) is an array/iterable thing, second argument is an ID generator function

    bars.exit()
        .transition()
        .duration(100)
        .attr("y", y(0))
        .attr("height", height - y(0))
        .style('fill-opacity', 0.5)
        .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", y(0))
        .attr("height", height - y(0));

    // the "UPDATE" set:
    bars.transition().duration(100).attr("x", function (d) { return x(d.MEDICION); }) // (d) is one item from the data array, x is the scale object from above
        .attr("width", x.rangeBand()) // constant, so no callback function(d) here
        .attr("y", function (d) { return y(d.PORCENTAJE); })
        .attr("height", function (d) { return height - y(d.PORCENTAJE); }); // flip the height, because y's domain is bottom up, but svgbar renders top down

}