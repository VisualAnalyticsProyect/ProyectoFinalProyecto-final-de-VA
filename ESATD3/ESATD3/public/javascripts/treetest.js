//http://mbostock.github.io/d3/talk/20111116/pack-hierarchy.html
var w = d3.select("#treecontainer").style("width","100%"),
    //f = w.replace("px", ""),
    h = d3.select("#treecontainer").style("height"),
    r = 450,
    xt = d3.scale.linear().range([0, r]),
    yt = d3.scale.linear().range([0, r]),
    node,
    root;
var draggingNode = null;


var pack = d3.layout.pack()
    .size([r, r])
    .value(function (d) { return d.value*100; })
var containertree = "#treecontainer";
var vis = d3.select("#treecontainer").insert("svg:svg", "h2")
    .attr("width", "100%")
    .attr("height", h)
    //.attr("margin-left", "40%")
    .append("svg:g");
    

var main = d3.select(".main").append("svg")
    .attr("width", "100%")
    .attr("height",h)
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
    .origin(function (d) {
    var t = d3.select(this);
    return { x: d.x-100, y: d.y-100};})
    .on("dragstart", function (d) {   
        d3.event.sourceEvent.stopPropagation();    
        dragStarted = true;  
        if (firstTime) {
            d.x = 0;
            d.y = 0;
            firstTime = false;
        }
        d3.select(containertree + " svg").style("overflow", "visible");
        d3.select("#ejecontainer").style("background-color", "#80CED7");
        d3.select("#ejecontainer").style("opacity", "0.8");
        d3.select("#ejecontainer2").style("background-color", "#80CED7");
        d3.select("#ejecontainer2").style("opacity", "0.8");
        d3.select("#ejecontainerText").text("Suelte Aquí");
        d3.select("#ejecontainerText2").text("Suelte Aquí");
        
    })
    .on("drag", function (d) {       
        if (dragStarted) {            
           initiateDrag(d, this);
        }
        move(d,this);
    }).on("dragend", function (d) {    
        d3.select("#ejecontainer").style("background-color", "white");
        d3.select("#ejecontainer").style("opacity", "1"); 
        d3.select("#ejecontainerText").text(""); 
        d3.select("#ejecontainer2").style("background-color", "white");
        d3.select("#ejecontainer2").style("opacity", "1");
        d3.select("#ejecontainerText2").text(""); 
        endDrag(d,this);
    });

var nodes;
var firstTime;
d3.json("data/arbol.json", function (data) {
    node = root = data;
    nodes = pack.nodes(root);
    restartCircleTree();
});

function restartCircleTree() {
    d3.select(containertree + " svg").style("overflow", "hidden");
    firstTime = true;    
    nodes = pack.nodes(root);
    updateTreeCircle(nodes);
}

function updateTreeCircle(nodes) {
    // Update the nodes…
    node = vis.selectAll(containertree + " g.circlenode").data(nodes);
    node.exit().remove();
    // Enter any new nodes at the parent's previous position.
    var nodeEnter;    
        nodeEnter = node.enter().append("g")
            .attr("class", "circlenode").call(dragListener)
            .on("mouseover",tip.show)
            .on("mouseout", tip.hide)           
        .on("click", function (d) { return zoom(node == d ? root : d); });

        nodeEnter.append("text")
            .attr("class", function (d) { return d.children ? "parent" : "child"; })
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("opacity", function (d) {
                return d.level >= levelactual && d.level <= parseInt(levelactual) + 1 ? 1 : 0;
            })
            .text(function (d) { return d.name; });
           
        nodeEnter.append("circle")
        .attr("class", function (d) { return d.children ? "parent" : "child"; })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return d.r; })
        

       

    d3.select(window).on("click", function () { zoom(root); });
}
var levelactual = 1;
function zoom(nodin, i) {
    updateBar(nodin.name, nodin.level);
    restartCircleTree();   
    if (d3.event.defaultPrevented) return; 
    levelactual = nodin.level;
    var levelrang = parseInt(levelactual) + 1;
    var k = r / nodin.r / 2;
    xt.domain([nodin.x - nodin.r, nodin.x + nodin.r]);
    yt.domain([nodin.y - nodin.r, nodin.y + nodin.r]);

    var t = vis.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function (d) { return xt(d.x); })
        .attr("cy", function (d) { return yt(d.y); })
        .attr("r", function (d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function (d) { return xt(d.x); })
        .attr("y", function (d) { return yt(d.y); })
        .style("opacity", function (d) {
            return d.level >= levelactual && d.level <= levelrang ? 1 : 0;
        });

    node = nodin;
    d3.event.stopPropagation();
}

function initiateDrag(datan, domNodep) {      
    var datajsonp = [];      
    draggingNode = domNodep;
    dragStarted = null;
}

function move(d,domNodep) {
   // var xevm = 
   // var yevm =      
 d.x += d3.event.dy;
 d.y += d3.event.dx;   
 d3.select(domNodep)
     .attr("transform", "translate(" + (d.y) + "," + d.x + ")")
     //.select("circle").attr("r",50);   
};

function endDrag(d, domNodep) {
     //############################# ejedrop   
   // d3.select(domNodep).select("circle").attr("r",d.r);
    d3.select(containertree + " svg").style("overflow", "hidden");
    var posRelaty1 = $("#ejecontainer").offset().top;
    var posRelaty2 = $("#ejecontainer2").offset().top;
    var posRelatyt = $("#treecontainer").offset().top;
    var posRelaty12 = $("#ejecontainer").position().top;
    var posRelaty22 = $("#ejecontainer2").position().top;
    var posRelatyt2 = $("#treecontainer").position().top;
    


    if (posRelatyt   < 800)
        updateAxisDrop2(d);
    else
        updateAxisDrop(d);    
    // now restore the mouseover event or we won't be able to drag a 2nd time        
    if (draggingNode !== null) {    
        vis.selectAll("g").attr("transform", "");     
        restartCircleTree();
        draggingNode = null;
    }

}

