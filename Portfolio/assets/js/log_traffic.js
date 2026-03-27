const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");

var cachedIP = null;

function getIP() {
    if (cachedIP !== null) {
        return Promise.resolve(cachedIP);
    }

    return fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            cachedIP = data.ip;
            return cachedIP;
        }
    );
}

function log(action){
    if (mode == "dev") {return;}

    getIP().then(ip => {
        const userAgent = navigator.userAgent;
        let url = 
            "https://script.google.com/macros/s/AKfycbxk8CORvIAgRHkMqcVR7306C6gtwEDBL93SIvYWIAANnFlIObQ-PIV6Wtne9YGikfv86g/exec"+
            "?ip=" + encodeURIComponent(ip)+
            "&ua=" + encodeURIComponent(userAgent)+
            "&action=" + encodeURIComponent(action);

        fetch(url).catch(console.error);
    });
}