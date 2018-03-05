const pos = require('pos');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db')

const app = express()
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())

app.post('/document', (req, res) => {
  var {docName, docBody, username} = req.body

  var words = new pos.Lexer().lex(docBody);
  var taggedWords = new pos.Tagger().tag(words);
  var arr = [];
  for (i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0].replace('-', '')
    var tag = taggedWord[1];

    if (word === ';') console.log(word, tag)

    arr.push([word, tag])
  }

  db.addDocument(username, docName, arr)
    .then(results => res.send(results))
    .catch(err => res.status(500).send())
})

app.get('/document', (req, res) => {
  var {username, docName} = req.query

  db.getDocument(username, docName)
    .then(result => {
      let transformed = result.records.map((item, i) => ({word:item._fields[0], tag:item._fields[1], position: i}))
      res.send(transformed)
    })
})

app.post('/note', (req, res) => {
  console.log(req.body)
  var {username, docName, word, note} = req.body

  db.addNote(username, docName, word.word, note, word.tag)
    .then(result => res.send(result))
})

app.get('/notes', (req, res) => {
  var {username, docName} = req.query

  db.getNotes(username, docName)
    .then(result => res.send(result.records.map(item => ({word: item._fields[0], tag: item._fields[1], note: item._fields[2]}))))
})

app.get('/documentsList', (req, res) => {
  //recieve a username and a current document (optional)
  var {username} = req.query
  //send back array of all document names
  db.getDocumentList(username)
    .then(result => {
      let transformed = result.records.map(item => (item._fields[0]))
      res.send(transformed)
    })
})

app.post('/user', (req, res) => {
 var {username} = req.body

 db.addUser(username)
 .then(result => res.send(result))
})

app.get('/user', (req, res) => {
  //recieve username
  //if user exists
    //send back a list of documents (or empty array if none)
})

app.listen(8080, ()=> {
  console.log('listening on port 8080')
})