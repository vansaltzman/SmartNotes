import React from 'react';
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Tooltip from 'material-ui/Tooltip'
import GridList from 'material-ui/GridList'
import IconButton from 'material-ui/IconButton'
import AddDoc from 'material-ui-icons/NoteAdd';
import Button from 'material-ui/Button'
import {ListItem, ListItemText, ListItemIcon} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import FilterBar from './filterBar.jsx'
import Filter from 'material-ui-icons/FilterList';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  formControl: {
    minWidth: 200,
  },
  select: {
    fontSize: '28px',
    padding: '5px',
    marginBottom: '15px',
    marginLeft: '15px'
  },
};

function DocumentBody(props) {

  const { 
    classes, username, docList, 
    docName, handleChange, text, 
    addNote, selected, posColor, 
    showDocInput, changeDoc, showFilters,
    toggleFilters, 
  } = props;

  if (docList.length > 0) {
    return ( 
      <div id='docBody'>
        <Paper className="paper" style={{marginBottom: '24px'}}>
          <Typography variant="headline" component="h2" style={{maxWidth: '300px'}}>
              <Select
                style={{fontSize: Math.min((24/(docName.length/21)), 28) + 'px'}} //To handle long titles
                renderValue={()=> docName}
                className={classes.select}
                value={docName}
                onChange={(e)=>handleChange(e)}
                inputProps={{
                  name: 'document',
                  id: 'document'
                }}
              > 
                {docList.map((name, i) => {
                  return (
                  <MenuItem divider={true} key={i} value={name}>
                    <Typography variant="headline" component="h2">
                      <ListItemText inset={true} disableTypography={true} primary={name} />
                    </Typography>
                  </MenuItem>
                  )})}

                  <ListItem onClick={showDocInput} value="_newDoc" button={true}>
                    <ListItemIcon>
                      <AddDoc />
                    </ListItemIcon>
                    <Typography variant="headline" component="h2">
                      <ListItemText inset={false} disableTypography={true} primary="New Document" />
                    </Typography>
                  </ListItem>

              </Select>
              <IconButton>
                <Filter onClick={toggleFilters}/>
              </IconButton>
          </Typography>
            <div style={{display: 'inline'}} >
              <FilterBar showFilters={showFilters} filter={()=> console.log('tick')}/>
            </div>
          </Paper>
  
          <Paper className="paper">
          <GridList cols={1} component="div" cellHeight={window.innerHeight * 0.60}>
            <Typography gutterBottom={true} align="left" variant="title" paragraph={true} component="p">
              {text.map((word, i) => (!word.tag.match(/^(,|;|\.|:|\$|#|"|\(|\)|SYM)$/)) ? 
              // <Tooltip enterDelay={50} id="tooltip-right-start" title={word.tag} placement="right-start">
                <span value={word.tag} style={word.word === selected ? {display: "inline-block", background: posColor[word.tag] || '#4258d1'} : {display: "inline-block"}} key={i} onClick={() => addNote({word: word.word, tag: word.tag})} className={word.word + ' word ' + word.tag}>{word.word}</span> 
              // </Tooltip>
              : <span className="punct">{word.word}</span>)}
            </Typography>
          </GridList>
        </Paper>
      </div>
      )
  }
  else {
    return <div></div>
  }
}

export default withStyles(styles)(DocumentBody);