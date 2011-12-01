self.onmessage = function (event) {
    self.postMessage('worker recieved a message!' + event.data);
}