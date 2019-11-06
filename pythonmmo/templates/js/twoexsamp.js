var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);







var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// get the data



d3.csv("/Resources/ageplot.csv", function (error, data) {
    if (error) throw error;
    // format the data
    data.forEach(function (d) {
        d.Age_Group = d.Age_Group;
        d.Total_Revenue = +d.Total_Revenue;
    });
    console.log(data)
    

    x.domain(data.map(function (d) { return d.Age_Group; }));
    y.domain([0, d3.max(data, function (d) { return d.Total_Revenue; })]);
    
    
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.Age_Group); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.Total_Revenue); })
        .attr("height", function (d) { return height - y(d.Total_Revenue); });


    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
});