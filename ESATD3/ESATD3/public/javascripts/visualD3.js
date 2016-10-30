var margin = { top: 100, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.csv("data/indicators.csv", function (error, countries) {

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(countries[0]).filter(function (d) {
        return d != "Country" && (
            y[d] = d3.scale.linear()
                .domain(d3.extent(countries, function (p) { return +p[d]; }))
                .range([height, 0]));
    }));

    var dropDown = d3.select("#table_container").append("select")
        .attr("name", "country-list")
        .on("change", change);
    var options = dropDown.selectAll("option")
        .data(countries
            .sort(function (a, b) { return d3.ascending(a.Country, b.Country); }))
        .enter()
        .append("option");

    options.text(function (d) { return d["Country"]; })
        .attr("value", function (d) { return d["Country"]; });


    function change() {
        var selectedIndex = dropDown.property('selectedIndex'),
            selectedCountry = options[0][selectedIndex].__data__;
        foreground.style("display", function (d) {
            if (d.Country == selectedCountry["Country"]) {
                return null;
            }
            else {
                return "none";
            }
        });
    }

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(countries)
        .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; });
    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function (d) {
            if (d != "Rank") {
                return d.toString().split("-")[1].trim();
            }
            else {
                return d;
            }
        })
        .style("fill", function (d) {
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);
            return randomColor;
        });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    // add style linepath
    d3.selectAll(".foreground path").style("stroke", function (d, i) {
        return "hsl(" + (((170 - d.Rank) * 90) / 170) + ",80%,60%)";
    }).style("stroke-width", function (d, i) {
        return (1 - (d.Rank / 170) * 5) + 5;
    }).style("opacity", function (d, i) {
        return 1 - ((d.Rank) / 300);

    });

});

// Returns the path for a given data point.
function path(d) {
    return line(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
        extents = actives.map(function (p) { return y[p].brush.extent(); });
    foreground.style("display", function (d) {
        return actives.every(function (p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
    });
}
