// Send requests to USPTO
const BASEURL = "https://developer.uspto.gov/ibd-api/v1";

const OPT = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
};
const QS = {
    "start": 0,
    "rows": 50,
    //"searchText": "Method",
    //"assignee": "Oracle",
    //"inventor": "",
};

function jsonToQueryString(json) {
    return '?' + Object.keys(json).map(key => {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

function _handleResponse(response) {
    if (response.status >= 400) {
        throw new Error("Bad response from server");
    }
    return response.json();
}

/**
 * Fetch patent information.
 * @param parameters    Url query parameters
 * @param callback      Function A callback function taking a patent array as argument
 * @param errorCallback Function A callback function for handling error condition
 */
async function fetchPatents(parameters, callback, errorCallback) {
    const url = BASEURL + "/patent/application"
        + jsonToQueryString({
            ...QS,
            ...parameters
        });
    //console.log("URL: " + url);
    await fetch(url, OPT)
    .then(_handleResponse)
    .then(data => {
        console.log("Fetch succeeded");
        //console.log("   data: " + JSON.stringify(data));
        let newItems = data.response.docs.map(item => {
            return {
                ...item,
                selected: false
            };
        });
        if (callback)
            callback(newItems, data.response.numFound);
    })
    .catch(error => {
        console.log("Error: " + error);
        if (errorCallback)
            errorCallback(error);
    });
}

/**
 * Send a POST request to submit a value back to an endpoint.
 * @param payload       Object   The value to be posted back.
 * @param callback      Function A callback function
 * @param errorCallback Function A callback function for handling error condition
 */
function postback(payload, callback, errorCallback) {
    let url = (window.CALLBACK_URL === '__CALLBACK_URL_PLACEHOLDER__' ? null
        : window.CALLBACK_URL);
    if (!url) {
        console.log("Error: No Callback Url");
        return;
    }
    console.log("Posting to callback Url: " + url);
    const opt = {
        ...OPT,
        method: "post",
        body: JSON.stringify(payload || {}),
        mode: "no-cors"
    };
    console.log("Payload is: " + JSON.stringify(payload));
    fetch(url, opt)
    .then(_handleResponse)
    .then(data => {
        console.log("Callback to bots posted");

        if (callback) {
            callback();
        }
    })
    .catch(error => {
        console.log("Error: " + error);
        if (errorCallback)
            errorCallback(error);
    });
}

export {
    //jsonToQueryString,
    fetchPatents,
    postback
};
