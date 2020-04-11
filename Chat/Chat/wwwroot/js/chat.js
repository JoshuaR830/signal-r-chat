"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, friendlyName, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var li = document.createElement("div");
    li.className = "message --right";
    li.textContent = msg;
    document.getElementById("messageList").appendChild(li);
});

connection.on("ReceiveDirectMessage", function (recipient, myName, message) {
    console.log("Received direct message");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var li = document.createElement("div");
    li.className = "message --left";
    li.textContent = msg;
    document.getElementById("messageList").appendChild(li);
});

document.getElementById('startButton').addEventListener('click', function () {
    document.getElementById("container").classList.remove("hidden");
    connection.start().then(function () {
        document.getElementById("sendButton").disabled = false;
        // connection.invoke("AddToGroup", "my group");
        var friendlyName = document.getElementById("userInput").value;
        connection.invoke("AddUserToDashboard", friendlyName);
        connection.invoke("AddToGroup", friendlyName);
    }).catch(function (err) {
        return console.error((err.toString()));
    });
})

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    connection.invoke("AddToGroup", user);
    connection.invoke("AddUserToDashboard", user);

    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});