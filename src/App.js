import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Upload, X, Bot, Calculator, Target, Car, Utensils, Award, Users } from 'lucide-react';

import './index.css'; // Make sure Tailwind is imported

function App() {
    const [isListening, setIsListening] = useState(false);

    const [inputMode, setInputMode] = useState('text');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m CarbonBot, your AI sustainability assistant. How would you like to reduce your carbon footprint today?',
            timestamp: new Date(),
            features: ['voice', 'text', 'calculation', 'recommendation']
        }
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [userProfile] = useState({
        name: 'User',
        dailyCarbon: 12.5,
        weeklyCarbon: 87.3,
        monthlyCarbon: 345.2,
        yearlyGoal: 3000,
        savedCarbon: 156.8,
        level: 7,
        points: 2450
    });

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startVoiceRecognition = () => {
        setIsListening(true);
        setInputMode('voice');
        setTimeout(() => {
            setIsListening(false);
            const voiceCommands = [
                "How can I reduce my carbon footprint?",
                "What's my carbon footprint for today?",
                "Show me eco-friendly transport options",
                "Set a goal to reduce carbon emissions",
                "What are some sustainable food options?"
            ];
            const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
            setCurrentMessage(randomCommand);
            handleSendMessage(randomCommand);
        }, 3000);
    };

    const stopVoiceRecognition = () => {
        setIsListening(false);
    };



    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
                analyzeImage(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = (imageName) => {
        setIsTyping(true);
        setTimeout(() => {
            const analysis = {
                content: "I see a product image. 🌱 Try using reusable packaging for sustainability!",
                features: ['image-analysis', 'recommendation']
            };
            addMessage('bot', analysis.content, analysis.features);
            setIsTyping(false);
            setUploadedImage(null);
        }, 2000);
    };

    const addMessage = (type, content, features = []) => {
        setMessages((prev) => [...prev, {
            id: Date.now(),
            type,
            content,
            timestamp: new Date(),
            features
        }]);

    };

    const handleSendMessage = (msg = currentMessage) => {
        if (!msg.trim()) return;
        addMessage('user', msg);
        setCurrentMessage('');
        setIsTyping(true);
        setTimeout(() => {
            const res = generateBotResponse(msg);
            addMessage('bot', res.content, res.features);
            setIsTyping(false);
        }, 1500);
    };

    const generateBotResponse = (userMsg) => {
        const lower = userMsg.toLowerCase();
        if (lower.includes('carbon')) {
            return {
                content: `Your daily carbon: ${userProfile.dailyCarbon} kg CO2. Weekly: ${userProfile.weeklyCarbon}, Monthly: ${userProfile.monthlyCarbon}.`,
                features: ['calculation', 'tracking']
            };
        } else if (lower.includes('transport')) {
            return {
                content: "Use public transport, biking, or carpooling to cut emissions!",
                features: ['recommendation']
            };
        } else if (lower.includes('food')) {
            return {
                content: "🌿 Try plant-based meals like tofu or lentils for low carbon impact.",
                features: ['recommendation']
            };
        } else {
            return {
                content: "Ask me about your carbon usage, transport, or food tips!",
                features: ['general']
            };
        }
    };

    const quickActions = [
        { icon: Calculator, text: "Calculate Footprint", action: () => handleSendMessage("carbon footprint") },
        { icon: Target, text: "Set Goal", action: () => handleSendMessage("Set carbon goal") },
        { icon: Car, text: "Transport Tips", action: () => handleSendMessage("transport options") },
        { icon: Utensils, text: "Food Tips", action: () => handleSendMessage("food options") },
        { icon: Award, text: "Join Challenge", action: () => handleSendMessage("challenges") },
        { icon: Users, text: "Community", action: () => handleSendMessage("green community") }
    ];

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <header className="bg-white p-4 shadow flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-2 rounded-full">
                        <Bot className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">CarbonBot</h1>
                        <p className="text-sm text-gray-600">Your AI Sustainability Assistant</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`p-2 rounded-full ${voiceEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    >
                        {voiceEnabled ? <Volume2 /> : <VolumeX />}
                    </button>
                    <span className="text-sm">Lvl {userProfile.level}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            {userProfile.points} pts
          </span>
                </div>
            </header>

            <div className="bg-white border-b p-2 flex justify-center gap-2">
                {['text', 'voice', 'image'].map(mode => (
                    <button
                        key={mode}
                        onClick={() => setInputMode(mode)}
                        className={`px-3 py-1 rounded-full ${inputMode === mode ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                ))}
            </div>

            <main className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-sm px-4 py-2 rounded-lg ${msg.type === 'user' ? 'bg-green-500 text-white' : 'bg-white shadow'}`}>
                            <p className="text-sm">{msg.content}</p>
                            <div className="text-xs mt-1 text-gray-400">{msg.timestamp.toLocaleTimeString()}</div>
                            {msg.features?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {msg.features.map((f, i) => (
                                        <span key={i} className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">{f}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="text-sm text-gray-500">CarbonBot is typing...</div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <div className="bg-white border-t p-3">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickActions.map((action, i) => (
                        <button key={i} onClick={action.action} className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100">
                            <action.icon className="w-4 h-4" />
                            <span className="text-sm">{action.text}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-3">
                    {inputMode === 'text' && (
                        <div className="flex items-center gap-2">
                            <input
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 border border-gray-300 p-2 rounded-lg"
                                placeholder="Type your message..."
                            />
                            <button onClick={() => handleSendMessage()} className="bg-green-500 text-white p-2 rounded-lg">
                                <Send />
                            </button>
                        </div>
                    )}
                    {inputMode === 'voice' && (
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                                className={`p-6 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'} text-white`}
                            >
                                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>
                            <p className="text-sm text-gray-500">{isListening ? 'Listening...' : 'Tap to speak'}</p>
                        </div>
                    )}
                    {inputMode === 'image' && (
                        <div className="flex flex-col items-center gap-2">
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                            <button onClick={() => fileInputRef.current?.click()} className="p-6 bg-blue-500 text-white rounded-full">
                                <Upload />
                            </button>
                            {uploadedImage && (
                                <div className="relative">
                                    <img src={uploadedImage} alt="upload" className="w-32 h-32 object-cover rounded-lg" />
                                    <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <p className="text-sm text-gray-500">Upload an image</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
