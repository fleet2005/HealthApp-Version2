import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

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
            const response = await axios.post('http://127.0.0.1:8000/chatbot/', {
                lang: "English", // Default language
                detail: inputMessage
            });

            // Add bot response to chat
            const botMessage = {
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
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