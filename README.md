# SmartNotes
Note taking application to help readers remember relevant information by having identical words share a single note

Adding a new document (Click to see video)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=https://youtu.be/GasnlmSD33c
" target="_blank"><img src="https://img.youtube.com/vi/GasnlmSD33c/0.jpg" 
alt="Document Creation" width="240" height="180" border="10" /></a>

Creating notes inside of a document (Click to see video)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=https://youtu.be/sYvRPyYlR3M
" target="_blank"><img src="https://img.youtube.com/vi/sYvRPyYlR3M/0.jpg" 
alt="Note Taking" width="240" height="180" border="10" /></a>

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Using Neo4j](#neo4j)
    1. [Roadmap](#roadmap)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

### Running Locally
Your machine will need to run Neo4j either through the command line or via the desktop client.

Ensure that Neo4j is running

```sh
npm run server-dev
npm run react-dev
```

Navigate to localhost:8080 or the appropriate port. 

See [useful queries](#neo4j) for ways to manipulate the database through the Neo4j client

## Requirements

Must have Neo4j Browser/Client for running the database localy

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
Create a new project/database using the Neo4j client
```
### Neo4j

How data looks inside of the database. 

Note that each unique word has just one node that is shared within and across all documents. This pattern allows for NLP and analytics to be performed using Cypher and Neo4j. Right now only word count is being performed, but more in depth analysis could be performed to gain more nuanced insights such as longest common phrase, most frequent words following a given word, etc.  

![Neo4j Graph](https://i.imgur.com/nJjnWYk.png)

- Users own documents
- Documents point to their first word
- Each word points to it's next word
    - the NEXT relationship includes the User, Document and Position
- Notes point from a user to a word (not shown)
    - The NOTE relationship includes the note text, User, and Document

 Here are some useful queries for this project using the Cypher query language:

 Return Everything

```sh
MATCH (n)
RETURN n
```

Delete Everything

```sh
MATCH (n)
OPTIONAL MATCH (n)-[r]-()
DELETE n, r
```

Select/Create User

```sh
MERGE (u:User{name: 'Riley'})
```
    
Create Document

```sh
MATCH (u:User{name: 'Riley'})
WITH u
MERGE (u) -[:OWNS]-> (d:Document{name: 'War and Peace'})
WITH split("This is a test document", " ") AS text, d, u
UNWIND range(0,size(text)-2) AS i
MERGE (w1:Word {name: text[i]})
MERGE (w2:Word {name: text[i+1]})
MERGE (w1)-[:NEXT{doc: d.name, position: i+1}]->(w2)
WITH  text, d
MATCH (w:Word {name: text[0]})
WITH text, d, w
MERGE (d)-[:NEXT{doc: d.name, position: 0}]->(w)
```
                                                     
### Roadmap

Improvements/Fixes:
 - Improve text highlighting
 - Allow for multiline documents including whitespace (paragraphs, tabs, etc.)
 - Refine animations and scrolling

Desired Features:
 - More text and language analysis
 - Document visualizer (d3)
 - Wikipedia and dictionary links in notes
 - Export to PDF or text document

## Contributing

Please contact me through github about contributing to this project or if your are working on something similar :) 

