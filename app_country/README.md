
# Country Report App   see here https://country-report.herokuapp.com/

This is  my country report app  see https://github.com/jurioste4/myprojects/tree/master/web_app  for the cleaning prossess and were I took the data from . 

Below is how I starte my app .. loading my dependcy 

```
import json
import plotly
import plotly.graph_objs as go
# import plotly.express as px
import numpy as np
from sqlalchemy import func
from sqlalchemy.ext.automap import automap_base
import pandas as pd
from flask import (
    Flask,
    render_template,
    jsonify)
from flask_sqlalchemy import SQLAlchemy

```
code below after I connet to the data base , I use automap_base to reflect the db class 
then createing a verable useing base to pull the data in the data base so I can use engion . execute for my query the infomation I need. 

```
app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/country.db"
db = SQLAlchemy(app)

Base = automap_base()
Base.prepare(db.engine, reflect=True)

country = Base.classes.country
results = db.engine.execute(
    'SELECT Year,country,UR,Growth,inflation,ER,Population FROM country')
df = pd.DataFrame(results, columns=[
    'Year', 'country', 'UR', 'Growth', 'inflation', 'ER', 'Population'])

usa = df[(df['country'] == 'usa')]
china = df[(df.country == 'china')]
uk = df[(df.country == 'uk')]
sing = df[(df.country == 'singapore')]
france = df[(df.country == 'france')]

```
Useing pandas load my  query to  a data frame defineing the colums I want to use 
then seprating  the data by countrys to use in my praphting this is all done before the first route . 
```
@app.route('/')
def index():

    graphs = [
        dict(
            data=[go.Bar(name='france', x=france["Year"], y=france["UR"]),
                  go.Bar(name='singapore', x=sing["Year"], y=sing["UR"]),
                  go.Bar(name='UK', x=uk["Year"], y=uk["UR"]),
                  go.Bar(name='USA', x=usa["Year"], y=usa["UR"]),
                  go.Bar(name='China', x=china.Year, y=china['UR']
                         )],
            layout=dict(barmode='group', title='US unemployment rate vs Four Top Countries',
                        yaxis=dict(title="Unemployment Rate"),
                        xaxis=dict(title="Year")
                        ),
        ),
        dict(
            data=[
                go.Bar(name='france', x=france["Year"], y=france["Growth"]),
                go.Bar(name='singapore', x=sing["Year"], y=sing["Growth"]),
                go.Bar(name='UK', x=uk["Year"], y=uk["Growth"]),
                go.Bar(name='USA', x=usa["Year"], y=usa["Growth"]),
                go.Bar(name='China', x=china.Year, y=china['Growth']

                       )],
            layout=dict(barmode='group', title='Growth % Five Top Countries',
                        yaxis=dict(title="Growth Percentage "),
                        xaxis=dict(title="Year")


                        )
        )
    ]

```
The code above is createing a basic plot in plotly but converting it in to a dict format to then render as an api along with the website as you can see the groupby I used for each country alows me to Create a Group bar graph compairing each country. 
```
    ids=['graph-{}'.format(i)for i, _ in enumerate(graphs)]

    graphJSON=json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html', ids=ids, graphJSON=graphJSON)


```
the code above converts each of the verable  I created for graphiing in to a Json format first then  renders it along with my index.html ..

```
{% for id in ids %}
    <h3>{{id}}</h3>
    <div id="{{id}}"></div>
    {% endfor %}
```
this code above is more of an anker point for the loop below since I created two bar graphs its going to render two IDs in the webpage .. 
```
 <script type="text/javascript">
        var graph = {{ graphJSON | safe}};
        var ids = {{ ids | safe}};

        for (var i in graph) {
            Plotly.plot(ids[i],
                graph[i].data,
                graph[i].layout || {});
        }
    </script>
```
this little bit if javaScript in the footer of the index.himl reading the graphJSON  flask is rendering  then a  for loop is just ploting each ID that it detects with in the json for mat .. 
