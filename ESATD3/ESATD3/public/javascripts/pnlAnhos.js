// ----------------------------------------------------------------------//
//                   Seeción de los botones de los años
// ----------------------------------------------------------------------//

// -----  VARIABLES

// Información de los años en los que se tiene muestra (debería estar leido de la bd)
var anhos = [2011, 2012, 2013, 2014, 2015];
var anhoSeleccionado = "";
// "g" de los botones de los años
var gAnhos;

//Colores de los botones 
var colorDefecto = "#003249"
var colorSobre = "#80CED7"
var colorPresionado = "#007EA7"



//Carga los btones
function cargarBotonesAnhos() {

    var bWidth = 60; //button width
    var bHeight = 35; //button height
    var bSpace = 10; //space between buttons
    var x0 = 20; //x offset
    var y0 = 10; //y offset

    gAnhos = d3.select("#botonesanhoscontainer")
        .append("svg")
        .attr("height", 2 * bHeight)
        .attr("width", "100%")
        .selectAll("g.button")
        .data(anhos)
        .enter()
        .append("g")
        .attr("class", "button")
        .style("cursor", "pointer")
        .on("click", function (d, i) {
            updateButtonColors(d3.select(this), d3.select(this.parentNode))
        })
        .on("mouseover", function () {
            if (d3.select(this).select("rect").attr("fill") != colorPresionado) {
                d3.select(this)
                    .select("rect")
                    .attr("fill", colorSobre);
            }
        })
        .on("mouseout", function () {
            if (d3.select(this).select("rect").attr("fill") != colorPresionado) {
                d3.select(this)
                    .select("rect")
                    .attr("fill", colorDefecto);
            }
        })



    //adding a rect to each toggle button group
    //rx and ry give the rect rounded corner
    gAnhos.append("rect")
        .attr("class", "buttonRect")
        .attr("width", bWidth)
        .attr("height", bHeight)
        .attr("x", function (d, i) { return x0 + (bWidth + bSpace) * i; })
        .attr("y", y0)
        .attr("rx", 5) //rx and ry give the buttons rounded corners
        .attr("ry", 5)
        .attr("fill", colorDefecto)

    //adding text to each toggle button group, centered 
    //within the toggle button rect
    gAnhos.append("text")
        .attr("class", "buttonText")
        .attr("font-family", "FontAwesome")
        .attr("x", function (d, i) {
            return x0 + (bWidth + bSpace) * i + bWidth / 2;
        })
        .attr("y", y0 + bHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "white")
        .attr("font-size","30px")
        .text(function (d) { return d; })
}

// Función que actualiza el valor de otra función.
function updateButtonColors(button, parent) {
    parent.selectAll("rect")
        .attr("fill", colorDefecto)

    button.select("rect")
        .attr("fill", colorPresionado)

    anhoSeleccionado = button.select("text").text();
    refrescar();
    refrescarDispersion();
    actualizarDetalles();
}

cargarBotonesAnhos();