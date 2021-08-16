import React, {Component} from "react";
import {connect} from "react-redux";
import {Card, ButtonGroup, Button, Modal, Form, Alert, Col} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash, faFolderPlus} from "@fortawesome/free-solid-svg-icons";
import {registerSection} from "../../services";
import MyToast from "../MyToast";



class SectionList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            show: false,
            name: "",
            description: "",
            id: undefined,
            showAlert: false,
            type: "success",
            edition: false,
            isChanged:false,
            redirect:false,
            error:"",
            variant: "New"
        };
    }
    initialState = {
        name: "",
        description: "",
        id: undefined,
        edition: false,
        isChanged: false,
        redirect: false,
        error:"",

    };

    componentDidMount() {
        if(this.props.auth.isLoggedIn){
            this.findAllSections()
        }

    }

    findAllSections(){
        axios.get("http://localhost:8080/api/section/user")
            .then((response) => response.data)
            .then((data) => {
                this.setState({
                    sections: data
                });
            })
            .catch((error) => {
                if(error.response){
                    if(error.response.status===403){
                        localStorage.removeItem("jwtToken");
                        this.props.history.push("/");
                    }
                    this.setState({ showAlert: true,message: error.response.data.message,type:"warning"});
                    setTimeout( ()=>{this.setState({ showAlert:false})},2000)
                }
            });
    }
    modifyDate(dateString){
        const dateFormat = require('dateformat');
      let date = dateFormat(dateString,"dd.mm.yyyy HH:MM");
        return(
           date
        )

    }
    deleteSection = (sectionId) =>{
        axios
            .delete("http://localhost:8080/api/section?id=" + sectionId)
            .then((response) => {
                if(response.data!=null){
                    this.setState(
                        {
                            sections: this.state.sections.filter(section => section.id!==sectionId)
                        }
                    )
                }
            })
            .catch((error)=>{
            if(error.response){
                if(error.response.status===403){
                    console.log("HERE")
                    localStorage.removeItem("jwtToken");
                    this.props.history.push("/");
                }
                this.setState({ showAlert: true,message: error.response.data.message,type:"warning"});
                setTimeout( ()=>{this.setState({ showAlert:false})},2000)
            }
        })

    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,isChanged:true
        });
    }
    registerSection = () => {
        if (this.state.edition&&!this.state.isChanged){
            this.resetRegisterForm();
            this.setState({show:false})
        }
        else{
            let sectionObject = {
                name: this.state.name,
                description: this.state.description,
                id: this.state.id
            };
            this.props.registerSection([sectionObject,this.state.edition]);
            this.resetRegisterForm();
            setTimeout(() => {
                if (this.props.user.message != null) {
                    this.findAllSections();
                    this.setState({showAlert:true,show:false,message: this.props.user.message,type: "success"})
                    setTimeout( ()=>{this.setState({ showAlert:false})},2000)


                } else {
                    console.log(this.props.user)
                    this.setState({ showAlert: true,message: this.props.user.error,type:"warning"});
                    setTimeout( ()=>{this.setState({ showAlert:false})},2000)
                }
            }, 500);
        }


    };
    resetRegisterForm = () => {

        this.setState(() => this.initialState);
    };
    handleRedirect = (number) => {

        this.setState({redirect: true,id:number.id});
    }
    handleUnRedirect = () => {
        this.setState({redirect: false,id:undefined});
    }

    render(){
        const handleClose = () => this.setState({show: false});
        const handleShow = () => this.setState({show: true});
        const handleEdit = (number) => {
            this.setState({name: number.name, id: number.id, description: number.description, edition: true});
        }

        if(this.props.auth.isLoggedIn){
            return [<Card  className="border border-dark bg-dark text-white text-center" key={-1}
                           onClick={()=>[this.setState({edition: false,variant: "New"}),handleShow()]} style={{ cursor: "pointer",margin:30,"fontFamily": "Roboto"}}>
                <Card.Body>
                    <FontAwesomeIcon icon={faFolderPlus} />
                    <Card.Title>Add section</Card.Title>
                </Card.Body>
            </Card>,
                <Modal variant="dark" show={this.state.show} className={"text-white"} onExit={this.resetRegisterForm}
                       onHide={handleClose} key={"modal"} animation={true} centered style={{"fontFamily": "Roboto"}}>
                    <Modal.Header closeButton  className={"bg-dark border border-dark"}>
                        <Modal.Title className={"bg-dark"} >{this.state.variant} section</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"bg-dark  border-dark"}>
                        <Form>
                            <Form.Group className="mb-3" controlId="ControlInput1">
                                <Form.Label  >Название</Form.Label>
                                <Form.Control onChange={this.handleChange.bind(this)} required value={this.state.name}
                                              autoComplete="off" name="name"  className={"bg-secondary text-white border-dark"}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="ControlTextarea1">
                                <Form.Label>Описание</Form.Label>
                                <Form.Control  onChange={this.handleChange.bind(this)} name="description"
                                               autoComplete="off"
                                               required value={this.state.description}
                                               as="textarea" rows={3}  className={"bg-secondary text-white border-dark"}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className={"bg-dark border-dark"}>
                        <Button variant="secondary" onClick={handleClose&&this.registerSection} disabled={
                            this.state.name.length === 0
                        }>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>,
                    <div key="alertWarn" style={{ display: this.state.showAlert ? "block" : "none" ,"fontFamily": "Roboto"}}>
                        <MyToast
                            show={this.state.showAlert}
                            message={this.state.message}
                            type={this.state.type}
                        />
                    </div>,

                    this.state.sections.map(number =>
                        <Card  className="border border-dark bg-dark text-white"
                              key={number.id}  style={{ cursor: "pointer",margin:30,"fontFamily":"Roboto" }}>

                            <Card.Body  onClick={()=>this.handleRedirect(number)}>
                                <Card.Title>{number.name}</Card.Title>
                                <Card.Text>{number.description}
                                </Card.Text>
                                <small className="text-muted" >Last update: {this.modifyDate(number.modifyDate)}</small>
                            </Card.Body>
                            <Card.Footer style={{"textAlign":"right"}} >
                                <ButtonGroup >
                                    <Button style={{margin:5}}
                                            onClick={()=>[this.setState({"variant": "Edit"}),this.handleUnRedirect(),handleEdit(number),handleShow()]}
                                       variant={"dark"} size="sm"
                                    >
                                        <FontAwesomeIcon icon={faEdit}  />
                                    </Button>{" "}
                                    <Button style={{margin:5}} onClick={() => [this.handleUnRedirect(),this.deleteSection(number.id)]}
                                        size="sm"
                                        variant="dark"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </ButtonGroup>
                            </Card.Footer>

                        </Card>,
                    ),
                (this.state.redirect && <Redirect key="redirect" to={"/sections/" + this.state.id}/>),
                <div  style={{marginBottom: 70}}/>,
            ]
       }
        else{
            return <Redirect to="/" />
        }



    }

}
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        user: state.user
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        registerSection: (sectionObject) => dispatch(registerSection(sectionObject)),
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(SectionList);