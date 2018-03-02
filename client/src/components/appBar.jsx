import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  formControl: {
    minWidth: 200,
  }
};

function MyAppBar(props) {
  const { classes, username, docList, docName, handleChange } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Note Taker
          </Typography>
          <Button color="inherit">{username}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles)(MyAppBar);