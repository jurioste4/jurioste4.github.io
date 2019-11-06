var Gdata=['this is tvdata at start point'];


d3.csv(".Resources/gender_plot.csv, function(error, Gdata) {
    if (error) return console.warn(error);
  
    console.log(Gdata);
  
    // log a list of names
    var Gender = Gdata.map(data => data.Gender);
    // var names = tvData.map(data => data.name);
    console.log("Gender", Gender);
  
    // Cast each hours value in tvData as a number using the unary + operator
    Gdata.forEach(function(data) {
      data.revenew = +data.revenew;
      console.log("Gender:", data.Gender);
      console.log("revenew:", data.revenew);
    });
    outsidelist=Gender;
    var Gdata1=Gdata;
  });
  console.log('run at end',Gdata);
  