import React, {Component} from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSignInAlt, faEnvelope, faLock, faUndo} from "@fortawesome/free-solid-svg-icons";
import  {Card, Col, Row,Form,InputGroup,Button,Alert} from "react-bootstrap";
import {authenticateUser} from '../../services/index';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.error="";

    }
    initialState={
        login:'', password:''
    };
    credentialChange = event =>{
        this.setState({
            [event.target.name] : event.target.value
        });
    }
    resetLoginForm = () => {
        this.setState({"login":"","password":""});
    };
    validateUser = () => {
        this.props.authenticateUser(this.state.login, this.state.password);
        setTimeout(() => {
            if(this.props.auth.isLoggedIn) {
                return this.props.history.push("/");
            } else {
                if(this.props.auth.error){
                    this.setState({"error":this.props.auth.error});
                }
              this.resetLoginForm();

            }
        }, 5000);
    };

  render(){
       return(
         <Row className="justify-content-md-center" style={{"marginTop":80,"fontFamily": "Roboto"}}>
              <Col xs={5}>
                  {this.props.message && <Alert align="center" variant="success">{this.props.message}</Alert>}
                  {this.state.error && <Alert align="center" variant="danger">{this.state.error}</Alert>}
                   <Card className={"border border-dark bg-dark text-white"} style={{"margin": 30}}>
                       <Card.Header>
                           <FontAwesomeIcon icon={faSignInAlt}/> Login
                       </Card.Header>
                       <Card.Body>
                           <Form.Row>
                               <Form.Group as={Col}>
                                   <InputGroup>
                                       <InputGroup.Prepend>
                                           <InputGroup.Text>
                                               <FontAwesomeIcon icon={faEnvelope} />
                                           </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <Form.Control required autoComplete="off" type="text" name="login" value={this.state.login}
                                                     className="bg-dark text-white" placeholder="Enter login" onChange={this.credentialChange}/>
                                   </InputGroup>
                               </Form.Group>
                           </Form.Row>
                           <Form.Row>
                               <Form.Group as={Col}>
                                   <InputGroup>
                                       <InputGroup.Prepend>
                                           <InputGroup.Text>
                                               <FontAwesomeIcon icon={faLock} />
                                           </InputGroup.Text>
                                       </InputGroup.Prepend>
                                       <Form.Control required autoComplete="off" type="password" name="password" value={this.state.password}
                                                     className="bg-dark text-white" placeholder="Enter password" onChange={this.credentialChange}/>
                                   </InputGroup>
                               </Form.Group>
                           </Form.Row>
                       </Card.Body>
                       <Card.Footer style={{"textAlign":"right"}}>
                           <Button size="sm" type="button" variant="dark" onClick={this.validateUser}
                                   disabled={this.state.login.length === 0 || this.state.password.length === 0}>
                               <FontAwesomeIcon icon={faSignInAlt}/> Login
                           </Button>{' '}
                           <Button size="sm" type="button" variant="dark" onClick={this.resetLoginForm}
                                   disabled={this.state.login.length === 0 && this.state.password.length === 0 && this.state.error.length === 0}>
                               <FontAwesomeIcon icon={faUndo}/> Reset
                           </Button>
                       </Card.Footer>
                   </Card>
              </Col>
         </Row>
       );
  }
}
const mapStateToProps = state => {
    return {
        auth:state.auth
    }
};
const mapDispatchToProps = dispatch => {
    return {
        authenticateUser: (login, password) => dispatch(authenticateUser(login, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);