import React from 'react'
import List, { ListSubheader, ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import { Subject, Public, Person, InsertChart, ExpandLess, ExpandMore} from 'material-ui-icons';
import { CircularProgress } from 'material-ui/Progress';
import { Typography } from 'material-ui/styles';
import Divider from 'material-ui/Divider'
class StatsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      doc: false,
      user: false,
      global: false,
     }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.expanded) {
      this.setState({open: false})
    }
  }

  handleClick() {
    if (!this.state.open) {

    let doc
    let user
    let global

    this.props.getWordCount(this.props.username, this.props.docName, this.props.word)
      .then((docCount)=> {
        doc = docCount
        return this.props.getWordCount(this.props.username, null, this.props.word)
      })
      .then((userCount)=> {
        user = userCount
        return this.props.getWordCount(null, null, this.props.word)
      })
      .then((globalCount)=> {
        global = globalCount
        this.setState({ open: !this.state.open }, ()=> {
          console.log('got there')
          setTimeout(()=> this.setState({doc, user, global}), 500)
        })
      })
    } else {
      this.setState({ open: !this.state.open }, ()=> {
        this.setState({doc: false, user: false, global: false})
      });
    }
  };

  render() { 
    return (
      <List  style={{width: '100%'}}>
          <ListItem divider={this.state.open} button onClick={()=> this.handleClick()}>
            <ListItemIcon>
              <InsertChart color="error" />
            </ListItemIcon>
            <ListItemText style={{fontSize:'18px'}} primary="Word Count" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem >
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {/* <ListSubheader style={{fontSize: '18px', fontWeight:'bold', color: 'black', paddingTop: '10px'}} >
              Word Count
          </ListSubheader> */}
          <Divider />
          <List component="div" disablePadding>
            <ListItem >
              <ListItemIcon>
                <Subject color="error" />
            </ListItemIcon>
              {this.state.doc ? <ListItemText primary={"Document: " + this.state.doc}/> : <CircularProgress style={{paddingLeft: '5px'}} size={18} />}
            </ListItem>
            <ListItem >
              <ListItemIcon>
                <Person color="error" />
              </ListItemIcon>
            {this.state.user ? <ListItemText primary={"User: " + this.state.user}/> : <CircularProgress style={{paddingLeft: '5px'}} size={18} />}
            </ListItem>
            <ListItem >
              <ListItemIcon>
               <Public color="error" />
              </ListItemIcon>
              {this.state.global ? <ListItemText primary={"Global: " + this.state.global}/> : <CircularProgress style={{paddingLeft: '5px'}} size={18} />}
            </ListItem>
          </List>
        </Collapse>
      </List>
     )
  }
}
 
export default StatsList;