import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Reboot from 'material-ui/Reboot'
// import AppBar from 'material-ui/AppBar'
import AppBar from './components/appBar.jsx'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Toolbar from 'material-ui/Toolbar'
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {ExpansionPanelDetails,ExpansionPanelSummary} from 'material-ui/ExpansionPanel';
import { Close, ExpandMore } from 'material-ui-icons';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import DocumentBody from './components/paper.jsx'
import Tooltip from 'material-ui';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Riley',
      nameInpt: '',
      docInpt: '',
      docName: '',
      docList: [],
      text: [],
      // expanded: null
      notes: [],
      addNote: false,
      newNote: '',
      expanded: false
     }
     this.addDocument = this.addDocument.bind(this)
     this.handleChange = this.handleChange.bind(this)
     this.getDocument = this.getDocument.bind(this)
     this.changeDoc = this.changeDoc.bind(this)
     this.addNote = this.addNote.bind(this)
     this.postNote = this.postNote.bind(this)
     this.getNotes = this.getNotes.bind(this)
  }

  // handleChange(e, expanded) {
  //   console.log()
  //   this.setState({
  //     expanded: expanded ? expanded : false,
  //   });
  // };

  componentDidMount() {
    this.getDocumentList()
      .then(()=> this.getDocument(this.state.docList[0]))
      .then(()=> this.getNotes())
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changeDoc(e) {
    let value = e.target.value
    this.setState({
      docName: e.target.value,
    }, 
    ()=> {
      this.getDocument(value)
        .then(() => this.getNotes())
      } 
    );
  }

  addNote(word) {
    if (!this.state.notes.find(note => note.word === word)) {
      this.setState({addNote: word})
    } else {
      this.setState({expanded: word, addNote: false})
    }
  }

  postNote() {
    axios.post('/note', {
      username: this.state.username,
      docName: this.state.docName,
      word: this.state.addNote,
      note: this.state.newNote
    })
    .then(()=> {
      this.getNotes()
      this.setState({addNote: false})
    })
  }

  getNotes() {
    return axios.get('/notes', {params:{username: this.state.username, docName: this.state.docName}})
      .then(results => {
        console.log(results)
        this.setState({notes: results.data})
      })
  }

  getDocumentList() {
    return axios.get('/documentsList')
      .then(result => {
        this.setState({docList: result.data})
      })
      .then(()=> console.log(this.state.docList))
  }

  getDocument(docName) {
    return axios.get('/document', {params: {username: this.state.username, docName}})
      .then(results => this.setState({docName: docName, text: results.data}))
  }

  addDocument() {
    let docName = this.state.nameInpt

    axios.post('/document', {username: this.state.username, docName, docBody: this.state.docInpt})
      .then((data) => {
        this.getDocument(docName)
        this.getDocumentList()
      })
  }

  render() { 
    return ( 
      <div>
        <Reboot />
          <AppBar 
            username={this.state.username}
            docList={this.state.docList}
            docName={this.state.docName}
            handleChange={this.handleChange}
          />
          {/* <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit">
                Note Taking
              </Typography>

            </Toolbar>
          </AppBar> */}
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <TextField
                placeholder="Title"
                fullWidth={true}
                id="text-field-controlled"
                name="nameInpt"
                value={this.state.nameInpt}
                onChange={(e)=>this.handleChange(e)}
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="Document Body"
                fullWidth={true}
                id="text-field-controlled"
                name="docInpt"
                value={this.state.docInpt}
                onChange={(e)=>this.handleChange(e)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={this.addDocument} variant="raised" color="primary">Submit</Button>
            </Grid>
            <Grid item xs={8}>
              <DocumentBody 
                username={this.state.username}
                docList={this.state.docList}
                docName={this.state.docName}
                handleChange={this.changeDoc}
                text={this.state.text}
                addNote={this.addNote}
              />
            </Grid>
            <Grid item xs={4}>
                  {this.state.addNote ? 
                  <ExpansionPanel expanded={true} >
                    <ExpansionPanelSummary 
                      expandIcon={<Close onClick={()=> this.setState({addNote: false, newNote:''})}/>}
                      style={{cursor: 'auto'}}
                    >
                      <Typography component="h5" variant="title">{this.state.addNote.word}</Typography>
                      {/* <Typography color="textSecondary">{'(Part of Speach)' + this.state.addNote.tag}</Typography> */}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <TextField
                      fullWidth={true}
                      label="Note"
                      id="multiline-static"
                      multiline
                      rowsMax="50"
                      value={this.state.newNote}
                      name="newNote"
                      onChange={(e)=>this.handleChange(e)}
                      // className={classes.textField}
                      margin="normal"
                    />
                    </ExpansionPanelDetails>
                    <Button onClick={this.postNote} fullWidth={true} variant="raised" color="primary" style={{float: 'right'}}>Add</Button>
                  </ExpansionPanel> 
                  : <div></div>}
              {this.state.notes.map(note => {
                return (
                  <ExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                      <Typography>{note.word}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                        {note.note}
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                )
              })}
              
            </Grid>
          </Grid>
      </div>
     )
  }
}
 
ReactDOM.render(<App />, document.getElementById('app'));