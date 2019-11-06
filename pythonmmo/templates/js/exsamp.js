const ageplot = [
    {
        ageGroup: '<10',
        value: 3.08,
        color: '#000000'
    },
    {
        ageGroup: '10-14',
        value: 1.92,
        color: '#00a2ee'
    },
    {
        ageGroup: '15-19',
        value: 13.72,
        color: '#fbcb39'
    },
    {
        ageGroup: '20-24',
        value: 33.08,
        color: '#007bc8'
    },
    {
        ageGroup: '25-29',
        value: 9.87,
        color: '#65cedb'
    },
    {
        ageGroup: '30-34',
        value: 6.67,
        color: '#ff6e52'
    },
    {
        ageGroup: '35-39',
        value: 4.87,
        color: '#f9de3f'
    },
    {
        ageGroup: '40+',
        value: 0.64,
        color: '#5d2f8e'
    },
    
];







const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 600 - 2 * margin;
const height = 500 - 2 * margin;

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(ageplot.map((a) => a.ageGroup))
    .padding(0.4)

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 35]);



const makeYLines = () => d3.axisLeft()
    .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));



chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )

const barGroups = chart.selectAll()
    .data(ageplot)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.ageGroup))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    // .on('mouseenter', function (actual, i) {
    //     d3.selectAll('.value')
    //         .attr('opacity', 0)

    //     d3.select(this)
    //         .transition()
    //         .duration(300)
    //         .attr('opacity', 0.6)
    //         .attr('x', (a) => xScale(a.ageGroup) - 5)
    //         .attr('width', xScale.bandwidth() + 10)

    //     const y = yScale(actual.value)

    //     line = chart.append('line')
    //         .attr('id', 'limit')
    //         .attr('x1', 0)
    //         .attr('y1', y)
    //         .attr('x2', width)
    //         .attr('y2', y)

    //     barGroups.append('text')
    //         .attr('class', 'divergence')
    //         .attr('x', (a) => xScale(a.ageGroup) + xScale.bandwidth() / 2)
    //         .attr('y', (a) => yScale(a.value) + 30)
    //         .attr('fill', 'blue')
    //         .attr('text-anchor', 'middle')
    //         .text((a, idx) => {
    //             const divergence = (a.value - actual.value).toFixed(1)

    //             let text = ''
    //             if (divergence > 0) text += '+'
    //             text += `${divergence}%`

    //             return idx !== i ? text : '';
    //         })

    // })
    // .on('mouseleave', function () {
    //     d3.selectAll('.value')
    //         .attr('opacity', 1)

    //     d3.select(this)
    //         .transition()
    //         .duration(300)
    //         .attr('opacity', 1)
    //         .attr('x', (a) => xScale(a.ageGroup))
    //         .attr('width', xScale.bandwidth())

    //     chart.selectAll('#limit').remove()
    //     chart.selectAll('.divergence').remove()
    // })

// barGroups
//     .append('text')
//     .attr('class', 'value')
//     .attr('x', (a) => xScale(a.ageGroup) + xScale.bandwidth() / 2)
//     .attr('y', (a) => yScale(a.value) + 30)
//     .attr('text-anchor', 'middle')
//     .text((a) => `${a.value}%`)

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Love meter (%)')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('ageGroups')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Most loved programming ageGroups in 2018')

