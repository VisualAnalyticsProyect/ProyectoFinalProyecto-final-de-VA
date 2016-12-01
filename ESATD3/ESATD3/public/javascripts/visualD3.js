var margin = { top: 40, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var calificacion = d3.format(".0");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(calificacion);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>Calificación:</strong> <span style='color:red'>" + d.PROMEDIO + "</span>";
    })

var svg = d3.select("#tablainfo").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.json("/resumen", function (error, data) {
    x.domain(data.map(function (d) { return d.NIVEL; }));
    y.domain([2.5, 3.5]);

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
        .attr("x", function (d) { return x(d.NIVEL); })
        .attr("width", x.rangeBand())
        .attr("y", function (d) { return y(d.PROMEDIO); })
        .attr("height", function (d) { return height - y(d.PROMEDIO); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

});

