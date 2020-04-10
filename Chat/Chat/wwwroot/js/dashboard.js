"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendDirectButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendDirectButton").disabled = false;
    connection.invoke("AddToGroup", "my group");
    console.log("Start AddToGroup");
}).catch(function (err) {
    return console.error((err.toString()));
});

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messageList").appendChild(li);
});

connection.on("ReceiveDirectMessage", function (recipient, myName, message) {
    console.log("Received direct message");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var encodedMsg = myName + " says " + msg + "to" + recipient;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messageList").appendChild(li);
});

document.getElementById("sendDirectButton").addEventListener("click", function (event) {
    var recipient = "my group";
    var myName = "Bob"; //document.getElementById("myName");
    var message = document.getElementById("messageInput").value;
    console.log("Direct");
    connection.invoke("SendDirectMessage", recipient, myName, message).catch(function (err) {
        return console.error(err.toString());
    });
});