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

    ids=['graph-{}'.format(i)for i, _ in enumerate(graphs)]

    graphJSON=json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)

    return render_template('layouts/index.html', ids=ids, graphJSON=graphJSON)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9999)
