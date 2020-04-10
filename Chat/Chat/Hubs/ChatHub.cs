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
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            Console.WriteLine("Hello");
            await Clients.Group(groupName).SendAsync("ReceiveMessage", Context.ConnectionId, $"Joined the group: {groupName}");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("ReceiveMessage", Context.ConnectionId, $"Left the group: {groupName}");
        }

        public async Task SendDirectMessage(string recipient, string myName, string message)
        {
            Console.WriteLine("Direct");
            await Clients.Group(recipient).SendAsync("ReceiveDirectMessage", recipient, myName, message);
        }
    }
}
