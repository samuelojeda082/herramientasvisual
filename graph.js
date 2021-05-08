
//Read the data
d3.csv("https://raw.githubusercontent.com/samuelojeda082/herramientasvisual/main/dataset_act_grup.csv").then(function (data) {

  console.log(data);

  // set the dimensions and margins of the graph
  var margin = {
    top: 40,
    right: 230,
    bottom: 60,
    left: 60
  },
    width = 600 - margin.left - margin.right,
    height = 620 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#grafica")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // ---------------------------//
  //       AXIS  AND SCALE      //
  // ---------------------------//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-1.5, 1.5])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 50)
    .text("Variación de población respecto al año anterior");

  // Add X axis 0
  svg.append("line")
    .attr("x1", 155)
    .attr("y1", 0)
    .attr("x2", 155)
    .attr("y2", height)
    .style("stroke-width", 1)
    .style('stroke-dasharray', ('2,2'))
    .style("stroke", "gray")
    .style("fill", "none");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 40000])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", -20)
    .text("PIB per capita")
    .attr("text-anchor", "start")

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([10000, 10000000])
    .range([2, 30]);

  // Add a scale for bubble color
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


  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#grafica")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
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
  var moveTooltip = function (d) {
    tooltip
      .style("left", (d3.mouse(this)[0] + 30) + "px")
      .style("top", (d3.mouse(this)[1] + 30) + "px")
  }
  var hideTooltip = function (d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function (d) {
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("." + d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function (d) {
    d3.selectAll(".bubbles").style("opacity", 1)
  }


  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
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
    // -3- Trigger the functions for hover
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip)



  // ---------------------------//
  //       LEGEND              //
  // ---------------------------//

  // Add legend: circles
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

  // Add legend: segments
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

  // Add legend: labels
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

  // Legend title
  svg.append("text")
    .attr('x', xCircle)
    .attr("y", height + 50)
    .text("Población (millones)")
    .attr("text-anchor", "middle")

  // Add one dot in the legend for each name.
  var size = 20
  var allgroups = [...new Set(data.map(x => x.comuni))]
  svg.selectAll("myrect")
    .data(allgroups)
    .enter()
    .append("circle")
    .attr("cx", 390)
    .attr("cy", function (d, i) {
      return 10 + i * (size + 5)
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return myColor(d)
    })
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight)

  // Add labels beside legend dots
  svg.selectAll("mylabels")
    .data(allgroups)
    .enter()
    .append("text")
    .attr("x", 390 + size * .8)
    .attr("y", function (d, i) {
      return i * (size + 5) + (size / 2)
    }) // 100 is where the first dot appears. 25 is the distance between dots
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
