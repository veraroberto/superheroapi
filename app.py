import pymongo
from flask import Flask, jsonify, render_template

app = Flask(__name__)


# 3. Define what to do when a user hits the index route
@app.route("/")
def home():

    return render_template("/index.html")


@app.route("/index.html")
def index():

    return render_template("/index.html")


@app.route("/radar.html")
def radar():
    return render_template("radar.html")


@app.route("/Comparatioindex.html")
def comparison():
    return render_template("Comparatioindex.html")


@app.route("/api")
def api():

    # Replace <password> with the password for the robertovera_db user.
    # Replace myFirstDatabase with the name of the database that connections will use by default.
    # Ensure any option params are URL encoded.

    # "mongodb+srv://robertovera_db:<password>@cluster0.g7ylf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

    password = "Ffu09ucvMbUB147Y"
    myFirstDatabase = "SuperHeroes"
    client_url = "mongodb+srv://robertovera_db:" + password + \
        "@cluster0.g7ylf.mongodb.net/" + myFirstDatabase + "?retryWrites=true&w=majority"

    myclient = pymongo.MongoClient(client_url)

    mydb = myclient.SuperHeroes

    mydoc = mydb["SuperHeroesJson"].find({})

    jsonHero = []
    for x in mydoc:
        del x['_id']
        jsonHero.append(x)

    return jsonify(jsonHero)


if __name__ == "__main__":
    app.run(debug=True)
