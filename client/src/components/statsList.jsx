import React from 'react'
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import {InsertChart, ExpandLess, ExpandMore} from 'material-ui-icons';

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

  handleClick() {
    if (!this.state.open) {

    let doc
    let user
    let global

    this.props.getWordCount(this.props.username, this.props.docName, this.props.word)
      .then((docCount)=> {
        console.log('docCount')
        doc = docCount
        return this.props.getWordCount(this.props.username, null, this.props.word)
      })
      .then((userCount)=> {
        console.log('second')
        user = userCount
        return this.props.getWordCount(null, null, this.props.word)
      })
      .then((globalCount)=> {
        console.log('third')
        global = globalCount
        this.setState({doc, user, global}, ()=> {
          console.log('got there')
          this.setState({ open: !this.state.open })
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
      <List>
        <ListItem button onClick={()=> this.handleClick()}>
          <ListItemIcon>
            <InsertChart />
          </ListItemIcon>
          <ListItemText inset primary="Statistics" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem >
              <ListItemText inset primary={"Document: " + this.state.doc}/>
            </ListItem>
            <ListItem >
              <ListItemText inset primary={"User: " + this.state.user}/>
            </ListItem>
            <ListItem >
              <ListItemText inset primary={"Global: " + this.state.global}/>
            </ListItem>
          </List>
        </Collapse>
      </List>
     )
  }
}
 
export default StatsList;