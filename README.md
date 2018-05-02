# SmartNotes
Note taking application to help readers remember relevant information by having the identical words share a single note

Video of adding a new document

<a href="http://www.youtube.com/watch?feature=player_embedded&v=https://youtu.be/GasnlmSD33c
" target="_blank"><img src="https://img.youtube.com/vi/GasnlmSD33c/0.jpg" 
alt="Document Creation" width="240" height="180" border="10" /></a>

Video of adding notes inside of a document

<a href="http://www.youtube.com/watch?feature=player_embedded&v=https://youtu.be/sYvRPyYlR3M
" target="_blank"><img src="https://img.youtube.com/vi/sYvRPyYlR3M/0.jpg" 
alt="Note Taking" width="240" height="180" border="10" /></a>

![Neo4j Graph](https://i.imgur.com/nJjnWYk.png)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Using Neo4j](#useful-queries)
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

See [useful queries](#Useful Queries) for ways to manipulate the database through the Neo4j client

## Requirements

Must have Neo4j Browser/Client for running the database localy

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
Create a new database in Neo4j
```
### Useful Queries

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

