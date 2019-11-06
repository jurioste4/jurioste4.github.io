const margin = 100;
const width = 600 - 2 * margin;
const height = 500 - 2 * margin;

var xScale = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.05);
var yScale = d3.scaleLinear()
  .rangeRound([height, 0]);


const svg = d3.select("svg")
  .append("g")
  .attr('transform', `translate(${margin}, ${margin})`);

// const svg = svg.append('g')
//   .attr('transform', `translate(${margin}, ${margin})`);


d3.csv("/pythonmmo/Resources/bar_df.csv", function (error, data) {
  if (error) throw error;

  data.forEach(function (d) {
    d.Age_Group = d.Age_Group;
    d.User_total = +d.User_total;
  });

  console.log(data);

  xScale.domain(data.map(function (d) { return d.Age_Group; }));
  yScale.domain([0, d3.max(data, function (d) { return d.User_total; })]);


  // const xScale = d3.scaleBand()
  //   .range([0, width])
  //   .domain(data.map((d) => d.Age_Group))
  //   .padding(0.1);


  // const yScale = d3.scaleLinear()
  //   .range([height, 0])
  //   .domain([0, d3.max(data, d => d.User_total)])

  const makeYLines = () => d3.axisLeft()
    .scale(yScale)

  svg.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  svg.append('g')
    .call(d3.axisLeft(yScale));

  svg.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )
  // // xScale.domain(data.map(function(d) {return d.Age_Group; }));

  const barGroups = svg.selectAll()
    .data(data)
    .enter()
    .append('g')

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(d.Age_Group))
    .attr('y', (d) => yScale(d.User_total))
    .attr('height', (d) => height - yScale(d.User_total))
    .attr('width', xScale.bandwidth())


  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2))
    .attr('y', width / 75 - 40)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Total Users')

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2)
    .attr('y', height + margin - 25)
    .attr('text-anchor', 'middle')
    .text('Age Groups')

  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', 3 - 10)
    .attr('text-anchor', 'middle')
    .text('Total Users by Age Group')

});