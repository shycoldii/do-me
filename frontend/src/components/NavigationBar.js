import React, {Component} from 'react';
import {Navbar,Nav} from "react-bootstrap";
import {connect} from "react-redux";
import  {Link,Redirect} from "react-router-dom";
import {faSignInAlt, faSignOutAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {logoutUser} from "../services/index";
import axios from "axios";


class NavigationBar extends Component{
    logout = () =>{
        this.props.logoutUser();
        return <Redirect to="/login" />
    }
   render(){
       const token = localStorage.jwtToken;
       if (token) {
           axios.defaults.headers.common["Authorization"] = `${token}`
           this.props.auth.isLoggedIn = true
           axios.get("http://localhost:8080/api/section/user").catch(error => {
               console.log(error);
               this.props.auth.isLoggedIn = false
               localStorage.removeItem("jwtToken")
           })
       }
       else{
           this.props.auth.isLoggedIn = false
       }
       const guestLinks = (
           <>
               <div className="mr-auto"/>
               <Nav className="navbar-right">
                   <Link to={"/register"} className="nav-link">
                       <FontAwesomeIcon icon={faUserPlus} /> Register
                   </Link>
                   <Link to={"/login"} className="nav-link">
                       <FontAwesomeIcon icon={faSignInAlt} /> Login
                   </Link>
               </Nav>
           </>
       );
       const userLinks = (
           <>

               <Nav className="mr-auto">
                   <Link to={"/sections"} className="nav-link">Sections</Link>

               </Nav>
               <Nav className="navbar-right">
                   <Link to={"/logout"} className="nav-link" onClick={this.logout}>
                       <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                   </Link>
               </Nav>
           </>
       );
       return(
           <Navbar style={{"fontFamily": "Roboto"}}  bg="dark" variant="dark">
               <Link to={""} className="navbar-brand">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Dome3.png" width="25" height="25" alt="brand"/>
               </Link>
               {this.props.auth.isLoggedIn ? userLinks : guestLinks}
           </Navbar>)
   }

}
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser())
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(NavigationBar);