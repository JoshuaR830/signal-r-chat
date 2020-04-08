﻿"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMMessage", function (user, message) {
    var msg = memssage.replace(/&/g, "&amp;").replace(/</g, "&lt").replace(/>/g, "&gt;");
    var encodingMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messageList".appendChild(li);
});

connection.start().then(function () {
    document.getElemenntById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error((err.toString()));
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;

    var message = document.getElementById("messageInput".value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});