
export const getBucketReducer = (state = {}, action) => {
    if (action.type === "get_bucket") {
        return {
            ...state,
            data: action.data
        }
    } else {
        return {
            ...state
        }
    }
}

export const getObjectReducer = (state = {}, action) => {
    if (action.type === "get_object") {
        return {
            ...state,
            data: action.data
        }
    } else if (action.type === "delete_object") {
        return {
            state
        }
    } else {
        return {
            ...state
        }
    }
}

export const getInstancesReducer = (state = {}, action) => {
    if (action.type === "get_instances") {
        return {
            ...state,
            data: action.data
        }
    } else {
        return {
            ...state
        }
    }
}

export const createInstanceReducer = (state = {}, action) => {
    if (action.type === "successful_creation") {
        return {
            ...state,
            data: action.data
        }
    } else {
        return {
            ...state
        }
    }
}


