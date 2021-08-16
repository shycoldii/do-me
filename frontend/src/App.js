import React, {Component} from 'react';
import NavigationBar from "./components/NavigationBar";
import  {Container,Col,Row} from "react-bootstrap";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { BrowserRouter as Router, Switch, Route ,Redirect} from "react-router-dom";
import {connect} from "react-redux";
import SectionList from "./components/Section/SectionList";
import Section from "./components/Section/Section";
class App extends Component{
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Router >
                <NavigationBar/>
                <Container>
                    <Row>
                        <Col lg={12} style={{"marginTop": "20px"}}>
                            <Switch>
                                <Route path="/" exact component={Welcome}/>
                                <Route path="/login" exact component={Login}/>
                                <Route path="/register" exact component={Register}/>
                                <Route path="/sections" exact component={SectionList} />
                                <Route path="/sections/:id" exact component={Section}/>
                                <Route
                                    path="/logout"
                                    exact
                                    component={Login}
                                />
                                <Redirect to="/"/>
                            </Switch>
                        </Col>
                    </Row>
                </Container>
                <Footer/>
            </Router>
        )
      

  }


}const mapStateToProps = state => {
    return {
        auth:state.auth
    }
};

export default connect(mapStateToProps)(App);