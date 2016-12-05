var margin = { top: 40, right: 20, bottom: 30, left: 40 },
    width = 300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var calificacion = d3.format(".0");

var xb = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var yb = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xb)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yb)
    .orient("left")
    .tickFormat(calificacion);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>Calificación:</strong> <span style='color:red'>" + d.PORCENTAJE + "</span>";
    })

var svg = d3.select("#tablainfo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);
update("PREGRADO", 2);

function update(valor, nivel) {
    var consulta;
    if (nivel == 5)
        consulta = "programa";
    if (nivel == 4)
        consulta = "departamento";
    if (nivel == 3)
        consulta = "facultad";
    if (nivel == 2)
        consulta = "estudios";
    if (nivel == 1)
        consulta = "";

    d3.json("/resumen?" + consulta + "=" + valor, function (error, data) {
        xb.domain(data.map(function (d) { return d.MEDICION+"."; }));
        yb.domain([0, 5]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Calificación");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xb(d.MEDICION); })
            .attr("width", xb.rangeBand())
            .attr("y", function (d) { return yb(d.PORCENTAJE); })
            .attr("height", function (d) { return height - yb(d.PORCENTAJE); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

    });
   
}

