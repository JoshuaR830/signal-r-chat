"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var users = []

document.getElementById("sendDirectButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendDirectButton").disabled = false;
    connection.invoke("AddToGroup", "admin");
    console.log("Start AddToGroup");
}).catch(function (err) {
    return console.error((err.toString()));
});

connection.on("ReceiveMessage", function (user, message) {
    console.log(user);

    if (users.includes(user)) {
        // Probably update the existing one - should sett list item id as the id of the user
        return;
    }

    connection.invoke("AddToGroup", user);
    users.push(user);
    var li = document.createElement("li");
    li.textContent = user;
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
    var recipient = document.getElementById('recipientInput').value;
    var myName = "Bob"; //document.getElementById("myName");
    var message = document.getElementById("messageInput").value;
    console.log("Direct");
    connection.invoke("SendDirectMessage", recipient, myName, message).catch(function (err) {
        return console.error(err.toString());
    });
});