var treeJSON = d3.json("data/arbol.json", function (error, treeData) {
    createTree(treeData, "#treecontainer", true);
});

function createTree(treeData, container, isDrag) {

    var xScale = d3.scale.linear().domain([0, 10]).range([0, 50]);
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    var anchuraNodos = 10;
    var root;
    var containertag = container.replace("#", "");
    // Misc. variables
    var i = 0;
    var duration = 1000;
    // size of the diagram
    var viewerWidth = 300;
    var viewerHeight = 300;//$(document).height();

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    // Call visit function to establish maxLabelLength
    visit(treeData, function (d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function (d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select(container).append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("id", containertag + "svg")


   // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g").attr("id", containertag + "g").call(zoomListener);

    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function (d) {
            //if (d == root) {
            //    return;
            //}
            dragStarted = isDrag;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
        })
        .on("drag", function (d) {
           // if (d == root) {
           //     return;
          //  }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
        }).on("dragend", function (d) {
           // if (d == root) {
           //     return;
          //  }
            selectedNode = d;
            domNode = this;           
            endDrag();            
        });
    // Define the root
  root = treeData;

   /* root = d3.stratify()+
        .id(function (d) { return d.NIVEL; })
        .parentId(function (d) { return d.FACULTAD; })
        (treeData);*/

    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    update(root);
    centerNode(root);

    function update(source) {

        svgGroup = d3.select(container + "svg g");
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function (level, n) {
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);
                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function (d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * anchuraNodos; // 25 pixels per line  
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function (d) {
            d.y = (d.depth * (maxLabelLength * 1));
        });

        // Update the nodes…
        node = svgGroup.selectAll(container + " g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter;
        if (isDrag) {
            nodeEnter = node.enter().append("g").call(dragListener)
        }
        else {
            nodeEnter = node.enter().append("g")
        }

        nodeEnter.attr("class", "node")
            .attr("id", containertag + "-gnode")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("rect")
            .attr("class", "shadow")
            .attr("id", containertag + "-rect")
            .attr("width", 20)
            .attr("height", 30)
            .attr("rx", 2)
            .attr("ry", 2)
            .transition()
            .duration(duration * 2)
            .attr("width", function (d) { return xScale(d.value); })
            .style("fill", function (d) { return color[d.level] });

        nodeEnter.append("text")
            .attr("x", 0)
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill", "white");


        // Update the text to reflect whether node has children or not.
        node.select(container + ' text')
            .attr("x", 0)
            .attr("text-anchor", "start")
            .text(function (d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select(container + " rect.shadow")
            .attr("x", -10)
            .attr("y", -15)
            .attr("width", 20)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("width", function (d) { return xScale(d.value); })
            .style("fill", function (d) { return color[d.level] });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select(container + " text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select(container + " rect")
            .attr("width", 0)
            .attr("height", 0)
            .attr("rx", 0)
            .attr("ry", 0);

        nodeExit.select(container + " text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll(container + " path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }




    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 20;
        y = y * scale + viewerHeight / 1;
        d3.select(container + ' g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return;
        d = toggleChildren(d);
        update(d);
        //centerNode(d);      
    }

    function initiateDrag(d, domNode) {
        container = "#" + domNode.id.split("-")[0]
        draggingNode = d;
        d3.select(domNode).attr('class', 'node activeDrag');
        svgGroup.selectAll(container + " g.node").sort(function (a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll(container + " path.link")
                .data(links, function (d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll(container + " g.node")
                .data(nodes, function (d) {
                    return d.id;
                }).filter(function (d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll(container + ' path.link').filter(function (d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        });//.remove();

        dragStarted = null;
    }


    function endDrag() {
        container = "#" + domNode.id.split("-")[0]   
        //############################# ejedrop
        updateAxisDrop(domNode);   
        selectedNode = null;
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time        
        if (draggingNode !== null) {
            update(root);
            //centerNode(draggingNode);
            draggingNode = null;
        }
        
    }

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;
        visitFn(parent);
        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function (a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }


    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
}