import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './css/chatbot.css';

const ChatBot = ({ isVisible, onToggle }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            // Make API request to backend
            const response = await axios({
                method: 'post',
                url: 'https://health-app-version2-chatbotendpoint.vercel.app/',
                data: {
                    lang: "English",
                    detail: inputMessage
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log(response.data)

           
            // Safely extract the response text
            let responseText;
            if (typeof response.data === 'object') {
                if (response.data.response.result) {
                    responseText = typeof response.data.response.result === 'string' 
                        ? response.data.response.result 
                        : JSON.stringify(response.data.response.result);
                } else if (response.data.message) {
                    responseText = typeof response.data.message === 'string'
                        ? response.data.message
                        : JSON.stringify(response.data.message);
                } else if (response.data.response) {
                    responseText = typeof response.data.response === 'string'
                        ? response.data.response
                        : JSON.stringify(response.data.response);
                } else {
                    responseText = "I received your message but couldn't process it properly.";
                }
            } else {
                responseText = String(response.data);
            }

            // Add bot response to chat
            const botMessage = {
                text: responseText,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    data: error.config?.data
                }
            });
            
            const errorMessage = {
                text: "Sorry, I encountered an error. Please try again.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className={`chatbot-container ${isVisible ? 'open' : ''}`}>
            <div className="chatbot-header" onClick={onToggle}>
                <h3>Health Assistant</h3>
                <span className={`toggle-icon ${isVisible ? 'open' : ''}`}>▼</span>
            </div>
            
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        <div className="message-content">
                            <p>{message.text}</p>
                            <span className="timestamp">{message.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chatbot-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!isVisible}
                />
                <button type="submit" disabled={!isVisible}>Submit</button>
            </form>
        </div>
    );
};

export default ChatBot; 