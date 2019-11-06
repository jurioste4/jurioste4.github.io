d3.csv("/Resources/gender.csv", function ( data){
    
    // console.log(data);

    
   
    data.forEach(function (d){
        d.Gender = d.Gender;
        d.subscribers = +d.subscribers;
        d.PC = +d.PC;
        d.revenue = +d.revenue;
    });


    d3.select("tbody")
    .selectAll("tr") //virtual selection
    .data(data)
    .enter()
    .append("tr")
    .html(function (d) {
        return `<td>${d.Gender}</td><td>${d.subscribers}</td><td>${d.PC}</td><td>${d.revenue}</td>`;
    });
    
});