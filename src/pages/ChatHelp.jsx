import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
  Settings,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Target,
  Lightbulb,
  HelpCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
} from "lucide-react";

// Message Component
const Message = ({ message, onRate, onCopy }) => {
  const [showActions, setShowActions] = useState(false);
  const [rating, setRating] = useState(null);

  const handleRate = (type) => {
    setRating(type);
    onRate(message.id, type);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    onCopy();
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-6`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg ${
          message.sender === "user" ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`flex items-start space-x-3 ${
            message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === "user"
                ? "bg-emerald-500"
                : "bg-gradient-to-br from-emerald-500 to-teal-600"
            }`}
          >
            {message.sender === "user" ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>

          <div
            className={`px-4 py-3 rounded-2xl ${
              message.sender === "user"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-emerald-100 text-slate-800 shadow-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <div className="text-xs opacity-70 mt-2">{message.timestamp}</div>
          </div>
        </div>

        {/* Message Actions */}
        {showActions && message.sender === "bot" && (
          <div className="flex items-center space-x-2 mt-2 ml-11 animate-in fade-in duration-200">
            <button
              onClick={() => handleRate("up")}
              className={`p-1 rounded-full hover:bg-emerald-50 transition-colors ${
                rating === "up"
                  ? "bg-emerald-100 text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleRate("down")}
              className={`p-1 rounded-full hover:bg-emerald-50 transition-colors ${
                rating === "down"
                  ? "bg-emerald-100 text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded-full hover:bg-emerald-50 transition-colors text-slate-400"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  color = "emerald",
}) => {
  const colorClasses = {
    emerald:
      "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    teal: "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100",
    blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-105 ${colorClasses[color]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex justify-start mb-6">
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-emerald-100 px-4 py-3 rounded-2xl shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Main Chatbot Component
const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Study Assistant. I'm here to help you with your academic questions, study tips, grade explanations, and any concerns about your learning journey. How can I assist you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text = inputValue) => {
    if (text.trim()) {
      const userMessage = {
        id: Date.now(),
        text: text.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsTyping(true);

      try {
        const res = await fetch("http://127.0.0.1:8001/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text.trim() }),
        });

        const data = await res.json();
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        console.error("API error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Oops! There was a problem connecting to the assistant.",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      grades: "Can you explain my current grades and how I can improve them?",
      study: "I need help creating an effective study plan. Can you assist me?",
      homework:
        "I'm struggling with my homework. Can you provide some guidance?",
      motivation:
        "I'm feeling unmotivated about my studies. Can you help me stay focused?",
      goals: "Help me set realistic academic goals for this semester.",
      tips: "What are some effective study techniques I should try?",
    };

    sendMessage(quickMessages[action]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Chat cleared! I'm here to help you with any new questions you might have.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleRateMessage = (messageId, rating) => {
    // Handle message rating logic here
    console.log(`Message ${messageId} rated: ${rating}`);
  };

  const handleCopyMessage = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const exportChat = () => {
    const chatContent = messages
      .map(
        (msg) =>
          `[${msg.timestamp}] ${
            msg.sender === "user" ? "You" : "AI Assistant"
          }: ${msg.text}`
      )
      .join("\n\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  AI Study Assistant
                </h1>
                <p className="text-sm text-emerald-600">
                  Your Personal Learning Companion
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportChat}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title="Export Chat"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={clearChat}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title="Clear Chat"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-5 h-5" />
                ) : (
                  <Minimize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <QuickActionButton
                icon={TrendingUp}
                label="My Grades"
                onClick={() => handleQuickAction("grades")}
                color="emerald"
              />
              <QuickActionButton
                icon={BookOpen}
                label="Study Plan"
                onClick={() => handleQuickAction("study")}
                color="teal"
              />
              <QuickActionButton
                icon={HelpCircle}
                label="Homework Help"
                onClick={() => handleQuickAction("homework")}
                color="blue"
              />
              <QuickActionButton
                icon={Target}
                label="Set Goals"
                onClick={() => handleQuickAction("goals")}
                color="emerald"
              />
              <QuickActionButton
                icon={Lightbulb}
                label="Study Tips"
                onClick={() => handleQuickAction("tips")}
                color="teal"
              />
              <QuickActionButton
                icon={Award}
                label="Motivation"
                onClick={() => handleQuickAction("motivation")}
                color="blue"
              />
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 lg:h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-emerald-25 to-white">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  onRate={handleRateMessage}
                  onCopy={handleCopyMessage}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-emerald-100">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && sendMessage()
                    }
                    placeholder="Ask me anything about your studies..."
                    className="w-full px-4 py-3 pr-12 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    disabled={isTyping}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                    Press Enter to send
                  </div>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 font-medium"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <span>
                    💡 Try asking about study techniques, grade explanations, or
                    homework help
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>AI Assistant Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Academic Support
              </h3>
              <p className="text-sm text-slate-600">
                Get help with homework, assignments, and understanding complex
                concepts across all subjects.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Study Planning
              </h3>
              <p className="text-sm text-slate-600">
                Create personalized study schedules and get tips for effective
                time management and learning strategies.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Progress Tracking
              </h3>
              <p className="text-sm text-slate-600">
                Monitor your academic progress, understand your grades, and set
                achievable learning goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-2 duration-300">
          Message copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
