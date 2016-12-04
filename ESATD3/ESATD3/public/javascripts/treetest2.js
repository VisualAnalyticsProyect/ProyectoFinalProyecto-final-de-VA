var w = 100,
    h = 100,
    diameter = 800,
    r=diameter,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;


var svg = d3.select("#tablainfo").append("svg").attr("width", "100%").attr("height", "100%"),    
    g = svg.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d");

var pack = d3.pack()
    .size([r, r]);

d3.json("data/arbol.json", function (error, root) {
    if (error) throw error;
    node = root;
    root = d3.hierarchy(root)
        .sum(function (d) { return d.value; })
        .sort(function (a, b) { return b.value - a.value; });

    var node = g.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function (d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function (d) { return d.data.name + "\n" + format(d.value); });

    node.append("circle")
        .attr("r", function (d) { return d.r; })
        .on("click", function (d) { return zoom(node == d ? root : d); });;

    node.filter(function (d) { return !d.children; }).append("text")
        .attr("dy", "0.3em")
            .text(function (d) { return d.data.name.substring(0, d.r / 3); });

    d3.select(window).on("click", function () { zoom(root); });
});

function zoom(d, i) {    
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = svg.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("r", function (d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function (d) { return x(d.x); })
        .attr("y", function (d) { return y(d.y); })
        .style("opacity", function (d) { return k * d.r > 20 ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
}