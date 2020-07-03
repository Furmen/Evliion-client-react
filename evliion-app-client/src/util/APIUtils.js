import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN, MAP_API_GEOCODING } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json'
    })
    
    if(sessionStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };

    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

const doCORSRequest = (options, printResult) => {
    var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
    var x = new XMLHttpRequest();
    x.open(options.method, cors_api_url + options.url, false);
    x.onload = x.onerror = function() { printResult(x.response); };
    x.send(options.data);
};

export function addVehicle(vehicleData) {
    return request({
        url: API_BASE_URL + "v1/vehicle",
        method: 'POST',
        body: JSON.stringify(vehicleData)
    })
}

export function addStore(storeData) {
    return request({
        url: API_BASE_URL + "v1/store",
        method: 'POST',
        body: JSON.stringify(storeData)
    })
}

export function addInventory(inventoryData) {
    return request({
        url: API_BASE_URL + "v1/inventory",
        method: 'POST',
        body: JSON.stringify(inventoryData)
    })
}

export function deleteInventory(inventoryId) {
    return request({
        url: API_BASE_URL + "v1/inventory/" + inventoryId,
        method: 'DELETE'
    })
}

export function deleteStore(storeId) {
    return request({
        url: API_BASE_URL + "v1/store/" + storeId,
        method: 'DELETE'
    })
}

export function getAllStores() {
    return request({
        url: API_BASE_URL + "v1/store/all",
        method: 'GET'
    })
}

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function searchCoordenates(address) {
    var response;
    doCORSRequest({
        method: 'GET',
        url: MAP_API_GEOCODING + address
      }, function printResult(result) {
        response = JSON.parse(result);
      });
      return response;
}

export function getCurrentUser() {
    if(!sessionStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}