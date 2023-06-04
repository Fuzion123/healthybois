using Microsoft.AspNetCore.SignalR;

namespace WebApi.SignalR
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(ChatMessage chatMessage)
        {
            await Clients.All.SendAsync("newMessage", new ChatMessage()
            {
                Message = chatMessage.Message,
                User = chatMessage.User
            });
        }
    }

    public class ChatMessage
    {
        public string User { get; set; }
        public string Message { get; set; }
    }
}
