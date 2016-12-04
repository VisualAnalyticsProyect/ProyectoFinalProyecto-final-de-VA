// -------------- Control de los ejes paralelos
var preguntasJson;

// Se cargan las preguntas de la base de datos



var primeros;
d3.json("data/primeros.json", function (error, data) { primeros = data; });

var color = ["CC4444", "009933", "FF6600", "3333FF", "9999FF", "6666CC", "3333CC", "333399", "666699"];
var c10 = d3.scale.category10();
function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}


// Crea un nodo del arbol
function nodo(pMuestra, pNivel, pFacultad, pDepartamento, pPrograma) {
    this.muestra = pMuestra;
    this.nivel = pNivel;
    this.departamento = pDepartamento;
    this.programa = pPrograma;
}

//Los nodos que se están mostrando
var seriesNodos = [];

// Evaluar necesidad
function insertNewCoords(textito){
    //textito es la variable que recibe la respuesta SQL 
    //TODO revisar por que la respuesta no incluia tres preguntas (42,43 y 10);
    var textito= '[{"PROMEDIO":2.02,"CANTIDAD":45,"PREGUNTA":"10. ¿Qué tan satisfecho se encuentra usted en la Universidad de los Andes?"},{"PROMEDIO":3.02,"CANTIDAD":99,"PREGUNTA":"43. ¿Qué tan satisfecho se encuentra usted en la Universidad de los Andes?"},{"PROMEDIO":3.072,"CANTIDAD":89,"PREGUNTA":"42. ¿Qué tan satisfecho se encuentra usted en la Universidad de los Andes?"},{"PROMEDIO":3.0732,"CANTIDAD":99,"PREGUNTA":"1. ¿Qué tan satisfecho se encuentra usted en la Universidad de los Andes?"},{"PROMEDIO":2.7609,"CANTIDAD":109,"PREGUNTA":"11. La claridad y equidad de los métodos de calificación empleados en los cursos, y el respeto a las reglas de juego por parte del profesor"},{"PROMEDIO":2.9524,"CANTIDAD":102,"PREGUNTA":"12. El respeto que demuestran los profesores  con los estudiantes y su disposición para escucharlos"},{"PROMEDIO":2.7065,"CANTIDAD":109,"PREGUNTA":"13. El dominio que tienen los profesores de los temas que enseñan"},{"PROMEDIO":2.908,"CANTIDAD":104,"PREGUNTA":"14. La competencia académica de los monitores, asistentes graduados o sus equivalentes"},{"PROMEDIO":2.6966,"CANTIDAD":106,"PREGUNTA":"15. Las actividades de recreación (culturales y deportivas)"},{"PROMEDIO":2.5938,"CANTIDAD":113,"PREGUNTA":"16. La promoción que hace la Decanatura de Estudiantes de las actividades extracurriculares y de las actividades deportivas"},{"PROMEDIO":2.49,"CANTIDAD":117,"PREGUNTA":"17. El servicio orientado a procurar el bienestar emocional"},{"PROMEDIO":2.6559,"CANTIDAD":111,"PREGUNTA":"18. El servicio de salud"},{"PROMEDIO":2.6809,"CANTIDAD":112,"PREGUNTA":"19. El proceso de inducción para estudiantes de primer semestre"},{"PROMEDIO":2.602,"CANTIDAD":115,"PREGUNTA":"2. Las acciones que la Universidad de los Andes ha emprendido para ofrecer una docencia de alta calidad"},{"PROMEDIO":2.55,"CANTIDAD":118,"PREGUNTA":"20. La oferta actual de alternativas de apoyo financiero"},{"PROMEDIO":2.8506,"CANTIDAD":105,"PREGUNTA":"21. La facilidad del proceso de inscripción y retiro de materias"},{"PROMEDIO":2.7283,"CANTIDAD":109,"PREGUNTA":"22. La efectividad de los medios de comunicación institucionales, diferentes de la página web"},{"PROMEDIO":3.0921,"CANTIDAD":94,"PREGUNTA":"23. La efectividad de los medios de comunicación electrónicos como correo y página Web"},{"PROMEDIO":2.5408,"CANTIDAD":116,"PREGUNTA":"24. La calidad de la información disponible sobre opciones de apoyo financiero para el pago de la matrícula"},{"PROMEDIO":2.6452,"CANTIDAD":111,"PREGUNTA":"25. El servicio prestado por el personal administrativo de su Departamento o Facultad"},{"PROMEDIO":2.9595,"CANTIDAD":92,"PREGUNTA":"26. El control de ingreso al campus y la calidad de la atención en las porterías"},{"PROMEDIO":2.6196,"CANTIDAD":109,"PREGUNTA":"27. La calidad del servicio de alquiler de portátiles que le ofrece la Dirección de Tecnologías de Información"},{"PROMEDIO":2.7444,"CANTIDAD":108,"PREGUNTA":"28. La disponibilidad, la pertinencia y la actualidad del material bibliográfico"},{"PROMEDIO":2.6966,"CANTIDAD":107,"PREGUNTA":"29. La conveniencia de los horarios de atención ofrecidos por el sistema de bibliotecas"},{"PROMEDIO":2.6882,"CANTIDAD":110,"PREGUNTA":"3. La relación que guarda el valor de la matrícula con la calidad de la formación académica impartida por la Universidad"},{"PROMEDIO":2.8608,"CANTIDAD":97,"PREGUNTA":"30. La calidad de los servicios prestados por el sistema de bibliotecas"},{"PROMEDIO":2.7528,"CANTIDAD":106,"PREGUNTA":"31. La dotación y funcionalidad de los espacios en las salas de cómputo públicas"},{"PROMEDIO":2.8409,"CANTIDAD":105,"PREGUNTA":"32. La dotación y funcionalidad de las áreas de estudio"},{"PROMEDIO":2.7159,"CANTIDAD":105,"PREGUNTA":"33. La dotación y funcionalidad de las aéreas deportivas"},{"PROMEDIO":2.9737,"CANTIDAD":94,"PREGUNTA":"34. Las condiciones generales de las áreas de circulación, jardines y zonas verdes"},{"PROMEDIO":2.881,"CANTIDAD":102,"PREGUNTA":"35. La dotación y funcionalidad de los salones de clase"},{"PROMEDIO":2.8235,"CANTIDAD":103,"PREGUNTA":"36. La dotación y funcionalidad de los laboratorios (estudios o talleres según su caso)"},{"PROMEDIO":2.734,"CANTIDAD":111,"PREGUNTA":"37. Los precios de los productos ofrecidos por las cafeterías y los restaurantes"},{"PROMEDIO":2.6452,"CANTIDAD":111,"PREGUNTA":"38. La oferta de libros, textos y artículos institucionales en la librería"},{"PROMEDIO":2.8395,"CANTIDAD":99,"PREGUNTA":"39. La sensación de seguridad dentro del campus"},{"PROMEDIO":2.6848,"CANTIDAD":110,"PREGUNTA":"4. La forma como la Universidad promueve la investigación como una actividad que contribuye al desarrollo del país y a la proyección internacional de sus profesores"},{"PROMEDIO":2.7907,"CANTIDAD":104,"PREGUNTA":"40. La calidad del servicio prestado en las cafeterías y los restaurantes"},{"PROMEDIO":2.4902,"CANTIDAD":119,"PREGUNTA":"41. El precio de los productos ofrecidos por la librería"},{"PROMEDIO":2.6702,"CANTIDAD":111,"PREGUNTA":"5. La forma como la Universidad promueve la excelencia académica en el marco de una formación crítica y ética"},{"PROMEDIO":2.5758,"CANTIDAD":117,"PREGUNTA":"6. Los canales de comunicación que la Universidad pone a disposición de los estudiantes para expresar sus opiniones, inquietudes e inconformidades"},{"PROMEDIO":2.7204,"CANTIDAD":110,"PREGUNTA":"7. La formación integral que promueve el programa en el cual está inscrito como primera opción (Es decir, el crecimiento personal del estudiante desarrollando todas sus características, condiciones y potencialidades)"},{"PROMEDIO":2.7692,"CANTIDAD":109,"PREGUNTA":"8. La formación interdisciplinaria que promueve ese mismo programa (Es decir, la combinación de varias disciplinas o áreas del conocimiento)"},{"PROMEDIO":2.6383,"CANTIDAD":112,"PREGUNTA":"9. La manera como se ha venido aplicando el Reglamento General de Estudiantes de pregrado de la Universidad al momento de regular los derechos y deberes de los estudiantes"}]';
    

    var ucoord = JSON.parse(textito);
    console.log(ucoord.length);

    var myjsonobject= new Object();
    myjsonobject.Nombre = 'New Entry'
    //Para cada pregunta responde con el promedio de la calificacion con el filtro realizado
    for (var s in ucoord)
    {
        var indicando = +s + +1;
        var nomb = "P"+indicando;
        myjsonobject[nomb] = ucoord[s].PROMEDIO;
        console.log(ucoord[s].PROMEDIO);
    }
    globaldata.push(myjsonobject);
    //console.log(globaldata);

    refreshGraph();
}

// Infromación de las series.
var globaldata;
d3.json("/paralelinfo", function (error, data) { globaldata = data; });

// Maneja el tamaño y margenes de los ejes paralelos
var margin = { top: 30, right: 10, bottom: 10, left: 10 },
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

// Crea el SVG que contiene todo y lo ubica
var svg = d3.select("#paralel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




function crearGrafico()
{
    x1.domain(dimensions = preguntasJson.map(function (d) { return d.No_pregunta }).filter(function (d) {
        return d && (y1[d] = d3.scale.linear()
            .domain(d3.extent(primeros, function (p) { return +p[d]; }))
            .range([height, 0]));
    }));

    //Se agregan los ejes
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x1(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function (d) { return { x: x1(d) }; })
            .on("dragstart", function (d) {
                dragging[d] = x1(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) { return position(a) - position(b); });
                x1.domain(dimensions);
                g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
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
            }));

    // Fondos que cambian de color para especificar el tema
    g.append("g")
        .attr("class", "axis")
        .style("fill",function (d, i) { return color[d.no_tema]; })
        .each(function (d) { d3.select(this).call(axis.scale(y1[d])); }).attr("dx", 10).style("text-anchor", "middle")

    // los rotulos
    g.selectAll(".axis")
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d + " "; });

    
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
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(globaldata)
        .enter().append("path")
        .attr("d", path);

    // Los colores
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(globaldata)
        .enter().append("path")
        .attr("d", path);

    // Add and store a brush for each axis.
    g.append("g")
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
function agregarNodo(muestra, nivel, facultad, departamento, programa)
{
    seriesNodos.push(nodo(muestra, nivel, facultad, departamento, programa));
}

//Eliminar un nodo
function eliminarNodo(eliminar)
{
    for (i = 0; i < seriesNodos.length; i++)
    {
        var nodoAc = seriesNodos[i];
        if (nodosIguales(nodoAc, eliminar))
            seriesNodos.splice(i, 1);
    }
}

//Funcion que compara y dice si dos nodos son iguales
function nodosIguales(nodo1, nodo2)
{
    return nodo1.muestra == nodo2.muestra && nodo1.nivel == nodo2.nivel && nodo1.facultad == nodo2.faculdad && nodo1.departamento == nodo2.departamento && nodo1.programa == nodo2.programa;
}

function referescar() {


    // Los fondos grises
    background = svg.select(".background")
        .selectAll("path")
        .data(globaldata);

    background.enter().append("path")
        .attr("d", path);

    background.exit().remove();

    // Los colores
    foreground = svg.select(".foreground")
        .selectAll("path")
        .data(globaldata);

    foreground.enter().append("path")
        .attr("d", path);

    foreground.exit().remove();

};

function position(d) {
    var v = dragging[d];
    return v == null ? x1(d) : v;
}

function transition(g) {
    return g.transition().duration(500);
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



d3.json("/tree", function (error, data) {
    preguntasJson = data;
    crearGrafico();
});