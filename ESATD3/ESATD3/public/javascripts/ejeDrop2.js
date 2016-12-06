widthxE2 = 100,
    heightY2 = 150;

var xe2 = d3.scale.ordinal()
    .rangeRoundBands(widthxE2, .1, 1);

var ye2 = d3.scale.linear()
    .range([heightY2, 0]);

var xAxise2 = d3.svg.axis()
    .scale(xe2)
    .orient("left")
    ;

var yAxise2 = d3.svg.axis()
    .scale(ye2)
    .orient("bottom");
//#####################################################################
//TIP
//##################################################################### 
var tipe = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<div><strong>Estudios:</strong> <span style='color:#9AD1D4'>" + d.name + "</span></div><div><strong>Indice:</strong> <span style='color:#FFF7D1'>" + d.indice + "</span></div>";
    });
var containerE2 = "#ejecontainer2";
var droppede2 = false;
var charte2 = d3.select(containerE2)
        .on('mouseover', function (d) {
        droppede2 = true;
    }).on("mouseout", function (d) {
        droppede2 = false;
    })
    .append("svg")
    .attr("width", widthxE2 + "%")
    .attr("height", heightY2).append("g");

charte2.call(tipe);
function updateEje2(data) {
    ye2.domain([0, d3.max(data, function (d, index) { return index + 1; })]);

    charte2.append("g")
        .attr("transform", "translate(0," + heightY2 + ")")
    var barrae3 = charte2.selectAll(containerE2 + " .bar").data(data);
    barrae3.text(function (d) {
        return d.name;
    });

    barrae3.enter().append("rect").attr("class", "bar");
  		barrae3.on("mouseover", tipe.show)
        .on("mouseout", tipe.hide)
        .style("fill", function (d) { return d.colorR; })
        .on('click', function (d) { borrar2(d); })
        .attr("x", 0)
        .attr("y", function (d, index) { return ye2(index + 1); })
        .attr("width", widthxE2 + "%")
        .attr("height", function (d) { return 50; })
        .attr("border-style", "solid").enter().append("text")
        .attr("x", 5)
        .attr("y", function (d) { return ye2(d.grade) + 30; })
        .attr('class', 'barText')
        .attr("text-anchor", "start")
        .text(function (d) {
            return d.name;
        })
        .style("fill", "white"); //function (d) { return d.colorT; });

    charte2.selectAll(containerE2 + " .barText").data(data).attr("y", function (d, index) {
        return ye2(index + 1) + 25;
    }).text(function (d) {
        return d.name;
    });
    charte2.selectAll(containerE2 + " .barText").data(data).exit().remove();
    barrae3.exit().remove();
};
var estudioe2 = [];

function borrar2(node) {

    if (estudioe2.length > 0)
    {
        estudioe2 = [];
        updateEje2(estudioe2);
        charte2.selectAll(containerE2 + " .bar").remove();
        charte2.selectAll(containerE2 + " .barText").remove();
        charte2.selectAll(containerE2 + " g").remove();
        eliminarNodoDetalle();
    }
 }

function updateAxisDrop2(node) {
    if (droppede2) {
        var namenode = node.name;
        var encontro = false;
        if (estudioe2.length != 0)
        {
            borrar2(estudioe2[0]);
        }
        var datos = [anhoSeleccionado, "", "", "", ""];
        var tempo = node;
        while (tempo.level > 1) {
                datos[tempo.level - 1] = tempo.name;
                tempo = tempo.parent;
        }
         agregarNodoDetalle(datos[0], datos[1], datos[2], datos[3], datos[4], colorTemas(1));
         actualizarDetalles();
            estudioe2.push({
                "name": node.name, "indice": 1, "clasificacion": node.clasificacion, "nivel": datos[1], "facultad": datos[2],
                "departamento": datos[3], "programa": datos[4], "colorR": colorTemas(0), "colorT": colorTemas(0)
            });
            updateEje2(estudioe2);
        
        droppede2 = false;
    }


}