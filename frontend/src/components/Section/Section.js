import React, {Component } from "react";
import axios from "axios";
import {registerSection} from "../../services";
import {connect} from "react-redux";
import './Section.css';
import List from "@material-ui/core/List";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import MyToast from "../MyToast";
class Section extends Component{
    constructor(props) {
        super(props);
        this.state = {
            notDone: [],
            done: [],
            sectionName: "",
            showAlert: false
        };
        this.currentCard = undefined;

    }
    initialState = {
        done: [],
        notDone: []
    };

    componentDidMount() {
        if(this.props.auth.isLoggedIn){
            this.findAllTasks()
        }
    }
    resetRegisterForm = () => {

        this.setState(() => this.initialState);
    };

    findAllTasks(){
        axios.get("http://localhost:8080/api/section/tasks?id="+this.props.match.params.id)
            .then((response) => response.data)
            .then((data) => {
                this.sortTasks(data);
            })
            .catch((error) => {
                this.resolveError(error);
            });
        this.resetRegisterForm();
        axios.get("http://localhost:8080/api/section/?id="+this.props.match.params.id)
            .then((response) => response.data)
            .then((data) => {
                this.setState({
                   sectionName: data
                });
            })
            .catch((error) => {
                this.resolveError(error);
            });
    }
    render(){
        return ([
            <h1 style={{"fontFamily": "Roboto"}} key="h1" align="center" className="text-white">{this.state.sectionName}</h1>,
            <div style={{"fontFamily": "Roboto"}}  key="div" id="inputWrapper" align="center">
                <input align="center"   onKeyPress={event => {
                    if (event.key === 'Enter') {
                        this.addTask(this.inputElement.value)
                    }
                }}
                    type="text"
                    placeholder="to do:"
                    id="todoInput"
                    ref={(node) => this.inputElement = node}/>,
                <div className="bg-transparent" onClick={()=>this.addTask(this.inputElement.value)}
                    id="todoBtn" style={{"color": "white"}}
                    >Add</div>
            </div>,
            <div key="alertWarn" style={{ display: this.state.showAlert ? "block" : "none" ,"fontFamily":"Roboto"}}>
                <MyToast
                    show={this.state.showAlert}
                    message={this.state.error}
                    type={"warning"}
                />
            </div>,
            <h4 key="notDone" align="left" className="text-white" style={{"marginTop":30,"fontFamily":"Roboto"}}>In progress:</h4>,

            <List key="listNotDone" style={{"marginTop": 10,"fontFamily":"Roboto"}}>
                {this.state.notDone.map((todo, index) => (

                    <ListItem className="text-white" key={index.toString()} dense button  onDragStart={(e)=>this.handleDragStart(e,todo)}
                    onDragOver={(e)=>this.handleDragOver(e)}
                              draggable={true} onDrop={(e)=>this.handleDrop(e,todo)}>
                        <Checkbox tabIndex={-1}  onClick={()=>this.setStatus(todo.id,todo.status)}  checked={false} style ={{
                            color: "antiquewhite",
                        }}/>
                        <ListItemText primary={todo.name}   />
                        <ListItemSecondaryAction >
                            <IconButton onClick={()=> this.deleteTask(todo.id)}
                                aria-label="Delete"

                            >
                                <DeleteIcon style={{"color": "white"}} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>,
            <h4 key="done" align="left" className="text-white" style={{"marginTop":30,"fontFamily":"Roboto"}}>Done:</h4>,

            <List key="listDone" style={{"marginTop": 10,"marginBottom":25,"fontFamily":"Roboto"}} >
                {this.state.done.map((todo, index) => (
                    <ListItem className="text-white" key={index.toString()} dense button disableRipple  >
                        <Checkbox onClick={()=>this.setStatus(todo.id,todo.status)} tabIndex={-1}  checked style ={{
                            color: "antiquewhite"
                        }}/>
                        <ListItemText primary={todo.name}  style={{"textDecorationLine": 'line-through'}} />
                      <ListItemSecondaryAction>
                          <IconButton  onClick={()=> this.deleteTask(todo.id)}
                              aria-label="Delete"
                          >
                              <DeleteIcon style={{"color": "white"}} />
                          </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        ]);
    }

    addTask(textContent) {
        if(textContent!==""){
            this.inputElement.value = '';
            axios.post("http://localhost:8080/api/section/tasks/?id="+this.props.match.params.id+"&name="+textContent)
                .then((response) => response.data)
                .then((data) => {
                    this.sortTasks(data);
                })
                .catch((error) => {
                    this.resolveError(error);
                });
        }

    }

    resolveError(error) {
        console.log(error);
        if (error.response) {
            if (error.response.status === 403) {
                localStorage.removeItem("jwtToken");
                this.props.history.push("/");
            }
            this.setState({showAlert: true, message: error.response.data.message, type: "warning"});
            setTimeout(() => {
                this.setState({showAlert: false})
            }, 2000)
        }
    }

    deleteTask(id) {
        axios.delete("http://localhost:8080/api/section/tasks?id="+id+"&sectionId="+this.props.match.params.id)
            .then((response) => response.data)
            .then((data) => {
                this.sortTasks(data)
            })
            .catch((error) => {
                this.resolveError(error);
            });

    }

    sortTasks(tasks) {
        const notDone = [];
        const done = [];
        tasks.forEach(function(item) {
          if(item.status==="NOTDONE"){
             notDone.push(item);
          }
          else{
              done.push(item);
          }
        })
        notDone.sort(this.sortCards)

        this.setState({"notDone":notDone,"done":done}
        )

    }

    setStatus(id,status) {

        axios.put("http://localhost:8080/api/section/tasks?id="+id+"&sectionId="+this.props.match.params.id+"&status="+status)
            .then((response) => response.data)
            .then((data) => {
                this.sortTasks(data)
            })
            .catch((error) => {
                this.resolveError(error);
            });
    }

    handleDragStart(e, card) {
        this.currentCard = card;
    }

    handleDragOver(e) {
        e.preventDefault()

    }

    handleDrop(e, todo) {
        e.preventDefault()
        let result = this.state.notDone;
        result = result.map(c => {
            if(c.id===todo.id){
                return {...c,orderNum:this.currentCard.orderNum}
            }
            if(c.id===this.currentCard.id){
                return {...c,orderNum:todo.orderNum}
            }
            return c
        }).sort(this.sortCards)
        this.changeOrder(result)


    }
    sortCards=(a,b)=>{
        if(a.orderNum>b.orderNum){
            return 1
        }
        else{
            return -1
        }
    }

    changeOrder(mas) {
        axios.put("http://localhost:8080/api/section/tasks/all?sectionId="+this.props.match.params.id,mas).then((response) => response.data)
            .then((data) => {
            this.sortTasks(data)
        })
            .catch((error) => {
                this.resolveError(error);
            });
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
export default  connect(mapStateToProps,mapDispatchToProps)(Section);