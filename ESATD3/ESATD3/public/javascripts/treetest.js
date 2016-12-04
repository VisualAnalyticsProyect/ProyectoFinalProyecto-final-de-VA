
var w = d3.select("#treecontainer").style("width"),
    width = w.replace("px", ""),
    h = d3.select("#treecontainer").style("height"),
    r = 500,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;

var pack = d3.layout.pack()
    .size([r, r])
    .value(function (d) { return d.value; })

var vis = d3.select("#treecontainer").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .attr("margin-left","40%")
    .append("svg:g")
    .attr("transform", "translate(" + (width - r) / 2 + ",0)");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<div><strong>Nivel:</strong> <span style='color:red'>" + d.name + "</span></div><div><strong>Grade:</strong> <span style='color:forestgreen'>" + d.level + "</span></div>";
    });
vis.call(tip);
d3.json("data/arbol.json", function (data) {
    node = root = data;

    var nodes = pack.nodes(root);

    vis.selectAll("circle")
        .data(nodes)
        .enter().append("svg:circle")
        .attr("class", function (d) { return d.children ? "parent" : "child"; })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return d.r; })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function (d) { return zoom(node == d ? root : d); });

    vis.selectAll("text")
        .data(nodes)
        .enter().append("svg:text")
        .attr("class", function (d) { return d.children ? "parent" : "child"; })
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("opacity", function (d) {
            return d.level >= levelactual && d.level <= (levelactual+1) ? 1 : 0;
        })
        .text(function (d) {  return d.name; });

    d3.select(window).on("click", function () { zoom(root); });
});
var levelactual = 1;
function zoom(d, i) {    
    levelactual = d.level;
    var k = r / d.r / 2;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = vis.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .attr("r", function (d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function (d) { return x(d.x); })
        .attr("y", function (d) { return y(d.y); })
        .style("opacity", function (d) { return d.level >= levelactual && d.level <= (levelactual + 1) ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
}
