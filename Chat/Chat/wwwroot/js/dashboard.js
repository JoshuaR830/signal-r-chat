"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var users = []
var myName = "Alana"

document.getElementById("sendDirectButton").disabled = true;

connection.start().then(function () {
    document.getElementById("sendDirectButton").disabled = false;
    connection.invoke("AddToAdminGroup", myName);
    console.log("Start AddToGroup");
}).catch(function (err) {
    return console.error((err.toString()));
});

connection.on("UserConnected", function(user) {
    console.log(user);
    if(!users.includes(user)) {
        console.log("Create");
        users.push(user);
        var container = document.createElement("div");
        container.id = "message-container-" + user;
        container.className = "message-container";
        document.getElementById("messageList").appendChild(container);
        console.log(">>>>" + user)
        connection.invoke("AddToGroup", user);

        console.log("> Hello <");

        var li = document.createElement("div");
        li.className = "message --left";
        li.textContent = user + " would like help";
        console.log("message-container-" + user);
        var messageContainer = document.getElementById("message-container-" + user);
        console.log("messageContainer");
        messageContainer.appendChild(li);

    }
});

connection.on("AdminConnected", function (name) {
    console.log(name);

    if (name == myName) {
        document.getElementById("messageList").classList.add("online");
    }

    console.log("Online")
});

connection.on("ReceiveMessage", function (user, friendlyName, message) {
    console.log(user);

    if (!users.includes(friendlyName)) {
        connection.invoke("AddToGroup", friendlyName);
        users.push(user);
    }

    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");

    var li = document.createElement("div");
    li.className = "message --left";
    li.textContent = msg;
    var messageContainer = document.getElementById("message-container-" + friendlyName);
    messageContainer.appendChild(li);
});

connection.on("ReceiveDirectMessage", function (recipient, myName, message) {
    console.log("Received direct message");
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var li = document.createElement("div");
    li.className = "message --right";
    li.textContent = msg;
    var messageContainer = document.getElementById("message-container-" + recipient);
    messageContainer.appendChild(li);
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