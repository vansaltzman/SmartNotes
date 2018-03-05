import React from 'react'
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import {InsertChart, ExpandLess, ExpandMore} from 'material-ui-icons';
import { CircularProgress } from 'material-ui/Progress';

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
        <ListItem button onClick={()=> this.handleClick()}>
          <ListItemIcon>
            <InsertChart />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem >
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem divider={true} >
              {this.state.doc ? <ListItemText primary={"Document: " + this.state.doc}/> : <CircularProgress size={16} />}
            </ListItem>
            <ListItem divider={true} >
            {this.state.user ? <ListItemText primary={"User: " + this.state.user}/> : <CircularProgress size={16} />}
            </ListItem>
            <ListItem divider={true} >
              {this.state.global ? <ListItemText primary={"Global: " + this.state.global}/> : <CircularProgress size={16} />}
            </ListItem>
          </List>
        </Collapse>
      </List>
     )
  }
}
 
export default StatsList;