treeJSON = d3.json("data/ejemplonivel.json", function (error, treeData) {

   // createTree(treeData, "#treecontainerDetalle", false);
    createTree(treeData, "#treecontainer", true);


});


var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x1 = d3.scale.ordinal().rangePoints([0, width], 1),
    y1 = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("#paralel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/ejemplo.csv", function (error, cars) {

    // Extract the list of dimensions and create a scale for each.
    x1.domain(dimensions = d3.keys(cars[0]).filter(function (d) {
        return d != "Nombre" && (y1[d] = d3.scale.linear()
            .domain(d3.extent(cars, function (p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(cars)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(cars)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
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

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y1[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) { return d; })
        .style("fill", function (d) {
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);
            return randomColor;
        });

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
        return "hsl(" + (((170 - d.P1) * 90) / 170) + ",80%,60%)";
    }).style("stroke-width", function (d, i) {
        return (1 - (d.P1 / 170) * 5) + 5;
    }).style("opacity", function (d, i) {
        return 1 - ((d.P1) / 300);

    });

});

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