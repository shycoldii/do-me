import authReducer from './auth/authReducer';
import userReducer from "./reg/userReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    user: userReducer,
    auth: authReducer,
});
export default rootReducer;