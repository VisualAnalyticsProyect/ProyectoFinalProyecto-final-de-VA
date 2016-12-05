var margin = { top: 40, right: 20, bottom: 30, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var calificacion = d3.format(".0");

var xb = d3.scale.ordinal()
    .rangeRoundBands([0, width], .05);

var yb = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xb)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(yb)
    .orient("left")
    .tickFormat(calificacion);

var tipb = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>Calificación:</strong> <span style='color:red'>" + d.PORCENTAJE + "</span>";
    })

var svgbar = d3.select("#tablainfo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svgbar.call(tipb);
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
        xb.domain(data.map(function (d) { return d.MEDICION; }));
        yb.domain([0, d3.max(data, function (d) { return d.PORCENTAJE; })]);

        svgbar.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

        svgbar.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Satisfacción");

        svgbar.selectAll("#tablainfo bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) { return x(d.MEDICION); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.PORCENTAJE); })
            .attr("height", function (d) { return height - y(d.PORCENTAJE); })
            .on('mouseover', tipb.show)
            .on('mouseout', tipb.hide);

    });
   
}

