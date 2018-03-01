import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Reboot from 'material-ui/Reboot'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Toolbar from 'material-ui/Toolbar'
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {ExpansionPanelDetails,ExpansionPanelSummary} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Riley',
      nameInpt: '',
      docInpt: '',
      docName: '',
      text: [],
      // expanded: null
      notes: []
     }
     this.addDocument = this.addDocument.bind(this)
     this.handleChange = this.handleChange.bind(this)
     this.getDocument = this.getDocument.bind(this)
  }

  // handleChange(e, expanded) {
  //   console.log()
  //   this.setState({
  //     expanded: expanded ? expanded : false,
  //   });
  // };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addNote(word) {
    let arr = this.state.notes
    arr.push(word)
    this.setState({notes: arr})
  }

  getDocument(docName) {
    axios.get('/document', {params: {username: this.state.username, docName}})
      .then(results => this.setState({docName: docName, text: results.data}))
  }

  addDocument() {
    let docName = this.state.nameInpt

    axios.post('/document', {username: this.state.username, docName, docBody: this.state.docInpt})
      .then((data) => {
        this.getDocument(docName)
      })
  }


  render() { 
    // const { expanded } = this.state;

    // <Button style={btnOverwrite}></Button>
    // const btnOverwrite = {
    //   lineHeight: '1em',
    //   boxSizing: 'border-box',
    //   minWidth: 0,
    //   minHeight: 0,
    //   padding: '2px',
    //   borderRadius: 2,
    //   color: 'black',
    // }

    return ( 
      <div>
        <Reboot />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit">
                Note Taking
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <TextField
                placeholder="Title"
                fullWidth="true"
                id="text-field-controlled"
                name="nameInpt"
                value={this.state.nameInpt}
                onChange={(e)=>this.handleChange(e)}
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                placeholder="Document Body"
                fullWidth="true"
                multiLine="true"
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
              <Paper>
                <Typography variant="headline" component="h2">
                  {this.state.docName}
                </Typography>
                <Typography component="p">
                  {this.state.text.map((word, i) => (!word.tag.match(/([,.:$#"()]|SYM)/)) ? <span key={i} onClick={() => this.addNote(word.word)} id={word.word} className={'word ' + word.tag}>{word.word}</span> : word.word)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              {this.state.notes.map(word => {
                return (
                  <ExpansionPanel >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{word}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography>
                        Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                        maximus est, id dignissim quam.
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