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

 
// export default DocsMenu;