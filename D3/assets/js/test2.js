var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcareLow";

// function used for updating x-scale and y-scale var upon clicking one or the other axes label
function xyScale(usData, chosenAxis) {
  
  let rangeArg1 = 0;
  let rangeArg2 = 0;
  let offset = (chosenAxis === "income") ? "3000" : "1";

  if (chosenAxis === "income" || chosenAxis === "poverty" || chosenAxis === "age") {
      rangeArg1 = 0;
      rangeArg2 = width;
  } else { //if (chosenAxis === "healthcareLow" || chosenAxis === "smokes" || chosenAxis === "obesity")
      rangeArg1 = height;
      rangeArg2 = 0;
  } 

  let xyLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d[chosenAxis]) - offset, d3.max(usData, d => d[chosenAxis])])
    .range([rangeArg1, rangeArg2]);

  return xyLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {

  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {

  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newScale, chosenAxis, whichAxis) {

  var circlesTags = circlesGroup.selectAll("circle");
  var circlesText = circlesGroup.selectAll("text");

  switch (whichAxis) {
    case "x":
      circleTagAttr = "cx";
      circleTextAttr = "dx";
      break;
    case "y":
      circleTagAttr = "cy";
      circleTextAttr = "dy";
      break;
    default:
      // do nothing
      break;
  }

  circlesTags.transition()
    .duration(1000)
    .attr(circleTagAttr, d => newScale(d[chosenAxis]));

  circlesText.transition()
    .duration(1000)
    .attr(circleTextAttr, d => newScale(d[chosenAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  let xprefix = "";
  let xsuffix = "";
  let xlabel = "";
  let ysuffix = "";
  let ylabel = "";


  switch (chosenXAxis) {
    case "poverty":
      xlabel = "Poverty: ";
      xsuffix = "%";
      break;
    case "age":
      xlabel = "Median Age: ";
      break;
    case "income":
      xlabel = "Income: ";
      xprefix = "$";
      break;
    default:
      //should never get here
      xlabel = "No Label Defined";
  }

  switch (chosenYAxis) {
    case "healthcareLow":
      ylabel = "Healthcare: ";
      ysuffix = "%";
      break;
    case "smokes":
      ylabel = "Smokes: ";
      ysuffix = "%";
      break;
    case "obesity":
      ylabel = "Obesity: ";
      ysuffix = "%";
      break;
    default:
      //should never get here
      ylabel = "No Label Defined";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`<u><strong>${d.state}</strong></u><br>${xlabel} ${xprefix}${d[chosenXAxis]}${xsuffix}<br>${ylabel} ${d[chosenYAxis]}${ysuffix}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data, this);
    })
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Import Data
d3.csv("assets/data/data.csv")
  .then(function (usData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    usData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcareLow = +data.healthcareLow;
      data.age = +data.age;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xyScale(usData, chosenXAxis);
    var yLinearScale = xyScale(usData, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ============================== 
    var circlesGroup = chartGroup.selectAll("g#circleGroupWrapper")
      .data(usData)
      .enter()
      .append('g')
      .attr('id', 'circleGroupWrapper');

    circlesGroup
      .append('circle')
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "15")
      .attr("fill", "limegreen")
      .attr("opacity", ".5");

    circlesGroup
      .append("text")
      .classed('circleText', true)
      .attr('dx', d => xLinearScale(d[chosenXAxis]))
      .attr('dy', d => yLinearScale(d[chosenYAxis]))
      .attr('text-anchor', "middle")
      .attr('alignment-baseline', "central")
      .style("font-size", 12 + "px")
      .text(d => d.abbr);


    // Step 6: Create tooltip in the chart
    // ============================== 
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // Step 7: Create axes labels
    // ==============================

    // x-axis labels 
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", false)
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .classed("active", false)
      .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .classed("active", false)
      .text("Household Income (Median)");

    // y axis labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    healthcareLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "healthcareLow") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    obesityLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");

    smokesLabel = yLabelsGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // updates x scale for new data
          xLinearScale = xyScale(usData, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxis(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, 'x');

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "age") {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
          } else {  // healthcareLow
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenXAxis with value
          chosenYAxis = value;

          // updates y scale for new data
          yLinearScale = xyScale(usData, chosenYAxis);

          // updates y axis with transition
          yAxis = renderYAxis(yLinearScale, yAxis);

          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, 'y');

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenYAxis === "healthcareLow") {
            healthcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          } else {  // obesity
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
  });