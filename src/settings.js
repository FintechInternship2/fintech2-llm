import { createChatBotMessage } from 'react-chatbot-kit';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';

import actionDisabledIcon from '../assets/icons/actionDisabledIcon.png';
import chatIcon from '../assets/icons/chatIcon.png';
import closeChatIcon from '../assets/icons/closeChatIcon.png';
import notificationIcon from '../assets/icons/notificationIcon.png';
import notificationSound from '../assets/sounds/notificationSound.mp3';
import audioIcon from '../assets/icons/audioIcon.png';
import sendButtonIcon from '../assets/icons/sendButtonIcon.png';
import voiceIcon from '../assets/icons/voiceIcon.png';
import botAvatar from '../assets/icons/botAvatar.png';
import userAvatar from '../assets/icons/userAvatar.png';
import fileAttachmentIcon from '../assets/icons/fileAttachmentIcon.png';
import emojiIcon from '../assets/icons/emojiIcon.png';

const config = {
  initialMessages: [createChatBotMessage("Hello, how can I help you?")],
  botName: "ChatBot",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
  state: {
    isOpen: false,
    general: {
      primaryColor: "#42b0c5",
      secondaryColor: "#491d8d",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      showHeader: true,
      showFooter: true,
      showInputRow: true,
      actionDisabledIcon: actionDisabledIcon,
      embedded: false,
      desktopEnabled: true,
      mobileEnabled: true,
      flowStartTrigger: "ON_LOAD",
    },
    tooltip: {
      mode: "CLOSE",
      text: "Talk to me! 😊",
    },
    chatButton: {
      icon: chatIcon,
    },
    header: {
      title: (
        <div style={{ cursor: "pointer", margin: 0, fontSize: 20, fontWeight: "bold" }} onClick={() => window.open("https://github.com/tjtanjin/")}>
          Tan Jin
        </div>
      ),
      showAvatar: true,
      avatar: botAvatar,
      buttons: ["NOTIFICATION_BUTTON", "AUDIO_BUTTON", "CLOSE_CHAT_BUTTON"],
      closeChatIcon: closeChatIcon,
    },
    notification: {
      disabled: false,
      defaultToggledOn: true,
      volume: 0.2,
      icon: notificationIcon,
      sound: notificationSound,
      showCount: true,
    },
    audio: {
      disabled: true,
      defaultToggledOn: false,
      language: "en-US",
      voiceNames: ["Microsoft David - English (United States)", "Alex (English - United States)"],
      rate: 1,
      volume: 1,
      icon: audioIcon,
    },
    chatHistory: {
      disabled: false,
      maxEntries: 30,
      storageKey: "rcb-history",
      viewChatHistoryButtonText: "Load Chat History ⟳",
      chatHistoryLineBreakText: "----- Previous Chat History -----",
      autoLoad: false,
    },
    chatInput: {
      disabled: false,
      allowNewline: false,
      enabledPlaceholderText: "Type your message...",
      disabledPlaceholderText: "",
      showCharacterCount: false,
      characterLimit: -1,
      botDelay: 1000,
      sendButtonIcon: sendButtonIcon,
      blockSpam: true,
      sendOptionOutput: true,
      sendCheckboxOutput: true,
      buttons: ["VOICE_MESSAGE_BUTTON", "SEND_MESSAGE_BUTTON"]
    },
    chatWindow: {
      showScrollbar: false,
      autoJumpToBottom: false,
      showMessagePrompt: true,
      messagePromptText: "New Messages ↓",
      messagePromptOffset: 30,
    },
    sensitiveInput: {
      maskInTextArea: true,
      maskInUserBubble: true,
      asterisksCount: 10,
      hideInUserBubble: false,
    },
    userBubble: {
      animate: true,
      showAvatar: false,
      avatar: userAvatar,
      simStream: false,
      streamSpeed: 30,
      dangerouslySetInnerHtml: false,
    },
    botBubble: {
      animate: true,
      showAvatar: false,
      avatar: botAvatar,
      simStream: false,
      streamSpeed: 30,
      dangerouslySetInnerHtml: false,
    },
    voice: {
      disabled: true,
      defaultToggledOn: false,
      language: "en-US",
      timeoutPeriod: 10000,
      autoSendDisabled: false,
      autoSendPeriod: 1000,
      sendAsAudio: false,
      icon: voiceIcon,
    },
    footer: {
      text: (
        <div style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", columnGap: 3 }} onClick={() => window.open("https://react-chatbotify.com")}>
          <span key={0}>Powered By </span>
          <img key={1} style={{
            borderRadius: "50%",
            width: 14, height: 14, backgroundImage: `url(${chatIcon}), linear-gradient(to right, #42b0c5, #491d8d)`
          }}>
          </img>
          <span key={2} style={{ fontWeight: "bold" }}> React ChatBotify</span>
        </div>
      ),
      buttons: ["FILE_ATTACHMENT_BUTTON", "EMOJI_PICKER_BUTTON"]
    },
    fileAttachment: {
      disabled: false,
      multiple: true,
      accept: ".png",
      icon: fileAttachmentIcon,
      sendFileName: true,
      showMediaDisplay: true,
    },
    emoji: {
      disabled: false,
      icon: emojiIcon,
      list: ["😀", "😃", "😄", "😅", "😊", "😌", "😇", "🙃", "🤣", "😍", "🥰", "🥳", "🎉", "🎈", "🚀", "⭐️"]
    },
    advance: {
      useAdvancedMessages: false,
      useAdvancedSettings: false,
      useAdvancedPaths: false,
      useAdvancedStyles: false,
    }
  }
};

export default config;
