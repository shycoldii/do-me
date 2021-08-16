import React, {Component, useEffect, useState} from "react";
import {Jumbotron} from "react-bootstrap";
import axios from "axios";
import authToken from "../services/auth/authToken";

class Welcome extends Component{

    render(){
        if(localStorage.jwtToken){
            authToken(localStorage.jwtToken);
        }

        return(
            <Jumbotron className="bg-dark text-white" style={{"marginTop":150,"fontFamily": "Roboto"}}>
                <h1 align="center">Be simple.</h1>
                <p align="center">Это приложение поможет организовать твою рабочую область</p>
                <footer className="blockquote-footer" align="center">
                    D.Alexandrova
                </footer>
            </Jumbotron>
        );
    }


}
export default Welcome;