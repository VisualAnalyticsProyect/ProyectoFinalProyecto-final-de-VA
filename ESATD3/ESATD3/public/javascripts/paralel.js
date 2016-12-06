// -------------- Control de los ejes paralelos
var preguntasJson;
var gParalel;

//Los tips messages
var tipPreguntas = d3.tip()
    .attr('class', 'd3-tipEje')
    .offset([0, 0])
    .html(function (d) {
        if (d != "nombre") {
            var objeto = preguntasJson[d - 1];
            return "<div><strong>Tema:</strong> <span style='color:forestgreen'>" + objeto.TEMA + "</span></div>" +
                (objeto.SUBTEMA != "" ? "<div><strong>Subtema: </strong> <span style='color:forestgreen'>" + objeto.SUBTEMA + "</span></div > " : "") +
                "<div><strong>Pregunta:</strong> <span style='color:forestgreen'>" + objeto.PREGUNTA + "</span></div>";
        }
    });
vis.call(tipPreguntas);

var tipSeries = d3.tip()
    .attr('class', 'd3-tipSerie')
        .offset([0, 0])
        .html(function (d) {
            if (d != "nombre") {
                var objeto = preguntasJson[d - 1];
                return "<div><strong>Programa:</strong> <span style='color:forestgreen'>" + objeto.nombre + "</span></div>";
            }});
vis.call(tipPreguntas);


// Agregalos máximos y los mínimos 0-100 para crear los ejes
var primeros;


//var colorTemas = ["#003249","80CED7", "#9AD1D4", "#007EA7", "#FFF7D1"];
var colorTemas = d3.scale.category20b();
/*var colorTemas = d3.scale.linear()
    .domain([0,15])
    .range(["red", "green"])
    .interpolate(d3.interpolateLab);*/
var color = d3.scale.category20c();
var c10 = d3.scale.category10();
function colores_google(n) {
    var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colores_g[n % colores_g.length];
}


// Crea un nodo del arbol
function nodo(pMuestra, pNivel, pFacultad, pDepartamento, pPrograma, pColorS) {
    this.muestra = pMuestra;
    this.nivel = pNivel;
    this.facultad = pFacultad;
    this.departamento = pDepartamento;
    this.programa = pPrograma;
    this.colorS = pColorS;
}

//Los nodos que se están mostrando
var seriesNodos = [];

var gBackground;
var gForground;

// Infromación de las series.
var globaldata = [];


// Maneja el tamaño y margenes de los ejes paralelos
var margin = { top: 30, right: 20, bottom: 10, left: 100 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Maneja las escalas
var x1 = d3.scale.ordinal().rangePoints([0, width], 1),
    y1 = {},
    dragging = {};


var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

// Crea el svgParalel que contiene todo y lo ubica
var svgParalel = d3.select("#paralel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .on("click", function () {
        svgParalel.attr("width", "50");
        
    });







function crearGrafico()
{
    x1.domain(dimensions = preguntasJson.map(function (d) {
        if (d.No_pregunta != 0)
            return d.No_pregunta;
        else
            return "nombre";
    }).filter(function (d) {

        if (d === "nombre")
        {   
            (y1[d] = d3.scale.ordinal()
                .domain([" ","  "])
                .rangeRoundPoints([height, 0]));
        }
        else {
            (y1[d] = d3.scale.linear()
                .domain(d3.extent(primeros, function (p) { return +p[d]; }))
                .range([height, 0]));
        }
    
        return true;
    }));

    /*
    x1.domain(dimensions = preguntasJson.map(function (d) { return d.No_pregunta; }).filter(function (d) {
    return d && (y1[d] = d3.scale.linear()
        .domain(d3.extent(primeros, function (p) { return +p[d]; }))
        .range([height, 0]));
    }));

    */
    //Se agregan los ejes
    gParalel = svgParalel.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x1(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function (d) { return { x: x1(d) }; })
            .on("dragstart", function (d) {
                dragging[d] = x1(d)
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) { return position(a) - position(b); });
                x1.domain(dimensions);
                gParalel.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x1(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }))
        .on("mouseover", tipPreguntas.show)
        .on("mouseout", tipPreguntas.hide);

    

    // Fondos que cambian de color para especificar el tema
    gParalel.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y1[d])); }).attr("dx", 10).style("text-anchor", "middle");

    gParalel.selectAll(".axis")
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d + " "; });



    gParalel.selectAll(".axis")
        .append("rect")
        .attr("x", function (d) { return -10 })
        .attr("y", function (d) { 0 })
        .attr("width", 20)
        .attr("height", height)
        .style("fill", function (d, i) {
            if(d != "nombre")
                if (preguntasJson[d-1].no_tema == 2)
                    return "rgb(204, 255, 204)";
                else if (preguntasJson[d-1].no_tema == 1)
                    return "rgb(204, 255, 255)";
                else if (preguntasJson[d-1].no_tema == 3   )
                    return "rgb(204, 204, 255)";
                else
                    return "rgb(255, 204, 204)";
            else
                return "rgb(255, 255, 255)";
        })
        /*.style("backgorund-color", function (d, i) {
            numero = parseInt(preguntasJson[i].TEMA.substring(0, 1)) - 1;
            return colorTemas[numero];
        });*/
        .style("opacity", 0.3)
        

    /**NO SE PARA QUE ES ESTO, introducido por juan
    
        d3.selectAll(".axis").append("rect")
            .attr("x", function (d) { return -10 })
            .attr("y", function (d) { 0 })
            .attr("width", 20)
            .attr("height", height)
            .style("opacity", 0.5);
        ;
    
        d3.selectAll(".axis")
            .append("rect")
            .attr("x", function (d) { return -10 })
            .attr("y", function (d) { 0 })
            .attr("width", 20)
            .attr("height", height)
            .style("fill", function (d) {
                return d.style;
            })
            .style("opacity", 0.5);
    
    
        */

    // Los fondos grises
    gBackground = svgParalel.append("g").attr("class", "background"); 

    background = gBackground.selectAll("path")
        .data(globaldata)
        .enter().append("path")
        .attr("d", path);

    gForground = svgParalel.append("g")
        .attr("class", "foreground");

    // Los colores
    foreground = gForground
        .selectAll("path")
        .data(globaldata)
        .enter().append("path")
        .attr("d", path)
        .on("mouseover", tipSeries.show)
        .on("mouseout", tipSeries.hide);;

    // Add and store a brush for each axis.
    gParalel.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(y1[d].brush = d3.svg.brush().y(y1[d]).on("brushstart", brushstart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    // add style linepath
    d3.selectAll(".foreground path").style("stroke", function (d, i) {
        return "black";
        //return "hsl(" + (((170 - d.P1) * 90) / 170) + ",80%,60%)";
    }).style("stroke-width", function (d, i) {
        //return (1 - (d.P1 / 170) * 5) ;
        return 1;
    }).style("opacity", function (d, i) {
        return 1 - ((d.P1) / 300);

    });

}

//Agrega un nuevo nodo a las series
function agregarNodo(muestra, nivel, facultad, departamento, programa, colorS) {
    nuevo = new nodo(muestra, nivel, facultad, departamento, programa, colorS);
    seriesNodos.push(nuevo);
}

//Eliminar un nodo
function eliminarNodo(eliminar) {
    for (i = 0; i < seriesNodos.length; i++) {
        var nodoAc = seriesNodos[i];
        if (nodosIguales(nodoAc, eliminar))
            seriesNodos.splice(i, 1);
    }
}


function destacarSerie(d)
{

     gBackground
        .selectAll("path")
         .style("stroke", function (l) {
             if (l.programa = d.programa && (l.facultad == d.facultad || l.departamento == d.departamento || l.programa == d.programa))
                 return 3;
             else
                 return 1;
         });


}


//Funcion que compara y dice si dos nodos son iguales
function nodosIguales(nodo1, nodo2) {
    return  nodo1.nivel == nodo2.nivel && (nodo1.facultad == nodo2.facultad || nodo1.departamento == nodo2.departamento || nodo1.programa == nodo2.programa);
}

function refrescar()
{
    globaldata = [];

    for (index = 0; index < seriesNodos.length; index++)
    {
        nn = seriesNodos[index];
        consultar(nn.muestra, nn.nivel, nn.facultad, nn.departamento, nn.programa, index == seriesNodos.length-1, nn.colorS);
    }
    

    if (index == 0)
        refrescarSeries();
};

function refrescarSeries()
{

    var escala = [" "];
    for (index = 0; index < globaldata.length; index++) {
        escala.push(globaldata[index].nombre);
    }
    escala.push("  ");
    y1["nombre"] = d3.scale.ordinal()
        .domain(escala)
        .rangeRoundPoints([height, 0]);
    gParalel.select(".axis")
        .each(function (d) { d3.select(this).call(axis.scale(y1[d])); }).attr("dx", 10).style("text-anchor", "middle");

    gParalel.select(".brush")
        .each(function (d) {
            d3.select(this).call(y1[d].brush = d3.svg.brush().y(y1[d]).on("brushstart", brushstart).on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);


    // Los fondos grises
    background = gBackground
        .selectAll("path")
        .data(globaldata)
        .attr("d", path)
        

    background.enter().append("path")
        .attr("d", path);
        

    background.exit().remove();

    // Los colores
    foreground = gForground
        .selectAll("path")
        .data(globaldata)
        .attr("d", path);

    foreground.enter().append("path")
        .attr("d", path)
        .style("stroke", function (d) { return d.color });

    foreground.exit().remove();
}


function position(d) {
    var v = dragging[d];
    return v == null ? x1(d) : v;
}

function transition(gParalell) {
    return gParalell.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function (p) { return [position(p), y1[p](d[p])]; }));
}

function brushstart() {
    d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = dimensions.filter(function (p) { return !y1[p].brush.empty(); }),
        extents = actives.map(function (p) { return y1[p].brush.extent(); });
    foreground.style("display", function (d) {
        return actives.every(function (p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}

function consultar(muestra, nivel, facultad, departamento, programa, refrescarS, colorSerie) {
    var respuesta;
    var ruta = "/paralelsi?anio=" + anhoSeleccionado  + "&estudios=" + nivel + "&facultad=" + facultad + "&departamento=" + departamento + "&programa=" + programa;
    ruta = ruta.replace(/ /g, "%20");
    var rJson = "";
    //ruta = URLEncoder.encode(ruta, "UTF-8");
    d3.json(ruta, function (error, data)
    {
        if (error)
            alert(error);
        else {
            rJson = "{"
            respuesta = data;
            rJson += " \"nombre\": \"" + nivel + "." + "." + facultad + "." + departamento + "." + programa + "\", ";
            rJson += " \"color\": \"" + colorSerie+ "\", ";
            for (i = 0; i < respuesta.length; i++) {
                rJson += "\"" + respuesta[i].No_pregunta + "\": " + respuesta[i].PorcentajeStasifaccion;
                if (i != respuesta.length - 1)
                    rJson += ", ";
            }
            rJson += "}";
            globaldata.push(JSON.parse(rJson    ));
            //if (refrescarS)
            refrescarSeries();
        }
    });
    
    
    
}



d3.json("/tree", function (error, data)
{
    preguntasJson = data;
    d3.json("data/primeros.json", function (error, data2)
    {
        primeros = data2;
        crearGrafico();
    });
});

//agregarNodo("2015", "", "", "", "");
//agregarNodo("2014", "", "Facultad de Ingeniería", "", "");