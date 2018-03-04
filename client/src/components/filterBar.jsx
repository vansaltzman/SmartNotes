import React from 'react'
import { withStyles } from 'material-ui/styles';
import {yellow, green, purple, grey} from 'material-ui/colors';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  Characters: {color: purple[500]},
  Nouns: {color: yellow[500]},
  Verbs: {color: green[500]},
  Stops: {color: grey[500]},
}

class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      Notes: false,
      Characters: true,
      Nouns: true,
      Verbs: true,
      Other: true,
      Stops: true,
     }
  }

  handleChange(e, name) {
    this.setState({[name]: e.target.checked})
    this.props.filter(this.state)
  }

  render() { 

    const {classes, showFilters} = this.props

    if (showFilters) {
      return ( 
        <div>      
          <FormGroup row>
          <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Notes}
                  onChange={(e)=> this.handleChange(e, 'Notes')}
                  value="Notes"
                  color="secondary"
                />
              }
              label="My Notes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Characters}
                  onChange={(e)=> this.handleChange(e, 'Characters')}
                  value="Characters"
                  classes={{
                    checked: classes.Characters
                  }}
                />
              }
              label="Characters"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Nouns}
                  onChange={(e)=> this.handleChange(e, 'Nouns')}
                  value="Nouns"
                  classes={{
                    checked: classes.Nouns,
                  }}
                />
              }
              label="Nouns"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Verbs}
                  onChange={(e)=> this.handleChange(e, 'Verbs')}
                  value="Verbs"
                  classes={{
                    checked: classes.Verbs,
                  }}
                />
              }
              label="Verbs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Other}
                  onChange={(e)=> this.handleChange(e, 'Other')}
                  value="Other"
                  color="primary"
                />
              }
              label="Other"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Stops}
                  onChange={(e)=> this.handleChange(e, 'Stops')}
                  value="Stops"
                  classes={{
                    checked: classes.Stops,
                  }}
                />
              }
              label="Stops"
            />
          </FormGroup>
        </div>
       )
    } else {
      return (
        <div></div>
      )
    }
  }
}
 
export default withStyles(styles)(FilterBar);