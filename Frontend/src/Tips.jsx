import React, { useState, useEffect } from "react";
import "./css/tips.css";

const gymQuotes = [
    "The only bad workout is the one that didn’t happen.",
    "Push yourself, because no one else is going to do it for you.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Success starts with self-discipline.",
    "Wake up. Work out. Look hot. Kick ass.",
    "Strength does not come from the body. It comes from the will.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Every champion was once a contender that refused to give up.",
    "You don’t find willpower, you create it.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Sweat is just fat crying.",
    "It’s not whether you get knocked down, it’s whether you get up.",
    "Excuses don’t burn calories.",
    "Fall in love with taking care of your body.",
    "You didn’t wake up today to be mediocre.",
    "Stronger than yesterday, weaker than tomorrow.",
    "A one-hour workout is only 4% of your day. No excuses.",
    "Train insane or remain the same.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "You are stronger than you think."
];

const healthTips = [
    "Drink at least 8 glasses of water a day.",
    "Get enough sleep – at least 7-9 hours each night.",
    "Eat more protein to keep muscles strong.",
    "Never skip breakfast – it's the most important meal of the day.",
    "Limit sugar intake to stay healthy.",
    "Stretch before and after workouts to prevent injury.",
    "Include fiber-rich foods in your diet for better digestion.",
    "Avoid processed foods as much as possible.",
    "Take short breaks from screen time to protect your eyes.",
    "Eat a variety of colorful fruits and vegetables every day.",
    "Practice mindful eating – chew slowly and enjoy your food.",
    "Strength training is just as important as cardio.",
    "Reduce stress through meditation or deep breathing.",
    "Avoid drinking sugary beverages – stick to water or herbal tea.",
    "Use smaller plates to control portion sizes.",
    "Limit sodium intake to keep your heart healthy.",
    "Take a 10-minute walk after meals to aid digestion.",
    "Start your day with a glass of warm water and lemon.",
    "Keep your posture in check to avoid back problems.",
    "Stay consistent – small healthy habits add up over time."
];

const Tips = () => {
    const [randomQuote, setRandomQuote] = useState("");
    const [randomTip, setRandomTip] = useState("");

    useEffect(() => {
        setRandomQuote(gymQuotes[Math.floor(Math.random() * gymQuotes.length)]);
        setRandomTip(healthTips[Math.floor(Math.random() * healthTips.length)]);
    }, []);

    return (
        <div className="tips-container">
            <div className="tip-card">
                <h2>💪 Quote</h2>
                <p className="quote">"{randomQuote}"</p>
            </div>
            <div className="tip-card">
                <h2>🍏 Health Tip</h2>
                <p className="health-tip">{randomTip}</p>
            </div>
        </div>
    );
};

export default Tips;
