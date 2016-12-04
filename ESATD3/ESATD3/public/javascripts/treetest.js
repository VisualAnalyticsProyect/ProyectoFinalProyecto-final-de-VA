//http://mbostock.github.io/d3/talk/20111116/pack-hierarchy.html
var w = d3.select("#treecontainer").style("width"),
    width = w.replace("px", ""),
    h = d3.select("#treecontainer").style("height"),
    r = 500,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]),
    node,
    root;
var draggingNode = null;


var pack = d3.layout.pack()
    .size([r, r])
    .value(function (d) { return d.value; })
var container = "#treecontainer";
var vis = d3.select("#treecontainer").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h)
    .attr("margin-left","40%")
    .append("svg:g")
    .attr("transform", "translate(" + (width - r) / 2 + ",0)");

var main = d3.select(".main").append("svg")
    .attr("width", "100%")
    .attr("height","100%")
    .attr("class", "svgdrag");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function (d) {
        return "<div><strong>Nivel:</strong> <span style='color:red'>" + d.name + "</span></div><div><strong>Grade:</strong> <span style='color:forestgreen'>" + d.level + "</span></div>";
    });
vis.call(tip);


// Define the drag listeners for drag/drop behaviour of nodes.
dragListener = d3.behavior.drag()
    .on("dragstart", function (d) {       
        dragStarted = true;       
        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function (d) {       
        if (dragStarted) {            
          // initiateDrag(d, this);
        }
        move(d,this);
    }).on("dragend", function (d) {      
        endDrag(d);
    });



d3.json("data/arbol.json", function (data) {
    node = root = data;
    var nodes = pack.nodes(root);
    update(nodes);
});

function update(nodes) {
    // Update the nodes…
    node = vis.selectAll(container + " g.circlenode").data(nodes);

    // Enter any new nodes at the parent's previous position.
    var nodeEnter;    
        nodeEnter = node.enter().append("g")
            .attr("class", "circlenode").call(dragListener)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function (d) { return zoom(node == d ? root : d); });
           
        nodeEnter.append("circle")
        .attr("class", function (d) { return d.children ? "parent" : "child"; })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return d.r; })
        

        nodeEnter.append("text")
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
}
var levelactual = 1;
function zoom(d, i) {   
    if (d3.event.defaultPrevented) return; 
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

function initiateDrag(datan, domNode) {
    var datajsonp = [];
    var nodes = pack.nodes(root);
    //update(nodes);
    draggingNode = domNode;
    dragStarted = null;
}

function move(d,domNode) {
   // var xevm = 
   // var yevm = 
    d.x = d3.event.y;
    d.y = d3.event.x;
    d3.select(domNode)        
        .attr("transform", "translate(" + d.y + "," + d.x + ")");   
};

function endDrag(d) {
     //############################# ejedrop
    
    updateAxisDrop(d);    
    // now restore the mouseover event or we won't be able to drag a 2nd time        
    if (draggingNode !== null) {
        update(root);
        //centerNode(draggingNode);
        draggingNode = null;
    }

}

