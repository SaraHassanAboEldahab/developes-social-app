import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";

//in general the reducer is a function which takes a piece of state and action
export default combineReducers({
    alert,
    auth,
    profile,
    post
});