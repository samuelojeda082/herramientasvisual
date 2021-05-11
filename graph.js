
// Cargamos los datos.
d3.csv("https://raw.githubusercontent.com/samuelojeda082/herramientasvisual/main/dataset_act_grup.csv").then(function (data) {

  console.log(data);

  // definimos los márgenes, la anchura y altura
  var margin = {
    top: 40,
    right: 230,
    bottom: 60,
    left: 60
  },
    width = 600 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

  // Añadimos la gráfica con la etiqueta svg
  var svg = d3.select("#grafica")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Añade el eje x
  var x = d3.scaleLinear()
    .domain([-1.5, 1.5])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

  // Añade la etiqueta al eje x, en este caso Variación de población respecto al año anterior
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 50)
    .text("Variación de población respecto al año anterior");

  // Añade la linea vertical que coincide con el valor 0 del eje x
  svg.append("line")
    .attr("x1", 155)
    .attr("y1", 0)
    .attr("x2", 155)
    .attr("y2", height)
    .style("stroke-width", 1)
    .style('stroke-dasharray', ('2,2'))
    .style("stroke", "gray")
    .style("fill", "none");

  // Añade el eje y
  var y = d3.scaleLinear()
    .domain([0, 40000])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Añade la etiqueta al eje y, en este caso PIB per capita
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("PIB per capita")
    .attr("text-anchor", "start")

  // Define la escala del tamaño de las burbujas
  var z = d3.scaleSqrt()
    .domain([10000, 10000000])
    .range([2, 30]);

  // Define los colores que tomarán cada una de las comunidades autónomas
  var myColor = d3.scaleOrdinal()
    .domain([...new Set(data.map(x => x.comuni))])
    .range([
      "#ffcccc",
      "#ff9966",
      "blue",
      "#006400",
      "#006666",
      "#006699",
      "#0066ff",
      "#660099",
      "#6600ff",
      "#6699ff",
      "#66ffff",
      "#990000",
      "#996699",
      "#9999cc",
      "#cc0000",
      "#99ffcc",
      "#ff99ff"
    ]);

  // Se crea el tooltip
  var tooltip = d3.select("#grafica")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  // Definimos las funciones de los eventos que tendrá el tooltip. 
  // Las funciones se definen aquí, pero se usarán en los eventos definidos abajo del script
  // 1. Definimos los parámetros para la muestra del tooltip, cuando el ratón esté encima de una provincia
  var showTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Provincia: " + d.provincia + ". Población: " + d.pobla)
      .style("left", (d3.mouse(this)[0] + 30) + "px")
      .style("top", (d3.mouse(this)[1] + 30) + "px")
  }
  // 2. Definimos la función cuando el puntero del ratón está encima del tooltip
  var moveTooltip = function (d) {
    tooltip
      .style("left", (d3.mouse(this)[0] + 30) + "px")
      .style("top", (d3.mouse(this)[1] + 30) + "px")
  }
  // 3. Definimos la función que tomará el evento cuando el ratón salga de la provincia
  var hideTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // Definimos la función que cambia la opacidad de las burbujas cuando se está produciendo un evento. 
  // Es decir, cuando el puntero está encima de una burbuja
  var highlight = function (d) {
    // reduce la opacidad de todas las burbujas
    d3.selectAll(".bubbles").style("opacity", .02)
    // Cuando el ratón está encima de una comunidad en la leyenda, las burbujas asociadas a esa comunidad
    // se ponen con opacidad a 1.
    d3.selectAll("." + d).style("opacity", 1)
  }

  // Definimos la función cuando no hay ningún evento sobre la leyenda, es decir, todas las burbujas con opacidad 1
  var noHighlight = function (d) {
    d3.selectAll(".bubbles").style("opacity", 1)
  }


  // Definimos las burbujas que tendrá la gráfica
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "bubbles " + d.comuni
    })
    .attr("cx", function (d) {
      return x(d.var_pobla);
    })
    .attr("cy", function (d) {
      return y(d.pib);
    })
    .attr("r", function (d) {
      return z(d.pobla);
    })
    .style("fill", function (d) {
      return myColor(d.comuni);
    })
    // Definimos los eventos y las funciones que se ejecutarán cuando se produzca su evento correspondiente
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip)


  // Definición de la leyenda
  var valuesToShow = [1000000, 4000000, 10000000]
  var xCircle = 420
  var xLabel = 470
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
    .attr("cx", xCircle)
    .attr("cy", function (d) {
      return height - z(d) + 30
    })
    .attr("r", function (d) {
      return z(d)
    })
    .style("fill", "none")
    .attr("stroke", "black")
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
    .attr('x1', function (d) {
      return xCircle + z(d)
    })
    .attr('x2', xLabel)
    .attr('y1', function (d) {
      return height - z(d) + 30
    })
    .attr('y2', function (d) {
      return height - z(d) + 30
    })
    .attr('stroke', 'black')
    .style('stroke-dasharray', ('2,2'))

  // Añade las etiquetas a la leyenda
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
    .attr('x', xLabel)
    .attr('y', function (d) {
      return height - z(d) + 30
    })
    .text(function (d) {
      return d / 1000000
    })
    .style("font-size", 10)
    .attr('alignment-baseline', 'middle')

  // Título de la leyenda
  svg.append("text")
    .attr('x', xCircle)
    .attr("y", height + 50)
    .text("Población (millones)")
    .attr("text-anchor", "middle")

  // Añade los puntos a cada etiqueta de la leyenda
  var size = 20 // Tamaño del punto
  var allgroups = [...new Set(data.map(x => x.comuni))]
  svg.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", 390)
    .attr("cy", function (d, i) {
      return 10 + i * (size + 5)
    })
    .attr("r", 7)
    .style("fill", function (d) {
      return myColor(d)
    })
    // Definición de los eventos sobre la leyenda
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Agrega las etiquetas al lado de los puntos
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", 390 + size * .8)
    .attr("y", function (d, i) {
      return i * (size + 5) + (size / 2)
    }) 
    .style("fill", function (d) {
      return myColor(d)
    })
    .text(function (d) {
      return d
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)
})
