// import React from 'react';
// import { MenuList, MenuItem } from 'material-ui/Menu';
// import AddDoc from 'material-ui-icons/NoteAdd';
// import Button from 'material-ui/Button'

// class DocsMenu extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       anchor: null
//      }
//   }

//   handleClick(e) {
//     this.setState({ anchor: event.currentTarget });
//   }

//   handleClose(doc) {
//     if (doc !== 'newDoc') {
//       this.props.showDocInput()
//     } else if (doc) {
//       this.props.changeDoc(doc)
//     } 
//     this.setState({ anchor: null });
//   };

//   render() { 
//     return (
//       <div>
//         <Button
//               onClick={(e)=> this.handleClick(e)}
//         >{this.props.docName}</Button>
//           <Menu
//             anchorEl={this.state.anchor}
//             open={Boolean(this.state.anchor)}
//             onClose={this.handleClose}
//           >
//             <MenuItem onClick={()=> this.handleClose(e)}>Profile</MenuItem>
//             <MenuItem onClick={()=> this.handleClose(e)}>My account</MenuItem>
//             <MenuItem onClick={()=> this.handleClose(e)}>Logout</MenuItem>
//           </Menu>
//       </div>
//      )
//   }
// }


<Paper style={{width: '60%'}} className="paper">
            <Grid container direction="column" spacing={24} justify="center" alignItems="center" style={{maxWidth: '100%' , marginTop: '16px'}}>
              <Grid item xs={10}>
              <Typography align="center" variant="title" style={{marginBottom: '20px', fontSize: '42px'}}>
                Welcome! Please Login
              </Typography>
              </Grid>
              <Grid item xs={10}>
              <Input
                type={'text'}
                autoFocus={true}
                name="loginInpt"
                value={this.state.loginInpt}
                onChange={(e)=>this.handleChange(e)}
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
 
// export default DocsMenu;