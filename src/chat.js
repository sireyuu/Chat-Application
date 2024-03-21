// Chat component is where we are sending and receieving messages thru socket.io

import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

//  Need to pass socket and username and room as prop to chat component
function Chat({socket, username, room}) {
        const [currentMessage, setCurrentMessage] = useState("");
        const [messageList, setMessageList] = useState([]); // Passing an array of messages


        // Allows us to send messages over the socket server
        const sendMessage = async () => {
            if (currentMessage !== "") {
                const messageData = {
                    //  We want to know which room we are sending the message to
                    room: room, 
                    author: username,
                    message: currentMessage,
                    time: new Date(Date.now()).getHours() + 
                    ":" + 
                    new Date(Date.now()).getMinutes(),
                };

                //  Need to emit socket message
                await socket.emit("send_message", messageData);
                setMessageList((list => [...list, messageData]));     //    To also see our message when chatting
                setCurrentMessage("");      //  To reset value of input per enter 
            }
        };

        useEffect(() => {
            socket.on("recieve_message", (data) => {
                //  Add callback function for what to do when we recieve message
                setMessageList((list => [...list, data]));
            });
        }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>👋 Chatroom</p>
            </div>
            {/* Where the messages appear */}
            <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                        <div className="message"
                            id={username === messageContent.author ? "you" : "other"}
                            >
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </ScrollToBottom>
            </div>
            {/* Where the inputs and buttons */}
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Aa"
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}  //If key of input is enter, then call send message function
                    />
                <button onClick={sendMessage}>&#9658;</button>    {/* Arrow */}
            </div>

        </div>
    )
}

export default Chat