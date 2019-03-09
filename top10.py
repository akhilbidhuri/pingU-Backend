from flask import Flask
from flask import request
from pprint import pprint
from pymongo import MongoClient
from textblob import TextBlob
import json

client = MongoClient('localhost', 27017)
db = client.mydb
import json
app = Flask(__name__)

@app.route('/count',methods = ['POST'])
def counter():
    collection = db.coreal
    gid = request.form['gid']
    array = collection.find({"group": gid})
    for a in array:
        print(a)
    s = "this is a sample sentence showing off the stop words . remember this is just a sample sentence Sorted dict keys are maintained in sorted order. The design of sorted dict is simple: sorted dict inherits from dict to store items and maintains a sorted list of keys. Now if we use reciprocal for this word, it would certainly be close to 1 but again does not tell us about the context"
    from collections import OrderedDict
    from nltk.corpus import stopwords
    word = stopwords.words('english')
    D = {}
    for w in s.split():
        if w not in word:
            D[w]=D.get(w,0)+1
    L=[]
    for k,v in D.items():
        L.append((v,k))
    L=sorted(L,reverse=True) 
    print(L)
    if len(L)<10:
        return(json.dumps(L))
    else:
        return(json.dumps(L[:10]))


@app.route('/sentiment',methods = ['POST'])
def sentiment():
    s = request.form['message']
    polarity=TextBlob(s).sentiment.polarity
    if polarity>0:
        polarity="Positive"
    elif polarity<0:
        polarity="Negative"
    else:
        polarity="Neutral"
    return json.dumps({'statusCode': 200,'body': polarity})