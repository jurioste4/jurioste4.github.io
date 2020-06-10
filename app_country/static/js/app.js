var defaultURL = "usa";
d3.json(defaultURL).then(function(data) {
    var data =[data]
    var layout = {margin: {t:30, b: 100} };
    Ploty.plot("bar", data, layout);
});