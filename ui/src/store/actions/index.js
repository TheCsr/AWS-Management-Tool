
export function loadBucket() {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/", requestOptions).then((response) => response.json()).then((result) =>
            dispatch({
                type: "get_bucket",
                data: result
            })
        )
    }
}

export function getObjects(bName) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/getObjects?bName=" + bName, requestOptions).then((response) => response.json()).then((result) =>
            dispatch({
                type: "get_object",
                data: result
            })
        )
    }
}

export function deleteObjects(bName, listd) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "bucket": bName,
        "file": listd
    });
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/deleteObject", requestOptions).then((response) => response.json())
    }
}

export function uploadObjects(file, bName, name) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "bucket": bName,
        "file": file,
        "name": name
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/uploadObject", requestOptions).then((response) => response.json())
    }
}

export function getAllInstances(region) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/getAllInstances?region=" + region, requestOptions).then((response) => response.json()).then((result) =>
            dispatch({
                type: "get_instances",
                data: result
            })
        )
    }
}

export function startInstance(listd) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "instances": listd
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/startInstance", requestOptions).then((response) => response.json())
    }
}

export function stopInstance(listd) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "instances": listd
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/stopInstance", requestOptions).then((response) => response.json())
    }
}

export function createInstance(region, name, imageid, mincount, maxcount, instancetype, keypair, securitygroup) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        "region":region,
        "name": name,
        "imageid": imageid,
        "mincount": mincount,
        "maxcount": maxcount,
        "instancetype":instancetype,
        "keypair": keypair,
        "securitygroup": securitygroup
    });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: raw,
    };
    return (dispatch) => {
        return fetch("http://127.0.0.1:5000/createInstance", requestOptions).then((response) => response.json()).then((result) => 
        dispatch({
            type: "successful_creation",
            data: result
        })
        )
    }
}