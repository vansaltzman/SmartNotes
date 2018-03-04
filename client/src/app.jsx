import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ScrollTo from 'scroll-into-view-if-needed'
import Reboot from 'material-ui/Reboot'
// import AppBar from 'material-ui/AppBar'
import AppBar from './components/appBar.jsx'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Toolbar from 'material-ui/Toolbar'
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {ExpansionPanelDetails,ExpansionPanelSummary} from 'material-ui/ExpansionPanel';
import { Close, ExpandMore, Send, Edit } from 'material-ui-icons';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import DocumentBody from './components/paper.jsx'
import Tooltip from 'material-ui/Tooltip';
import GridList from 'material-ui/GridList'
import PosIcon from 'material-ui-icons/Label'
import Slide from 'material-ui/transitions/Slide'
import Divider from 'material-ui/Divider'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton'
import { LinearProgress } from 'material-ui/Progress'

const posColor = {
  CC: '#adaaaa',
  IN: '#adaaaa',
  TO: '#adaaaa',
  DT: '#adaaaa',
  NN: '#d6e22c',
  NNS: '#d6e22c',
  POS: '#d6e22c',
  PP$: '#d6e22c',
  PRP: '#d6e22c',
  WP: '#d6e22c',
  WP$: '#d6e22c',
  VB: '#2cac36',
  VBD: '#2cac36',
  VBG: '#2cac36',
  VBN: '#2cac36',
  VBP: '#2cac36',
  VZ: '#2cac36',
  NNP: '#8f21c2',
  NNPS: '#8f21c2'
}

//Prevents main app from scrolling
document.body.scroll = "no";
document.body.style.overflow = 'hidden';
document.height = window.innerHeight;
document.width = window.innerWidth;

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
      expanded: false,
      docBodyHeight: window.innerHeight * 0.75,
      badNoteAttempt: false,
      showDocInput: false,
      tutorial: false,
      editNote: false,
      editNoteInpt: '',
      showFilters: false,
     }
     this.addDocument = this.addDocument.bind(this)
     this.handleChange = this.handleChange.bind(this)
     this.getDocument = this.getDocument.bind(this)
     this.changeDoc = this.changeDoc.bind(this)
     this.addNote = this.addNote.bind(this)
     this.postNote = this.postNote.bind(this)
     this.getNotes = this.getNotes.bind(this)
     this.changePannel = this.changePannel.bind(this)
     this.showDocInput = this.showDocInput.bind(this)
     this.toggleFilters = this.toggleFilters.bind(this)
  }

  componentDidMount() {
    this.getDocumentList()
      .then(()=> this.getDocument(this.state.docList[0]))
      .then(()=> this.getNotes())
      .then(()=> {
        if (this.state.docList.length < 1) this.setState({showDocInput: true, tutorial: true})
        else this.setState({docBodyHeight: document.getElementById('docBody').offsetHeight})
      })
  }

  handleChange(e) {
    console.log(e.target.name, e.target.value)
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  changePannel (expanded, panel) {
    this.setState({
      expanded: !expanded ? panel : false,
    }, () => {
      if (!expanded) {
        // let scroll = ()=> this[panel].scrollIntoView({block: 'start', behavior: 'smooth'})
        // setTimeout(scroll, 100)
        let target = this[panel] || this._top
        ScrollTo(target, {boundary:this.notesList, centerIfNeeded: true, easing: 'easeOut', duration: 200})
      }
    })
  };

  toggleFilters() {
    console.log(this.state.showFilters)
    this.setState({showFilters: !this.state.showFilters})
  }

  showDocInput() {
    this.setState({showDocInput: !this.state.showDocInput})
  }

  changeDoc(e) {
    if (e.target.value === '_newDoc') {
      this.showDocInput()
    } else {
      let value = e.target.value
      this.setState({docName: e.target.value},
      () => {
        this.setState({docBodyHeight: document.getElementById('docBody').offsetHeight}, 
        ()=> {
          this.getDocument(value)
            .then(() => this.getNotes())
          } 
        );
      }
    )
    }
  }

  editNote(wordObj) {
    axios.post('/note', {
      username: this.state.username,
      docName: this.state.docName,
      word: wordObj,
      note: this.state.editNoteInpt
    })
    .then(()=> {
      this.getNotes()
      this.setState({editNote: false}, ()=> {
        this.setState({editNoteInpt: ''})
      })
    })
  }

  addNote(word) {
    if (word.word === this.state.addNote.word || word.word === this.state.expanded) {
      this.setState({addNote: false, expanded: false, badNoteAttempt: false})
    }
    else if (!this.state.notes.find(note => note.word === word.word)) {
      this.setState({addNote: word, expanded: false, badNoteAttempt: false},  
      ()=> {
        // let scroll = () => this._top.scrollIntoView({block: 'start', behavior: 'smooth'})
        // setTimeout(scroll, 50)
        console.log(this[word.word])
        ScrollTo(this._top, {boundary:this.notesList, centerIfNeeded: true, easing: 'easeOut', duration: 200})
      })
    } else {
      this.setState({expanded: word.word, addNote: false, badNoteAttempt: false}, 
      ()=> {
        if (this.hasOwnProperty(word.word)) {
          // let scroll = () => this[word.word].scrollIntoView({block: 'start', behavior: 'smooth'})
          // setTimeout(scroll, 200)
          console.log(this[word.word])
          ScrollTo(this[word.word], {boundary:this.notesList, centerIfNeeded: true, easing: 'easeOut', duration: 200})
        }
      })
    }
  }

  postNote() {
    if (this.state.newNote !== '') {
      axios.post('/note', {
        username: this.state.username,
        docName: this.state.docName,
        word: this.state.addNote,
        note: this.state.newNote
      })
      .then(()=> {
        this.getNotes()
        this.setState({addNote: false, badNoteAttempt: false}, ()=> {
          this.setState({newNote: ''})
        })
      })
    } else {
      this.setState({badNoteAttempt: true})
      this.noteInput.focus()
    }
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
      .then(results => {
        this.setState({docName: docName, text: results.data})
      })
  }

  addDocument() {
    let docName = this.state.nameInpt
    this.setState({loading: true}, ()=> {
      setTimeout(()=> {
      axios.post('/document', {username: this.state.username, docName, docBody: this.state.docInpt})
        .then((data) => {
            this.getDocument(docName)
            this.getDocumentList()
            this.getNotes()
            this.setState({tutorial: false})
          })
          .then(()=> {
            this.showDocInput()
            this.setState({loading: false})
          })
        }, 1000)
    })
  }

  render() {
    
    const styles = {
      root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
      textField: {
        padding: '10px'
      },
      expanded: {
        marginRight: '30px'
      }
    };
    
    return ( 
      <div>
        <Reboot />
          <AppBar 
            username={this.state.username}
            docList={this.state.docList}
            docName={this.state.docName}
            handleChange={this.handleChange}
            style={{maxWidth: '100%'}}
          />
          <Grid container spacing={24}  style={{maxWidth: '100%' , marginTop: '16px'}}>
            <Grid item xs={8}>
            <Slide direction="down" in={this.state.showDocInput} mountOnEnter unmountOnExit>
              <div style={{marginBottom: '48px'}}>
                <Paper className="paper" style={{marginBottom: '24px'}}>
                  <Typography variant="headline" component="h2">
                  <TextField
                    label="Title"
                    fullWidth={true}
                    id="text-field-controlled"
                    name="nameInpt"
                    value={this.state.nameInpt}
                    onChange={(e)=>this.handleChange(e)}
                  />
                  </Typography>
                  <Typography gutterBottom={true} align="left" variant="title" paragraph={true}>
                    <TextField
                      InputProps={{disableUnderline: true}}
                      label="Document Body"
                      fullWidth={true}
                      id="text-field-controlled"
                      name="docInpt"
                      multiline
                      rows={15}
                      rowsMax={15}
                      value={this.state.docInpt}
                      onChange={(e)=>this.handleChange(e)}
                    />
                  </Typography>
                  <Button style={{width: '49%'}} onClick={this.showDocInput} variant="raised" color="secondary">Cancel</Button>
                  <Button style={{width: '49%', float: 'right'}} disabled={this.state.docInpt === '' || this.state.nameInpt === ''} onClick={this.addDocument} variant="raised" color="primary">Add</Button>
                  {this.state.loading && <LinearProgress style={{margin: '10px 0 10px 0'}} />}
                </Paper>
              </div>
            </Slide>
              <DocumentBody 
                id="docBody"
                username={this.state.username}
                docList={this.state.docList}
                docName={this.state.docName}
                handleChange={this.changeDoc}
                text={this.state.text}
                addNote={this.addNote}
                selected={this.state.expanded}
                posColor={posColor}
                showDocInput = {this.showDocInput}
                changeDoc = {this.changeDoc}
                toggleFilters = {this.toggleFilters}
                showFilters = {this.state.showFilters}
              />
            </Grid>
            <Grid item xs={4}>
                {this.state.tutorial ? 
                <Slide timeout={{ enter: 80, exit: 150}} direction="left" in={true} mountOnEnter unmountOnExit>
                <ExpansionPanel style={{marginRight: '30px'}} expanded={true} >
                  <ExpansionPanelSummary style={{cursor: 'auto'}}>
                    <Typography component="h5" variant="title">Add your first document!</Typography>
                    {/* <Typography color="textSecondary">{'(Part of Speach)' + this.state.addNote.tag}</Typography> */}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography component="p">
                      Note taker is designed to help you not repeat yourself when notetaking and easily remember things!
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel> 
                </Slide>
                :
                <Slide timeout={{ enter: 80, exit: 150}} direction="left" in={this.state.addNote} mountOnEnter unmountOnExit>
                  <ExpansionPanel style={{marginRight: '30px'}} expanded={true} >
                    <ExpansionPanelSummary 
                      expandIcon={<Close onClick={()=> this.setState({addNote: false, newNote:'', badNoteAttempt: false})}/>}
                      style={{cursor: 'auto'}}
                    >
                      <Typography component="h5" variant="title">{this.state.addNote.word}</Typography>
                      {/* <Typography color="textSecondary">{'(Part of Speach)' + this.state.addNote.tag}</Typography> */}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <TextField
                      autoFocus={true}
                      fullWidth={true}
                      helperText={this.state.badNoteAttempt && this.state.newNote === '' ? 'Note must not be empty' : ' '}
                      id="multiline-static"
                      multiline
                      inputRef={(input) => this.noteInput = input}
                      rowsMax="50"
                      value={this.state.newNote}
                      name="newNote"
                      onChange={(e)=>this.handleChange(e)}
                      margin="normal"
                    />
                    </ExpansionPanelDetails>
                    <Button onClick={this.postNote} fullWidth={true} variant="raised" color="primary">Add</Button>
                  </ExpansionPanel> 
                  </Slide>}
                <GridList 
                  style={{
                    height: this.state.addNote ? ((this.state.docBodyHeight) - 220) : (this.state.docBodyHeight)}} 
                  cols={1} 
                  component="div"
                  ref={(list) => this.notesList = list}
                  cellHeight={(this.state.docBodyHeight)}>
                <div>
                 <div style={{margin: '0 0 0 0', padding: '0 0 0 0'}} ref={(top) => this._top = top}></div>
                  {this.state.notes.map((note, i) => {
                    return (
                      <div key={i} style={this.state.expanded === note.word ? {margin: '12px 0 12px 0'} : {margin: '1px 0 1px 0'}} ref={(word) => this[note.word] = word}>
                      <ExpansionPanel
                          expanded={this.state.expanded === note.word} 
                          elevation={this.state.expanded === note.word ? 4 : 1}
                          onChange={(e)=>  this.changePannel((this.state.expanded === note.word), note.word)}
                          style={{marginRight: '30px'}}
                        >
                          <ExpansionPanelSummary 
                           expandIcon={<ExpandMore />}>
                            <PosIcon style={{color: posColor[note.tag] || '#4258d1'}}/>
                            <Typography component="h5" variant="title">{note.word}</Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            <PosIcon style={{color: posColor[note.tag] || '#4258d1', margin: '3px 10px 0 2px'}}/>
                            <Typography component="h3" variant="title" style={{fontSize:"24px"}} >{note.word}</Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            {this.state.editNote === note.word ? 
                            <Input
                              type={'text'}
                              autoFocus={true}
                              fullWidth={true}
                              id="multiline-static"
                              multiline
                              rowsMax="50"
                              name="editNoteInpt"
                              value={this.state.editNoteInpt}
                              onChange={(e)=>this.handleChange(e)}
                              margin="normal"
                              style={{marginLeft: '10px'}}
                              endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={()=>this.setState({editNoteInpt: '', editNote: false})}
                                >
                                  <Close />
                                </IconButton>
                                {(this.state.editNoteInpt !== note.note) && 
                                <IconButton
                                  onClick={()=>this.editNote({word: note.word, tag: note.tag})}
                                >
                                  <Send />
                                </IconButton>}
                              </InputAdornment>
                              }
                            />
                            :
                            <Tooltip enterDelay={50} id="tooltip-right-start" title="Double-click to edit" placement="top">
                              <Typography 
                                paragraph={true} 
                                variant="subheading" 
                                style={{ lineHeight: 'normal', whiteSpace: 'pre-line' ,margin: '3px 0 0 10px'}} 
                                onDoubleClick={()=> {
                                  console.log(JSON.stringify(note.note))
                                  this.setState({editNote: note.word, editNoteInpt: note.note})}
                                }>
                                  {note.note}
                              </Typography>
                            </Tooltip>
                            }
                            {/* <Typography variant="caption">
                              This is where stats would go
                            </Typography> */}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </div>
                    )
                  })}
                  <div style={{height: '20px'}}></div>
                </div>
                </GridList>
            </Grid>
          </Grid>
      </div>
     )
  }
}
 
ReactDOM.render(<App />, document.getElementById('app'));