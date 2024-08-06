// ActionProvider.js
import { sendMessageToChatbot } from '../api/chatbot';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage, stateRef, createCustomMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  handleHello = async () => {
    const message = "Hello";
    const botResponse = await sendMessageToChatbot([message]);

    const responseMessage = this.createChatBotMessage(botResponse);
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, responseMessage]
    }));
  };

  handleMessage = async (message) => {
    const botResponse = await sendMessageToChatbot([message]);

    const responseMessage = this.createChatBotMessage(botResponse);
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, responseMessage]
    }));
  };
}

export default ActionProvider;

