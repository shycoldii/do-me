import React, {Component} from "react";
import {connect, Provider} from "react-redux";
import {
    Row,
    Col,
    Card,
    Form,
    InputGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faUndo,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../services/index";
import MyToast from "../MyToast";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.show2 = false;
        this.state.message = "";
    }

    initialState = {
        login: "",
        password: "",
    };
    userChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    registerUser = () => {
        let userObject = {
            login: this.state.login,
            password: this.state.password
        };
        this.props.registerUser(userObject);

        setTimeout(() => {
            if (this.props.user.message != null) {
                this.setState({ show: true, message: this.props.user.message });
                setTimeout(() => {
                    this.setState({ show: false });
                    this.props.history.push("/login");
                }, 3000);
            } else {
                this.setState({ show2: true,message: this.props.user.error});
                setTimeout(() => {
                    this.setState({ show2: false });
                }, 3000);

            }
        }, 5000);
        this.resetRegisterForm();
    };

    resetRegisterForm = () => {
        this.setState(() => this.initialState);
    };


    render(){
        const { login, password } = this.state;
        return(
            <div style={{"fontFamily": "Roboto","marginTop":150}} >
                <div style={{ display: this.state.show ? "block" : "none" }}>
                    <MyToast
                        show={this.state.show}
                        message={this.state.message}
                        type={"success"}
                    />
                </div>
                <div style={{ display: this.state.show2 ? "block" : "none" }}>
                    <MyToast
                        show={this.state.show2}
                        message={this.state.message}
                        type={"warning"}
                    />
                </div>
                <Row className="justify-content-md-center">
                    <Col xs={5}>
                        <Card className={"border border-dark bg-dark text-white"}>
                            <Card.Header>
                                <FontAwesomeIcon icon={faUserPlus} /> Register
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
                                            <FormControl
                                                required
                                                autoComplete="off"
                                                type="text"
                                                name="login"
                                                value={login}
                                                onChange={this.userChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Enter login"
                                            />
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
                                            <FormControl
                                                required
                                                autoComplete="off"
                                                type="password"
                                                name="password"
                                                value={password}
                                                onChange={this.userChange}
                                                className={"bg-dark text-white"}
                                                placeholder="Enter Password"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>
                            </Card.Body>
                            <Card.Footer style={{ textAlign: "right" }}>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="dark"
                                    onClick={this.registerUser}
                                    disabled={
                                        this.state.login.length === 0 ||
                                        this.state.password.length === 0
                                    }
                                >
                                    <FontAwesomeIcon icon={faUserPlus} /> Register
                                </Button>{" "}
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="dark"
                                    onClick={this.resetRegisterForm}
                                >
                                    <FontAwesomeIcon icon={faUndo} /> Reset
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerUser: (userObject) => dispatch(registerUser(userObject)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);