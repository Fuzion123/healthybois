import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

const connect = async (setMessages) => {
    try {

        console.log("Connecting...")

        const connection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}/chat`)
            .configureLogging(LogLevel.Information)
            .build();

        connection.on('newMessage', ( chatMessage ) => {

            console.log("called!")

            setMessages(messages => [...messages, 
                { 
                    user: chatMessage.user, 
                    message: chatMessage.message 
                }])
        });

        await connection.start();

        console.log("Successfully connected.")

        return connection;

    } catch (error) {
        console.error(error);
    } 
}

const sendMessage = async (connection, user, message) => {
    await connection.invoke("SendMessage", { user, message });
}


export const signalrHelper = {
    connect: connect,
    sendMessage: sendMessage
}