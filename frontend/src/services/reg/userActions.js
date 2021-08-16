import * as UT from "./userTypes";
import axios from "axios";


export const registerUser = (userObject) => {
    return (dispatch) => {
        dispatch(userRequest());
        axios
            .post("http://localhost:8080/auth/register", userObject)
            .then((response) => {
                dispatch({
                    type: UT.USER_SAVED_SUCCESS,
                    payload: response.data.message,
                });
            })
            .catch((error) => {

                if(error.config && error.config.url){
                    dispatch(userFailure("Сервер не отвечает!"));
                }
                if(error.response){
                    dispatch(userFailure(error.response.data.message));
                }

            });
    };
};
export const registerSection= ([sectionObject,edition]) => {
    return (dispatch) => {
        dispatch(userRequest());
        if(edition){
            axios
                .put("http://localhost:8080/api/section", sectionObject)
                .then((response) => {
                    dispatch({
                        type: UT.USER_SAVED_SUCCESS,
                        payload: response.data.message,
                    });
                })
                .catch((error) => {
                    console.log(error)
                    if(error.response){
                        dispatch(userFailure(error.response.data.message));
                    }
        else{
                        dispatch(userFailure("Сервер не отвечает!"));
                    }

                });
        }
        else{
            axios
                .post("http://localhost:8080/api/section", sectionObject)
                .then((response) => {
                    dispatch({
                        type: UT.USER_SAVED_SUCCESS,
                        payload: response.data.message,
                    });
                })
                .catch((error) => {
                    console.log(error)
                    if(error.response){
                        dispatch(userFailure(error.response.data.message));
                    }
                    else{
                        dispatch(userFailure("Сервер не отвечает!"));
                    }
                });
        }

    };
};

const userRequest = () => {
    return {
        type: UT.USER_REQUEST,
    };
};
const userFailure = (error) => {
    return {
        type: UT.USER_FAILURE,
        payload: error,
    };
};