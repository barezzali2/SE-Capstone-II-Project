import { useState } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import styles from "./ChatbotAssistant.module.css";
import { motion, AnimatePresence } from "framer-motion";

function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your shopping assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const recommendedQuestions = [
    "What are the best deals today?",
    "Can you recommend products for me?",
    "How do I find items on sale?",
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleRecommendedQuestion = (question) => {
    // this is the message from the user for the recommended questions
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // this is the response from the bot, for now it is hardcoded but in a real implementation it would be an LLM response by an API call
    setTimeout(() => {
      let botResponse;

      if (question === "What are the best deals today?") {
        botResponse = {
          id: messages.length + 2,
          text: "We have great discounts on electronics and clothing today! Check out our featured products section for items with up to 50% off.",
          sender: "bot",
          timestamp: new Date(),
        };
      } else if (question === "Can you recommend products for me?") {
        botResponse = {
          id: messages.length + 2,
          text: "I'd be happy to recommend products! What categories are you interested in? We have great options in electronics, fashion, and home goods.",
          sender: "bot",
          timestamp: new Date(),
        };
      } else if (question === "How do I find items on sale?") {
        botResponse = {
          id: messages.length + 2,
          text: "You can find sale items by clicking on the 'Discounts' section or by using the filter option in our product listings to show only discounted items.",
          sender: "bot",
          timestamp: new Date(),
        };
      } else {
        botResponse = {
          id: messages.length + 2,
          text:
            "This is a demo chatbot. In a real implementation, I would respond to your question about: " +
            question,
          sender: "bot",
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // this is the message from the user for the input field
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // this is the response from the bot, for now it is hardcoded but in a real implementation it would be an LLM response by an API call
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "This is a demo chatbot. In a real implementation, I would respond to your message.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      <motion.button
        className={styles.chatButton}
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiMessageCircle size={26} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatContainer}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.chatHeader}>
              <h3>Shopping Assistant</h3>
              <button className={styles.closeButton} onClick={toggleChat}>
                <FiX size={20} />
              </button>
            </div>

            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage
                  }`}
                >
                  <p>{message.text}</p>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.recommendedQuestions}>
              <p>Try asking:</p>
              <div className={styles.questionButtons}>
                {recommendedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecommendedQuestion(question)}
                    className={styles.recommendedButton}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <form className={styles.chatInput} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className={styles.sendButton}>
                <FiSend size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotAssistant;
