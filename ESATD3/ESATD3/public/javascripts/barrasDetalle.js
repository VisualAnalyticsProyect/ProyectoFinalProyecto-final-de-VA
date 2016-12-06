var nodoActualDetalles;

function agregarNodoDetalle(muestra, nivel, facultad, departamento, programa, colorS)
{
    nuevo = new nodo(muestra, nivel, facultad, departamento, programa, colorS);
    nodoActualDetalles =  nuevo;
}

//Eliminar un nodo
function eliminarNodoDetalle() {
    delete nodoActualDetalles;
}
// Mike Bostock "marginDetalles conventions"
var marginDetalles = { top: 40, right: 10, bottom: 55, left: 60 },
    widthDetalles = 1200 - marginDetalles.left - marginDetalles.right,
    heightDetalles = 550 - marginDetalles.top - marginDetalles.bottom;

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var xDetalles = d3.scale.ordinal()
    .rangeRoundBands([0, widthDetalles], .1);

var yDetalles = d3.scale.linear()
    .range([heightDetalles, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxisDetalles = d3.svg.axis()
    .scale(xDetalles)
    .orient("bottom");

var yAxisDetalles = d3.svg.axis()
    .scale(yDetalles)
    .orient("left")
    .ticks(10, ".0");

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svgBarDetalle = d3.select("#resumendet").append("svg")
    .attr("width", widthDetalles + marginDetalles.left + marginDetalles.right)
    .attr("height", heightDetalles + marginDetalles.top + marginDetalles.bottom)
    .append("g")
    .attr("transform", "translate(" + marginDetalles.left + "," + marginDetalles.top + ")");

svgBarDetalle.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightDetalles + ")")

svgBarDetalle.append("g")
    .attr("class", "y axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Satisfacción");

var tipbaDetalle = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<div><strong>Tema:</strong> <span style='color:red'>" + d.TEMA + "</span></div><div><strong>Pregunta:</strong> <span style='color:red'>" + d.PREGUNTA + "</span></div><div><strong>Valor:</strong> <span style='color:forestgreen'>" + d.PorcentajeStasifaccion + "</span></div>";
    });
svgBarDetalle.call(tipbaDetalle);


// d3.tsv is a wrapper around XMLHTTPRequest, returns array of arrays (?) for a TSV file
// type function transforms strings to numbers, dates, etc.
//updateBar("Universidad", 1)
var preguntasTodas;
var primerosDetalles;
d3.json("/tree", function (error, data)
{

    preguntasTodas = data;


    d3.json("/paralelsi?anio=2015", function (error, data2) {
        primerosDetalles = data2;
        crearGraficoDetalles();
    });
});

function crearGraficoDetalles()
{
    preguntasTodas = preguntasTodas.filter(function (d) { return d.No_pregunta != 0 });
    xDetalles.domain(preguntasTodas.map(function (d) { return d.No_pregunta; }));
    yDetalles.domain([0, 100]);
    svgBarDetalle.select('.x.axis').transition().duration(100).call(xAxisDetalles);
    svgBarDetalle.select(".y.axis").transition().duration(100).call(yAxisDetalles)

    var bars = svgBarDetalle.selectAll(".bar").data(primerosDetalles, function (d) { return d.No_pregunta; })
        .on("mouseover", tipbaDetalle.show)
        .on("mouseout", tipbaDetalle.hide);
        
            // (data) is an array/iterable thing, second argument is an ID generator function


    bars.exit()
        .transition()
        .duration(100)
        .attr("y", yDetalles(0))
        .attr("height", heightDetalles - yDetalles(0))
        .style('fill-opacity', 0.5)
        .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("y", yDetalles(0))
        .attr("height", heightDetalles - yDetalles(0))
        .append("text")
        .attr("y", heightDetalles - yDetalles(0))
        .text(function (d) { d.PorcentajeStasifaccion + "%" });

    // the "UPDATE" set:
    bars.transition().duration(100).attr("x", function (d) { return xDetalles(d.No_pregunta); }) // (d) is one item from the data array, x is the scale object from above
        .attr("width", xDetalles.rangeBand()) // constant, so no callback function(d) here
        .attr("y", function (d) { return yDetalles(d.PorcentajeStasifaccion); })
        .attr("height", function (d) { return heightDetalles - yDetalles(d.PorcentajeStasifaccion); });
         // flip the height, because y's domain is bottom up, but svgBarDetalle renders top down
}


function actualizarDetalles()
{

    
    muestra = anhoSeleccionado;
    nivel = nodoActualDetalles.nivel;
    facultad = nodoActualDetalles.facultad;
    departamento = nodoActualDetalles.departamento;
    programa = nodoActualDetalles.programa;
    var respuesta;
    var ruta = "/paralelsi?anio=" + anhoSeleccionado + "&estudios=" + nivel + "&facultad=" + facultad + "&departamento=" + departamento + "&programa=" + programa;
    ruta = ruta.replace(/ /g, "%20");
    var rJson = "";
    //ruta = URLEncoder.encode(ruta, "UTF-8");
    d3.json(ruta, function (error, data) {
        if (error)
            alert(error);
        else {
            primerosDetalles = data;
            crearGraficoDetalles();
        }
    });



}

