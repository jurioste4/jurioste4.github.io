import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

engine = create_engine('sqlite:///db/country.db', echo=False)

Base = automap_base()
Base.prepare(engine, reflect=True)

Usa = Base.classes.usa
singapore = Base.classes.singapore

session = Session(engine)


app = Flask(__name__)



@app.route("/")
def home():
   """Home Page """
   return render_template("index.html")



@app.route("/data")
def data():
    results = db.session.query(country).all()

    all_countrys = []
    for countrys in results:
        country_dict = {}
        country_dict["Year"]  = countrys.Year
        country_dict["GDP"] = countrys.GDP
        country_dict["Growth"] = countrys.Growth
        country_dict["Inflation"] = countrys.Inflation
        country_dict["UR"] = countrys.UR
        country_dict["ER"] = countrys.ER
        country_dict["Population"] = countrys.Population
        country_dict["Avg_age_population"] = countrys.Avg_age_population
        country_dict["country"]  = countrys.country
        all_countrys.append(country_dict)

    return jsonify(all_countrys)

if __name__ == '__main__':
    app.run(debug=True)