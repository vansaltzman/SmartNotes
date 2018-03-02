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
    marginBottom: '15px'
  }
};

function DocumentBody(props) {

  const { classes, username, docList, docName, handleChange, text, addNote } = props;

  return ( 
    <Paper className="paper">
    <Typography variant="headline" component="h2">
    <Tooltip enterDelay={50} id="tooltip-right-start" title="Select a document" placement="right">
      <FormControl className={classes.formControl}>
        {/* <InputLabel htmlFor="document">{'Choose Document'}</InputLabel> */}
        <Select
          className={classes.select}
          value={docName}
          onChange={(e)=>handleChange(e)}
          inputProps={{
            name: 'document',
            id: 'document'
          }}
        > 
          {docList.map((name, i) => <MenuItem className={classes.select} key={i} value={name}>{name}</MenuItem>)}
        </Select>
      </FormControl>
      </Tooltip>
    </Typography>
    <GridList cols={1} component="div" cellHeight={window.innerHeight * 0.6}>
      <Typography gutterBottom={true} align="left" variant="title" paragraph={true} component="p">
        {text.map((word, i) => (!word.tag.match(/^(,|;|\.|:|\$|#|"|\(|\)|SYM)$/)) ? 
        // <Tooltip enterDelay={50} id="tooltip-right-start" title={word.tag} placement="right-start">
          <span value={word.tag} style={{display: "inline-block"}} key={i} onClick={() => addNote({word: word.word, tag: word.tag})} className={word.word + ' word ' + word.tag}>{word.word}</span> 
        // </Tooltip>
        : <span className="punct">{word.word}</span>)}
      </Typography>
    </GridList>
  </Paper>
    )
}

export default withStyles(styles)(DocumentBody);