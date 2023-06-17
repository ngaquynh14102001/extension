const data = window.localStorage.getItem("saveData");
console.log('data from localstorage: ', data);

function messageReceived(msg) {
    console.log("Received msg: ", msg);
}

chrome.runtime.onMessage.addListener(messageReceived);

