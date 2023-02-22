import { combineReducers } from "redux";
import { getBucketReducer } from "./reducers";
import { getObjectReducer } from "./reducers";
import { getInstancesReducer } from "./reducers";
import { createInstanceReducer } from "./reducers";


const reducers = combineReducers({
    bucket: getBucketReducer,
    object: getObjectReducer,
    instances: getInstancesReducer,
    createInstance: createInstanceReducer,
});

export default reducers;