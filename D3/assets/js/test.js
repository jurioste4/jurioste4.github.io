let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let chartGroup = svg.append("g")


var chosenXAxis = "Age";


function xScale(data, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;

}


function renderAxes(circlesGroup, newXScale, chosenXAxis) {
    // var bottomAxis = d3.axisBottom(newXScale);

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}


function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;

}


function updateToolTip(chosenXAxis, circlesGroup) {


    if (chosenXAxis === "age") {
        var label = "Age:";
    }
    else {
        var label = "Income :";

    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })

        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;


}


d3.csv("./assets/data/data.csv").then(function (data) {

    console.log(data[0]);


    data.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
    });

    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return data.income;
        })
        .attr("font_family", "sans-serif")
        .attr("font-size", "11px")


    var labelsGroup = chartGroup.append("g")
        .attr("transform", `tramslate(${width / 2}, ${height + 20})`);


    var age_lengthlabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age")
        .classed("active", true)
        .text("heathcare vs Age");


    var income_label = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "num_income")
        .classed("inactive", true)
        .text("income");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Heathcare");


    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


    labelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                chosenXAxis = value;

                console.log(chosenXAxis)


                xLinearScale = xScale(data, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "age") {
                    age_lengthlabel
                        .classed("active", true)
                        .classed("inactive", false);
                    income_label
                        .classed("active", false)
                        .classed("inactive", true);

                }
                else {
                    age_lengthlabel
                        .classed("active", false)
                        .classed("inactive", true);
                    income_label
                        .classed("active", true)
                        .classed("inactive", false);

                }
            }
        });
});













