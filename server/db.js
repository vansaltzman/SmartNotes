const neo4j = require('neo4j-driver').v1
const {uri, user, pass} = require('./config')

const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));
const session = driver.session();

function addUser(username) {
  var session = driver.session()
  return session

  .run(
    `MERGE (u:User{name: "${username}"})`
  )
  .then(result => {
    session.close();
    console.log('add user')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
} 

function addDocument(username, docName, docBody) {
  var session = driver.session()
  return session
  
  .run(
    `MATCH (u:User{name: '${username}'})
    WITH u
    MERGE (u) -[:OWNS]-> (d:Document{name: '${docName}'})
    WITH ${JSON.stringify(docBody)} AS text, d, u
    UNWIND range(0,size(text)-2) AS i
    MERGE (w1:Word {name: text[i][0], pos:text[i][1]})
    MERGE (w2:Word {name: text[i+1][0], pos:text[i+1][1]})
    MERGE (w1)-[:NEXT{doc: d.name, position: i+1}]->(w2)
    WITH  text, d
    MATCH (w:Word {name: text[0][0], pos: text[0][1]})
    WITH text, d, w
    MERGE (d)-[:NEXT{doc: d.name, position: 0}]->(w)`
  )
  .then(result => {
    session.close();
    console.log('add Document')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
} 

function getDocument(username, docName) {
  //Not currently using username
  var session = driver.session()
  return session
  
  .run(
    `MATCH ()-[r:NEXT{doc:'${docName}'}]->(w:Word)
    RETURN w.name, w.pos, r.position ORDER BY r.position`
  )
  .then(result => {
    session.close();
    console.log('get Document')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
} 

function getDocumentList(username) {
  //Not currently using username
  var session = driver.session()
  return session
  
  .run(
  `MATCH (u:User{name: 'Riley'})-[:OWNS]->(d:Document)
  RETURN d.name`
  )
  .then(result => {
    session.close();
    console.log('get Doc List')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
}

function addNote(username, docName, word, note) {
  var session = driver.session()
  return session

  .run(
  `MATCH (u:User{name: '${username}'})-[:OWNS]->(d:Document{name: '${docName}'})
  MATCH (w:Word{name: '${word}'})
  WITH u, d, w
  MERGE (u)-[r:NOTE{doc: d.name}]->(w)
  WITH r
  SET r.text = '${note}'`
  )
  .then(result => {
    session.close();
    console.log('add Note')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
}

function deleteNote(username, docName, word) {
  var session = driver.session()
  return session

  .run(
  `MATCH (u:User{name: '${username}'})-[:OWNS]->(d:Document{name: '${docName}'})
  MATCH (w:Word{name: '${word}'})
  WITH u, d, w
  MERGE (u)-[r:NOTE{doc: d.name}]->(w)
  WITH r
  DELETE r`
  )
  .then(result => {
    session.close();
    console.log('delete Note')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
}

function getNotes(username, docName) {
  var session = driver.session()
  return session

  .run(
  `MATCH (u:User{name: '${username}'})-[r:NOTE{doc: '${docName}'}]->(w:Word)
  RETURN w.name, w.pos, r.text, r.doc`
  )
  .then(result => {
    session.close();
    console.log('get Notes')
    return result
  })
  .catch(err => {
    session.close();
    console.log(err)
  });
}

module.exports = {
  addUser,
  addDocument,
  getDocument,
  getDocumentList,
  addNote,
  deleteNote,
  getNotes
}