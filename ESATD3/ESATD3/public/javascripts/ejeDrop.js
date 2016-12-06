    widthx = 100,
    height = 500;

var xe = d3.scale.ordinal()
    .rangeRoundBands(widthx, .1, 1);

var ye = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
 .scale(xe)
 .orient("left")
	;

var yAxis = d3.svg.axis()
    .scale(ye)
    .orient("bottom");
//#####################################################################
//TIP
//##################################################################### 
var tipe = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        destacarSerie(d);
        return "<div><strong>Estudios:</strong> <span style='color:#9AD1D4'>" + d.name + "</span></div><div><strong>Indice:</strong> <span style='color:#FFF7D1'>" + d.indice + "</span></div>";
    });
var container = "#ejecontainer";
var dropped = false;
var chart = d3.select(container).append("svg")
    .on('mouseover', function (d) {
        dropped = true;
    }).on("mouseout", function (d) {
        dropped = false;
    })
    .attr("width", widthx + "%")
    .attr("height", height).append("g");

chart.call(tipe);
function updateEje(data) {       
    ye.domain([0, d3.max(data, function (d,index) { return index+1; })]);

    chart.append("g")
        .attr("transform", "translate(0," + height + ")")  
    var barra = chart.selectAll(container +" .bar").data(data);
    barra.enter().append("rect").attr("class", "bar");	
  		barra.on("mouseover",tipe.show)
        .on("mouseout", tipe.hide)
        .style("fill", function (d) { return d.colorR; })
        .on('click', function (d) { borrar(d); })
        .attr("x", 0)
        .attr("y", function (d, index) { return ye(index + 1); })
        .attr("width", widthx + "%")
        .attr("height", function (d) { return 50; })
        .attr("border-style", "solid").enter().append("text")
        .attr("x", 5)
        .attr("y", function (d) { return ye(d.grade) + 30; })
        .attr('class', 'barText')
        .attr("text-anchor", "start")
        .text(function (d) {
            return d.name;
        })
        .style("fill", "white"); //function (d) { return d.colorT; });

        chart.selectAll(container + " .barText").data(data).attr("y", function (d,index) {
            return ye(index+1) + 25;
        }).text(function (d) {
            return d.name;
        });
        chart.selectAll(container + " .barText").data(data).exit().remove();      
    barra.exit().remove();
};
var estudios = [];

function borrar(node) {
    estudios.forEach(function (d,index) {
        if (d.name == node.name && d.clasificacion == node.clasificacion) {
            delete estudios[index]; 
            eliminarNodo(new nodo("", node.nivel, node.facultad, node.departamento, node.programa),"");
            var estudiost = [];
            estudios.forEach(function (l) {
                estudiost.push(l);
            });
            estudios = estudiost;
           // eliminarNodo();  
           
            refrescar();
            if (estudios.length ==0) {
                estudios = [];                
                chart.selectAll(container + " .bar").remove();
                chart.selectAll(container + " .barText").remove();
                chart.selectAll(container + " g").remove();                           
                return;
            }
            updateEje(estudios);

            
        }
    });
}

function updateAxisDrop(node) {
    if (dropped) {
        var namenode = node.name;
        var encontro = false;
        estudios.forEach(function (d) {
            if (d.name == namenode && d.clasificacion == node.clasificacion) {
                encontro = true;
            }
        });
        if (!encontro) {
            var i = estudios.length + 1;

            
            var datos = [anhoSeleccionado, "", "", "",""];
            var tempo = node;
            while (tempo.level > 1)
            {
                datos[tempo.level - 1] = tempo.name;
                tempo = tempo.parent;
            }
            var cccc = colorTemas(Math.floor((Math.random() * 50) + 1));
            agregarNodo(datos[0], datos[1], datos[2], datos[3], datos[4],cccc);
            refrescar();
            estudios.push({
                "name": node.name, "indice": i, "clasificacion": node.clasificacion, "nivel": datos[1], "facultad": datos[2],
                "departamento": datos[3], "programa": datos[4], "colorR": cccc, "colorT": colorTemas(colorTemas.length - (parseInt(i) - 1))});            
            updateEje(estudios);
        }
        dropped = false;
    }


}