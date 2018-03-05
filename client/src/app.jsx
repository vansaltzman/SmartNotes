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
import { ContentCopy, PersonAdd, Close, ExpandMore, Send, Edit } from 'material-ui-icons';
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
import { FormHelperText } from 'material-ui/Form';
import List, { ListItem, ListItemSecondaryAction, ListItemIcon, ListItemText } from 'material-ui/List'
import examples from './examples.js'
import StatsList from './components/statsList.jsx'
import { Stats } from 'fs';

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
      username: false,
      loginInpt: '',
      nameInpt: '',
      docInpt: '',
      docName: '',
      docList: [],
      text: [],
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
     this.handleUser = this.handleUser.bind(this)
     this.getWordCount = this.getWordCount.bind(this)
  }

  componentDidMount() {
    if (this.state.username) {
      this.getDocumentList()
        .then(()=> this.getDocument(this.state.docList[0]))
        .then(()=> this.getNotes())
        .then(()=> {
          if (this.state.docList.length < 1) this.setState({showDocInput: true, tutorial: true})
          else this.setState({docBodyHeight: document.getElementById('docBody').offsetHeight})
        })
    }
  }

  handleUser(username) {
    this.setState({username: username, loginInpt: ''}, ()=> {
      console.log('getting stuff for ', this.state.username)
      if (username) {
        this.addUser()
        .then(()=> this.getDocumentList())
        .then(()=> this.getDocument(this.state.docList[0]))
        .then(()=> this.getNotes())
        .then(()=> {
          if (this.state.docList.length < 1) this.setState({showDocInput: true, tutorial: true})
          else this.setState({docBodyHeight: document.getElementById('docBody').offsetHeight, showDocInput: false, tutorial: false})
          console.log(this.state.showDocInput, '<<<<')
        })
      }
    })
  }

  addUser() {
    return axios.post('/user', {username: this.state.username})
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
    console.log(this.state.username)
    return axios.get('/documentsList', {params: {username: this.state.username}})
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
          .catch(()=> {
            this.setState({loading: false})
          })
        }, 1000)
    })
  }

  getWordCount (username, docName, word) {
   return axios.get('/wordCount', {params: {username, docName, word}})
      .then((result)=> {
        return result.data.count
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

    if (this.state.username === '' || !this.state.username) {
     return( 
     <div>
        <Reboot />
          <AppBar 
            username={false}
            style={{maxWidth: '100%'}}
            handleUser={this.handleUser}
          />
          <Paper style={{width: '400px', height: '300px', position: 'absolute', top :0, bottom: 0, left: 0, right: 0, margin: 'auto'}} className="paper">
            <Grid container direction="column" spacing={24} justify="center" alignItems="center" style={{maxWidth: '100%' , marginTop: '16px'}}>
              <Grid item xs={10}>
              <Typography align="center" variant="title" style={{marginBottom: '20px', fontSize: '42px'}}>
                Welcome!
                <br />
                Please Login
              </Typography>
              </Grid>
              <Grid item xs={10}>
              <Input
                type={'text'}
                autoFocus={true}
                name="loginInpt"
                value={this.state.loginInpt}
                onChange={(e)=>this.handleChange(e)}
                onKeyDown={(e)=> {
                  if (e.key === 'Enter') this.handleUser(this.state.loginInpt)
                }}
                margin="normal"
                endAdornment={
                <InputAdornment position="end">
                 { this.state.loginInpt.length > 3 ?
                 <IconButton
                    onClick={()=>this.handleUser(this.state.loginInpt)}
                  >
                    <PersonAdd />
                  </IconButton>
                  : <span style={{width: '48px'}}></span>
                }
                </InputAdornment>
                }
              />
              {this.state.loginInpt.length < 4 && <FormHelperText>Username must be at least 4 characters</FormHelperText>}
              </Grid>
            </Grid>
          </Paper>
        </div>
     )
    } else {

      return ( 
        <div>
          <Reboot />
            <AppBar 
              username={this.state.username}
              docList={this.state.docList}
              docName={this.state.docName}
              handleChange={this.handleChange}
              style={{maxWidth: '100%'}}
              handleUser={this.handleUser}
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
                    {!this.state.tutorial && <Button style={{width: '49%'}} onClick={this.showDocInput} variant="raised" color="secondary">Cancel</Button>}
                    <Button style={this.state.tutorial ? {width: '100%'} : {width: '49%', float: 'right'}} disabled={this.state.docInpt === '' || this.state.nameInpt === ''} onClick={this.addDocument} variant="raised" color="primary">Add</Button>
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

                // Tutorial //

                  <Slide timeout={{ enter: 200, exit: 150}} direction="left" in={true} mountOnEnter unmountOnExit>
                  <ExpansionPanel style={{marginRight: '30px', minHeight: '444px'}} expanded={true} >
                    <ExpansionPanelSummary style={{cursor: 'auto'}}>
                      <Typography component="h5" variant="title" style={{fontSize: '30px'}}>Add your first document!</Typography>
                      {/* <Typography color="textSecondary">{'(Part of Speach)' + this.state.addNote.tag}</Typography> */}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container>
                      <Typography component="p" style={{margin: '0 20px 25px 20px'}}>
                        NoteTaker is designed to help you take notes on novels, scripts, textbooks, etc. 
                        Unlike traditional notes each word is bound to a single note that you can update with new 
                        insights as you read along in your text. Have fun!
                      </Typography>
                      <Divider style={{width: '100%', margin: '10px 0 30px 0'}} />
                      <Grid item xs={12}>
                      <Typography component="h2" variant="subheading">Can't think of anything? Try one of these examples</Typography>
                      <List style={{display: 'block'}} fullWidth={true} >
                        <ListItem
                          role={undefined}
                        >
                          <ListItemText primary="Moby Dick" />
                          <ListItemSecondaryAction>
                            <IconButton onClick={()=> this.setState({nameInpt: 'Moby Dick', docInpt: examples.mobyDick})}>
                            <Tooltip title="Copy example" placement="left">
                              <ContentCopy />
                            </Tooltip>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem
                          role={undefined}
                        >
                          <ListItemText primary="Jane Eyre" />
                          <ListItemSecondaryAction>
                            <IconButton onClick={()=> this.setState({nameInpt: 'Jane Eyre', docInpt: examples.janeEyre})}>
                              <Tooltip title="Copy example" placement="left">
                                <ContentCopy />
                              </Tooltip>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem
                          role={undefined}
                        >
                          <ListItemText primary="The Scarlet Letter" />
                          <ListItemSecondaryAction>
                            <IconButton onClick={()=> this.setState({nameInpt: 'The Scarlet Letter', docInpt: examples.scarletLetter})}>
                              <Tooltip title="Copy example" placement="left">
                                <ContentCopy />
                              </Tooltip>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                      </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel> 
                  </Slide>
                  :

                // NotesList //

                  <Slide timeout={{ enter: 80, exit: 300}} direction="left" in={this.state.addNote} mountOnEnter unmountOnExit>
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
                            <Grid container spacing={16} style={{marginTop: '10px'}} >
                            <Grid item xs={12} style={!this.state.editNote === note.word ? {paddingTop: '10px'} : {}}>
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
                                style={{fontSize: '18px', marginLeft: '10px', paddingTop: '3px'}}
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
                              <Tooltip enterDelay={50} id="tooltip-right-start" title="Double-click to edit" placement="top-start">
                              <Typography 
                                paragraph={true} 
                                variant="subheading" 
                                style={{fontSize: '18px', lineHeight: 'normal', whiteSpace: 'pre-line', margin: '0 0 0 10px'}} 
                                onDoubleClick={()=> {
                                  console.log(JSON.stringify(note.note))
                                  this.setState({editNote: note.word, editNoteInpt: note.note})}
                                }>
                                  {note.note}
                              </Typography>
                              </Tooltip>
                              }
                              </Grid>
                              {/* <Typography variant="caption">
                                This is where stats would go
                              </Typography> */}
                              <Grid item xs={12} style={{paddingTop: this.state.editNote === note.word ? '5px' : '30px'}} >
                                <StatsList expanded={this.state.expanded === note.word} username={this.state.username} docName={this.state.docName} word={note.word} getWordCount={this.getWordCount} />
                              </Grid>
                              </Grid>
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
}
 
ReactDOM.render(<App />, document.getElementById('app'));