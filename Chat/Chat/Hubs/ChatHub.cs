using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Chat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            // await SendDirectMessage("my group", "user", message);
            Console.WriteLine("Indirect");

            await Clients.Group(user).SendAsync("ReceiveMessage", Context.ConnectionId, user, message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine(groupName + " hello there");
            var friendlyName = groupName;
        }

        public async Task AddToAdminGroup(string name)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admin");
            Console.WriteLine("Connected");
            await Clients.Group("admin").SendAsync("AdminConnected", name);
        }

        public async Task AddUserToDashboard(string user)
        {
            Console.WriteLine(">>> Hello");
            await Groups.AddToGroupAsync(Context.ConnectionId, "admin");
            await Clients.Group("admin").SendAsync("UserConnected", user);
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("ReceiveMessage", Context.ConnectionId, groupName, $"Left the group: {groupName}");
        }

        public async Task SendDirectMessage(string recipient, string myName, string message)
        {
            Console.WriteLine("Direct");
            System.Console.WriteLine(recipient);
            System.Console.WriteLine(myName);
            System.Console.WriteLine(message);
            await Clients.Group(recipient).SendAsync("ReceiveDirectMessage", recipient, myName, message);
        }
    }
}
