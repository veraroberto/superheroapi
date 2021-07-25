var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 15,
  right: 40,
  bottom: 62,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartData = null;

var chosenXAxis = 'intelligence'
var chosenYAxis = 'durability'

var xAxisLabels = ["intelligence", "strength", "speed"];
var yAxisLabels = ["power", "combat", "durability"];
var labelsTitle = {
  "intelligence": "intelligence",
  "strength": "strength",
  "speed": "speed",
  "power": "power",
  "combat": "combat",
  "durability": "durability"
};

function xScale(HeroData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(HeroData, d => d[chosenXAxis])
      * 0.8, d3.max(HeroData, d => d[chosenXAxis]) * 1.21])
    .range([0, width])
  return xLinearScale;

}

function yScale(HeroData, chosenYAxis) {
  //scaling
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(HeroData, d => d[chosenYAxis]) * .9, d3.max(HeroData, d => d[chosenYAxis]) * 1.1])
    .range([height, 0]);

  return yLinearScale;
}

// bottom
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(500)
    .call(bottomAxis);

  return xAxis;
}

// updating yAxis var upon click on axis label.
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(500)
    .call(leftAxis);

  return yAxis;
}

// Function used for updating circles group with a transition to new circles.
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(500)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// moving text
function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circletextGroup.transition()
    .duration(700)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circletextGroup;
}

// updating circles group with new tooltip.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // X Axis
  if (chosenXAxis === "intelligence") {
    var xlabel = "intelligence: ";
  }
  else if (chosenXAxis === "speed") {
    var xlabel = "speed: "
  }
  else {
    var xlabel = "strength: "
  }

  // Y Axis
  if (chosenYAxis === "durability") {
    var ylabel = "durability: ";
  }
  else if (chosenYAxis === "combat") {
    var ylabel = "combat: "
  }
  else {
    var ylabel = "power: "
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background", "purple")
    .style("color", "white")
    .offset([100, -60])
    .html(function (d) {
      if (chosenXAxis === "strength") {

        return (`id: ${d.id}<hr>${d.name}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
      } else if (chosenXAxis !== "intelligence" && chosenXAxis !== "strength") {

        return (`id: ${d.id}<hr>${d.name}<hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
      } else {

        return (`id: ${d.id}<hr>${d.name}<hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
      }
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })

    .on("mouseout", function (data, index) {
      toolTip.hide(data)
    });

  return circlesGroup;
}


// Import Data
d3.json("/api").then(function (jsonHeroData) {

  var HeroData = [];
  
  jsonHeroData.forEach(function (data) {

    var dict = {
      "id": data.id,
      "name": data.name,
      "intelligence": parseInt(data.powerstats.intelligence),
      "durability": parseInt(data.powerstats.durability),
      "strength": parseInt(data.powerstats.strength),
      "speed": parseInt(data.powerstats.speed),
      "combat": parseInt(data.powerstats.combat),
      "power": parseInt(data.powerstats.power)
    }
    HeroData.push(dict)

  });

  var xLinearScale = xScale(HeroData, chosenXAxis);
  var yLinearScale = yScale(HeroData, chosenYAxis);
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(HeroData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("fill", "purple")
    .attr("opacity", "0.06");

  // Add State name. text to circles. and some offset to y
  var circletextGroup = chartGroup.selectAll()
    .data(HeroData)
    .enter()
    .append("text")
    .text(d => (d.name))
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .style("font-size", ".001px")
    .style("text-anchor", "middle")
    .style('fill', 'purple');

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var intelligenceLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 6)
    .attr("value", "intelligence")
    .classed("active", true)
    .text("Intelligence");

  var durabilityLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.7)
    .attr("y", 0 - (height + 12))
    .attr("value", "durability")
    .classed("active", true)
    .text("Durability");

  var strengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 24)
    .attr("value", "strength")
    .classed("inactive", true)
    .text("Strength");

  var smokeLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.9)
    .attr("y", 0 - (height + 30))
    .attr("value", "combat")
    .classed("inactive", true)
    .text("Combat");

  var speedLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 38)
    .attr("value", "speed")
    .classed("inactive", true)
    .text("Speed");

  var powerLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (margin.left) * 2.8)
    .attr("y", 0 - (height + 52))
    .attr("value", "power")
    .classed("inactive", true)
    .text("Power");


  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


  labelsGroup.selectAll("text")
    .on("click", function () {
      //  Value of selection.
      var value = d3.select(this).attr("value");
      console.log(value)

      //if select x axises
      if (true) {
        if (value === "intelligence" || value === "strength" || value === "speed") {

          chosenXAxis = value;


          xLinearScale = xScale(HeroData, chosenXAxis);


          xAxis = renderXAxes(xLinearScale, xAxis);


          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);


          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);


          if (chosenXAxis === "intelligence") {
            intelligenceLabel
              .classed("active", true)
              .classed("inactive", false);

            strengthLabel
              .classed("active", false)
              .classed("inactive", true);

            speedLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "strength") {
            intelligenceLabel
              .classed("active", false)
              .classed("inactive", true);

            strengthLabel
              .classed("active", true)
              .classed("inactive", false);

            speedLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            intelligenceLabel
              .classed("active", false)
              .classed("inactive", true);

            strengthLabel
              .classed("active", false)
              .classed("inactive", true)

            speedLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }

        else {
          chosenYAxis = value;

          yLinearScale = yScale(HeroData, chosenYAxis);

          yAxis = renderYAxes(yLinearScale, yAxis);

          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // Changes classes to change bold text.
          if (chosenYAxis === "durability") {

            durabilityLabel
              .classed("active", true)
              .classed("inactive", false);


            smokeLabel
              .classed("active", false)
              .classed("inactive", true);

            powerLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "combat") {
            durabilityLabel
              .classed("active", false)
              .classed("inactive", true);

            smokeLabel
              .classed("active", true)
              .classed("inactive", false);

            powerLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            durabilityLabel
              .classed("active", false)
              .classed("inactive", true);

            smokeLabel
              .classed("active", false)
              .classed("inactive", true);

            powerLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      }

    });

});