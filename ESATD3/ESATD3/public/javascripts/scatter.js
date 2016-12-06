var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.scale.ordinal()
    .rangePoints([0, width]);

var y = d3.scale.linear()
    .domain([0, 100])
    .range([0, height]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//var ruta = "/paralelsi?anio=" + anhoSeleccionado  + "&estudios=" + nivel + "&facultad=" + facultad + "&departamento=" + departamento + "&programa=" + 

var inforTotal;
var preguntas;

 d3.json("/rtotal?anio=2015", function(error, data) {
    //d3.request("http://localhost:1337/rtotal?anio=2015)", function(error, data){

    if (error)
        alert(error);
    inforTotal = data;


   d3.json("/tree", function(error2, data2){
    //d3.json("http://localhost:1337/rtotal?anio=2015&estudios=Pregrado&programa=Ingeniería%20Civil", function (error, data) {
        preguntas = data2;
        x.domain(preguntas.map(function (d) { return d.No_pregunta; }).filter(function (d) { return d != 0 }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Pregunta (m)");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("% satisfacción")

        svg.selectAll(".dot")
            .data(inforTotal)
            .enter().append("circle")
            .attr("class", "dot")   
            .attr("r", 10 )
            .attr("cx", function (d) { return x(d.No_pregunta); })
            .attr("cy", function (d) { return y(d.PorcentajeStasifaccion); })
            .style("fill", "blue");//function(d) { return color(d.species); });
    });

    //y.domain(d3.extent(data, function(d) { return d.Length; })).nice();



	/**var legend = svg.selectAll(".legend")
	.data(color.domain())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);
	legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });*/

});

