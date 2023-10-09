import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const connect = async (setMessages) => {
  try {
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}/chat`)
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on("newMessage", (chatMessage) => {
      setMessages((messages) => [
        ...messages,
        {
          user: chatMessage.user,
          message: chatMessage.message,
        },
      ]);
    });

    await connection.start();

    return connection;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = async (connection, user, message) => {
  await connection.invoke("SendMessage", { user, message });
};

export const signalrHelper = {
  connect: connect,
  sendMessage: sendMessage,
};
