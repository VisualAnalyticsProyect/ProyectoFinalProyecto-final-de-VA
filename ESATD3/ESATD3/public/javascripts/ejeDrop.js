    widthx = 100,
    height = 400;

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
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<div><strong>Nivel:</strong> <span style='color:red'>" + d.name + "</span></div><div><strong>Grade:</strong> <span style='color:forestgreen'>" + d.grade + "</span></div>";
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

chart.call(tip);

function update(data) {       
    ye.domain([0, d3.max(data, function (d,index) { return index+1; })]);

    chart.append("g")
        .attr("transform", "translate(0," + height + ")")



    var barra = chart.selectAll(container +" .bar").data(data);
    barra.enter().append("rect").attr("class", "bar");	
  		barra.on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .style("fill", function (d) {           
            return "forestgreen";            
        }).on('click', function (d) { borrar(d); })
        .attr("x",0)
        .attr("y", function (d,index) { return ye(index+1); })
        .attr("width", widthx + "%")
        .attr("height", function (d) { return 50; })
        .attr("border-style", "solid").enter().append("text")
        .attr("x", 5)
        .attr("y", function (d) {
                    return ye(d.grade) + 30;
                })
        .attr('class', 'barText')
        .attr("text-anchor","start")
        .text(function (d) {
            return d.name;
        })
        .style("fill", "white");

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
        if (d.name == node.name) {
            delete grades[index]; 
            var gradest = [];
            grades.forEach(function (d) {
                gradest.push(d);
            });
            grades = gradest;          
            if (grades.length ==0) {
                grades = [];
                chart.selectAll(container + " .bar").remove();
                chart.selectAll(container + " .barText").remove();
                chart.selectAll(container + " g").remove();
                $(".d3-tip").visible(false);            
                return;
            }
            update(grades);
        }
    });
}

function updateAxisDrop(node) {
    if (dropped) {
        var namenode = node.__data__.name;
        var encontro = false;
        grades.forEach(function (d) {
            if (d.name == namenode) {
                encontro = true;
            }
        });
        if (!encontro) {
            var i = grades.length + 1;
            grades.push({ "name": node.__data__.name, "grade": i });
            update(grades);
        }
        dropped = false;
    }

}