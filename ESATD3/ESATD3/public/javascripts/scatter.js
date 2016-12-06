//Los tips messages
var tipCirculosRTotal = d3.tip()
    .attr('class', 'd3-tipEje')
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

var dotsScatterVisibles = true;

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



var svgScatter = d3.select("#scatter").append("svg")
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

        svgScatter.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightScatter + ")")
            .call(xAxisScatter)
            .append("text")
            .attr("class", "label")
            .attr("x", widthScatter)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Pregunta (m)");
        svgScatter.append("g")
            .attr("class", "y axis")
            .call(yAxisScatter)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("% satisfacción")

        svgDots = svgScatter.selectAll(".dotScatCotainers")
            .data(inforTotal)
            .enter().append("circle")
            .attr("class", "dotScat")   
            .attr("r", 8 )
            .attr("cx", function (d) { return xScalaScatter(d.No_pregunta); })
            .attr("cy", function (d) { return yScalaScatter(d.PorcentajeStasifaccion); })
            .style("fill", "black")//function(d) { return color(d.species); });
            .on("mouseover", tipCirculosRTotal.show)
            .on("mouseout", tipCirculosRTotal.hide)
            .on("click", function (d) {
                svgScatter.selectAll(".dotScat")
                    .style("opacity", function (p) {
                        dotsScatterVisibles = !dotsScatterVisibles;
                        if (!dotsScatterVisibles)
                            if (d.NIVEL == p.NIVEL && d.FACULTAD == p.FACULTAD && d.DEPARTAMENTO == p.DEPARTAMENTO && d.PROGRAMA == p.PROGRAMA)
                                return 1;
                            else
                                return 0;
                        else
                            return 1;
                        
                    });
            }
        )
            ;
    });

});

 function refrescarDispersion()
 {
     d3.select("#scatter h1").text("Gráfica de Dispersión");
     d3.json("/rtotal?anio=" + anhoSeleccionado, function (error, data)
     {
         inforTotal = data;
         dots = svgScatter.selectAll(".dotScat")
             .data(inforTotal);

         dots.attr("cx", function (d) { return xScalaScatter(d.No_pregunta); })
             .attr("cy", function (d) { return yScalaScatter(d.PorcentajeStasifaccion); })


         dots.enter().append("circle")
             .attr("class", "dotScat")
             .attr("r", 5)
             .attr("cx", function (d) { return xScalaScatter(d.No_pregunta); })
             .attr("cy", function (d) { return yScalaScatter(d.PorcentajeStasifaccion); })
             .style("fill", "black")//function(d) { return color(d.species); });
             .on("mouseover", tipCirculosRTotal.show)
             .on("mouseout", tipCirculosRTotal.hide);

         dots.exit().remove();  

   
     });
 }

