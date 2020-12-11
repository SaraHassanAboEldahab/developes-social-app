import { SET_ALERT, REMOVE_ALERT } from "../actions/types"
const initialState = []

//in general the reducer is a function which takes a piece of state and action
//action will contain 2 things =>1.the type , 2.the data which is payload here , sometimes it contains only the type
export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}