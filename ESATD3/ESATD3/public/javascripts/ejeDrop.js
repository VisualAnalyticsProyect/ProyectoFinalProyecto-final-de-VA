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
        return "<div><strong>Estudios:</strong> <span style='color:red'>" + d.name + "</span></div><div><strong>Nivel:</strong> <span style='color:forestgreen'>" + d.grade + "</span></div>";
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
  		barra.on("mouseover", tipe.show)
        .on("mouseout", tipe.hide)
        .style("fill", function (d) {           
            return colorTemas[parseInt(d.grade)-1];            
        }).on('click', function (d) { borrar(d); })
        .attr("x",0)
        .attr("y", function (d,index) { return ye(index+1); })
        .attr("width", widthx + "%")
        .attr("height", function (d) { return 50; })
        .attr("border-style", "solid").enter().append("text")
        .attr("x", 5)
        .attr("y", function (d) {return ye(d.grade) + 30;})
        .attr('class', 'barText')       
        .attr("text-anchor","start")
        .text(function (d) {
            return d.name;
        })
        .style("fill", function (d) { return colorTemas[5 - (parseInt(d.grade) - 1)]; });

        chart.selectAll(container + " .barText").data(data).attr("y", function (d,index) {
            return ye(index+1) + 25;
        }).text(function (d) {
            return d.name;
        });
        chart.selectAll(container + " .barText").data(data).exit().remove();
    barra.exit().remove();
};
var grades = [];

function borrar(node) {
    grades.forEach(function (d,index) {
        if (d.name == node.name && d.clasificacion == node.clasificacion) {
            delete grades[index]; 
            eliminarNodo(new nodo("", node.nivel, node.facultad, node.departamento, node.programa));
            var gradest = [];
            grades.forEach(function (l) {
                gradest.push(l);
            });
            grades = gradest;
           // eliminarNodo();  
           
            refrescar();
            if (grades.length ==0) {
                grades = [];
                chart.selectAll(container + " .bar").remove();
                chart.selectAll(container + " .barText").remove();
                chart.selectAll(container + " g").remove();                           
                return;
            }
            updateEje(grades);

            
        }
    });
}

function updateAxisDrop(node) {
    if (dropped) {
        var namenode = node.name;
        var encontro = false;
        grades.forEach(function (d) {
            if (d.name == namenode && d.clasificacion == node.clasificacion) {
                encontro = true;
            }
        });
        if (!encontro) {
            var i = grades.length + 1;
           
            var datos = [anhoSeleccionado, "", "", "",""];
            var tempo = node;
            while (tempo.level > 1)
            {
                datos[tempo.level - 1] = tempo.name;
                tempo = tempo.parent;
            }
            agregarNodo(datos[0], datos[1], datos[2], datos[3], datos[4]);
            refrescar();
            grades.push({
                "name": node.name, "grade": i, "clasificacion": node.clasificacion,"nivel" : datos[1], "facultad": datos[2],
                   "departamento" :datos[3], "programa" : datos[4]});
            updateEje(grades);
        }
        dropped = false;
    }


}