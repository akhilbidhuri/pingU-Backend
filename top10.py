from flask import Flask
from flask import request
from pprint import pprint
from pymongo import MongoClient
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from string import punctuation
from nltk.probability import FreqDist
from heapq import nlargest
from collections import defaultdict
from flask_cors import CORS,cross_origin
import json

client = MongoClient('localhost', 27017)
db = client.mydb
print(db)
import json
app = Flask(__name__)
CORS(app, resources=r'/*')

#app.config['CORS_HEADERS'] = 'Content-Type'

from textblob import TextBlob
@app.route('/',methods = ['POST'])
@cross_origin(origin='*')
def helloWorld():
  return "Hello, cross-origin-world!"


@app.route('/count',methods = ['POST'])
@cross_origin(origin='*')
def counter():
    dbname = request.form['company']
    print(request.form)
    print(dbname)
    collection = db[dbname]
    print(collection)
    gid = request.form['gid']
    array = collection.find({"gid": gid})
    print("check now")
    s=[]
    for a in array:
        for w in a['message'].split(" "):
            s.append(w)
    #s = "this is a sample sentence showing off the stop words . remember this is just a sample sentence Sorted dict keys are maintained in sorted order. The design of sorted dict is simple: sorted dict inherits from dict to store items and maintains a sorted list of keys. Now if we use reciprocal for this word, it would certainly be close to 1 but again does not tell us about the context"
    from collections import OrderedDict
    from nltk.corpus import stopwords
    word = stopwords.words('english')
    print(s)
    D = {}
    for w in s:
        if w not in word:
            D[w]=D.get(w,0)+1
    L=[]
    for k,v in D.items():
        L.append((v,k))
    L=sorted(L,reverse=True) 
    print(L)
    if len(L)<10:
        return(json.dumps({"words":L}))
    else:
        return(json.dumps({"words":L[:10]}))
    return(json.dumps({"words":"WRONG REQUEST BHASKAR "}))


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

def sanitize_input(data):
    replace = {
        ord('\f') : ' ',
        ord('\t') : ' ',
        ord('\n') : ' ',
        ord('\r') : None
    }
    return data.translate(replace)

def tokenize_content(content):
    stop_words = set(stopwords.words('english') + list(punctuation))
    words = word_tokenize(content.lower())    
    return [
        sent_tokenize(content),
        [word for word in words if word not in stop_words]    
    ]

def score_tokens(filterd_words, sentence_tokens):
    word_freq = FreqDist(filterd_words)
    ranking = defaultdict(int)
    for i, sentence in enumerate(sentence_tokens):
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                ranking[i] += word_freq[word]
    return ranking
def summarize(ranks, sentences):
    k = int(len(sentences)*0.4)
    if k==0:
        k=1
    indexes = nlargest(k, ranks, key=ranks.get)
    final_sentences = [sentences[j] for j in sorted(indexes)]
    return ' '.join(final_sentences)

@app.route('/summarize',methods = ['POST'])
def summarizer():
    content = request.form['message']
    content = sanitize_input(content)
    sentence_tokens, word_tokens = tokenize_content(content)  
    sentence_ranks = score_tokens(word_tokens, sentence_tokens)
    return json.dumps(summarize(sentence_ranks, sentence_tokens))

app.run(host='0.0.0.0')