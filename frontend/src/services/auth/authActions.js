import {FAILURE,LOGIN_REQUEST,SUCCESS,LOGOUT_REQUEST} from './authTypes';
import axios from "axios";

export const authenticateUser = (login, password) => {
    const credentials = {
        login: login,
        password: password,
    };
    return (dispatch) => {
        dispatch(loginRequest());
        axios.post("http://localhost:8080/auth/login",credentials)
            .then(response =>
            {
                let token = response.data.token;
                localStorage.setItem("jwtToken",token);
                dispatch(success(true));
            }).catch((error)=>{
                if(error.response){
                    dispatch(failure(error.response.data.message));
                }
                else{
                    dispatch(failure("Server not responding"));
                }



        });
    };
}
const loginRequest =() =>{
    return{
        type: LOGIN_REQUEST
    }
};
export const logoutUser = () =>{
    return (dispatch) => {
        dispatch(logoutRequest());
        dispatch(success(false));
        localStorage.removeItem("jwtToken");
    };
}
const logoutRequest =() =>{
    return{
        type: LOGOUT_REQUEST

    }
};
const failure =(error) =>{
    return{
        type: FAILURE,
        payload: false,
        error: error
    }
};


const success =isLoggedIn =>{
    return{
        type: SUCCESS,
        payload: isLoggedIn
    }
};





