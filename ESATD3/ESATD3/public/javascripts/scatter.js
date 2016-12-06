//Los tips messages
var tipCirculosRTotal = d3.tip()
    .attr('class', 'd3-tipRTotal')
    .offset([0, 0])
    .html(function (d) {
        if (d != "nombre") {
            var objeto = d  ;
            return "<div><strong>Nivel:</strong> <span style='color:forestgreen'>" + objeto.NIVEL + "</span></div>" +
                   "<div><strong>Facultad:</strong> <span style='color:forestgreen'>" + objeto.FACULTAD + "</span></div>"  +
                (objeto.DEPARTAMENTO != "" ? "<div><strong>Departamento: </strong> <span style='color:forestgreen'>" + objeto.DEPARTAMENTO + "</span></div > " : "") +
                "<div><strong>Programa:</strong> <span style='color:forestgreen'>" + objeto.PROGRAMA + "</span></div>" + 
                "<div><strong>Satisfacción:</strong> <span style='color:forestgreen'>" +  objeto.PorcentajeStasifaccion.toFixed(1) + "%</span></div>";
        }
    });
vis.call(tipCirculosRTotal);


var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    widthScatter = 960 - margin.left - margin.right,
    heightScatter = 500 - margin.top - margin.bottom;
var xScalaScatter = d3.scale.ordinal()
    .rangePoints([0, widthScatter]);

var yScalaScatter = d3.scale.linear()
    .domain([0, 100])
    .range([heightScatter, 0]);



var color = d3.scale.category10();

var xAxisScatter = d3.svg.axis()
    .scale(xScalaScatter)
    .orient("bottom");

var yAxisScatter = d3.svg.axis()
    .scale(yScalaScatter)
    .orient("left");



var svg = d3.select("#scatter").append("svg")
    .attr("width", widthScatter + margin.left + margin.right)
    .attr("height", heightScatter + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//var ruta = "/paralelsi?anio=" + anhoSeleccionado  + "&estudios=" + nivel + "&facultad=" + facultad + "&departamento=" + departamento + "&programa=" + 

var inforTotal;
var preguntas;

 d3.json("/rtotal?anio=2015", function(error, data) {
    //d3.request("http://localhost:1337/rtotal?anio=2015", function(error, data){

    if (error)
        alert(error);
    inforTotal = data;


   d3.json("/tree", function(error2, data2){
    //d3.json("http://localhost:1337/rtotal?anio=2015&estudios=Pregrado&programa=Ingeniería%20Civil", function (error, data) {
        preguntas = data2;
        xScalaScatter.domain(preguntas.map(function (d) { return d.No_pregunta; }).filter(function (d) { return d != 0 }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightScatter + ")")
            .call(xAxisScatter)
            .append("text")
            .attr("class", "label")
            .attr("x", widthScatter)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Pregunta (m)");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisScatter)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("% satisfacción")

        svg.selectAll(".dotScat")
            .data(inforTotal)
            .enter().append("circle")
            .attr("class", "dotScat")   
            .attr("r", 5 )
            .attr("cx", function (d) { return xScalaScatter(d.No_pregunta); })
            .attr("cy", function (d) { return yScalaScatter(d.PorcentajeStasifaccion); })
            .style("fill", "black")//function(d) { return color(d.species); });
            .on("mouseover", tipCirculosRTotal.show)
            .on("mouseout", tipCirculosRTotal.hide);
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

