const pos = require('pos');
const express = require('express');
const bodyParser = require('body-parser');
const driver = require()

const app = express()
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json())

app.post('/document', (req, res) => {
  var {docName, docBody} = req.body

  console.log(req.body)
  console.log(docName, docBody)

  var words = new pos.Lexer().lex(docBody);
  var taggedWords = new pos.Tagger().tag(words);
  var arr = [];
  for (i in taggedWords) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];

    arr.push({word: word, tag: tag})
  }

  res.send({docName, docBody: arr})
})
  //recieve document in body as obj with document name, document body and username
  //check if document exists for that user
    //if it does, send back bad request
  //write to db passing through POS tagger
  //send back confirmation

app.get('/document', (req, res) => {})
  //retrieve document by document name and username from db
  //send back document as array (or linkedlist?)

app.post('/note', (req, res) => {})
  //recieve word, document name, note text and username in body
  //if note exists for this user and document, update the note text
  //if does not exist, create new note
  //send back confirmation

app.get('/notes', (req, res) => {})
  //receive a user and a document
  //send back all related notes in array

app.get('/documentsList', (req, res) => {})
  //recieve a username and a current document (optional)
  //if no current document
    //send back array of all document names
  //else 
    //send back array of all document names, except the current one

app.post('/user', (req, res) => {})
  //recieve username
  //if user exists 
    //send back bad request
  //else
    //create new user
    //send confirmation

app.get('/user', (req, res) => {})
  //recieve username
  //if user exists
    //send back a list of documents (or empty array if none)

app.listen(8080, ()=> {
  console.log('listening on port 8080')
})