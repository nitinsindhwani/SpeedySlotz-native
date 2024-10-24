import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useWebSocket } from "../../api/WebSocketContext";
import {
  fetchChatHistory,
  getStoredToken,
  refreshToken,
} from "../../api/ApiCall";
import EmojiSelector from "react-native-emoji-selector";
import goback from "../../assets/newimage/goback.png";
import emoji from "../../assets/newimage/emoji.png";
import attachment from "../../assets/newimage/attachment.png";
import chatmenu from "../../assets/newimage/chatmenu.png";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import uuid from "react-native-uuid";
import ErrorAlert from "../GlobalComponents/ErrorAlert";
import { LanguageContext } from "../../api/LanguageContext"; // Make sure this path is correct
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

const ChatMessage = ({ route }) => {
  const navigation = useNavigation();
  const { client, incomingMessage, resetIncomingMessage } = useWebSocket();

  const { translations, language } = useContext(LanguageContext);

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const flatListRef = useRef();

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (route.params?.currentChat) {
      setCurrentChat(route.params.currentChat);
    } else {
      console.error("No chat data provided in route params");
      setErrorMessage("No chat data available. Please try again.");
      setShowError(true);
    }
  }, []);

  useEffect(() => {
    if (currentChat) {
      loadChatHistory();
    }
  }, [currentChat]);

  const handleCloseError = () => {
    setShowError(false);
    if (errorMessage === "No chat data available. Please try again.") {
      navigation.goBack();
    }
  };

  const loadChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getStoredToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (
        !currentChat.chatMessages ||
        Object.keys(currentChat.chatMessages).length === 0
      ) {
        const chatInfo = {
          user_id: currentChat.user_id,
          username: currentChat.username,
        };
        const result = await fetchChatHistory(chatInfo, token);

        if (result.data && result.data.payload) {
          const chatData = result.data.payload.find(
            (chat) => chat.business_id === currentChat.business_id
          );
          if (chatData) {
            setCurrentChat(chatData);
            const messageArray = Object.values(chatData.chatMessages || {});
            setMessages(messageArray);
          } else {
            setMessages([]);
          }
        }
      } else {
        const messageArray = Object.values(currentChat.chatMessages || {});
        setMessages(messageArray);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setError(error.message || "Failed to load chat history");
      if (error.response && error.response.status === 401) {
        try {
          await refreshToken();
          loadChatHistory();
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setErrorMessage("Your session has expired. Please log in again.");
          setShowError(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (
      incomingMessage &&
      currentChat &&
      incomingMessage.business_id === currentChat.business_id
    ) {
      const newMessages = Object.values(incomingMessage.chatMessages || {});
      const existingIds = new Set(messages.map((msg) => msg.messageId));
      const uniqueNewMessages = newMessages.filter(
        (newMsg) => !existingIds.has(newMsg.messageId)
      );
      setMessages((prevMessages) => [...prevMessages, ...uniqueNewMessages]);
      resetIncomingMessage();
      setTimeout(scrollToBottom, 100);
    }
  }, [
    incomingMessage,
    currentChat,
    messages,
    resetIncomingMessage,
    scrollToBottom,
  ]);

  const sendMessage = () => {
    if (client && client.connected && currentMessage.trim() && currentChat) {
      const newMessage = {
        messageId: uuid.v4(),
        content: currentMessage.trim(),
        timestamp: moment().toISOString(),
        messageType: "user",
      };

      const nextIndex = messages.length;
      const chatMessage = {
        ...currentChat,
        chatMessages: {
          ...currentChat.chatMessages,
          [nextIndex]: newMessage,
        },
      };

      client.publish({
        destination: `/user/${currentChat.business_id}/queue/private`,
        body: JSON.stringify(chatMessage),
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setCurrentChat((prevChat) => ({
        ...prevChat,
        chatMessages: { ...prevChat.chatMessages, [nextIndex]: newMessage },
      }));
      setCurrentMessage("");
      setTimeout(scrollToBottom, 100);
    }
  };

  const renderMessage = ({ item }) => {
    const isUserMessage = item.messageType === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.providerMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTimestamp}>
          {moment(item.timestamp).format("LT")}
        </Text>
      </View>
    );
  };

  const handleEmojiSelected = (emoji) => {
    setCurrentMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <View style={{flex:1}}>

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      // keyboardVerticalOffset={Platform.OS === "android" ? 100 : 60} // Customize this

    >
      <View style={[Styles.Header, styles.header]}>
        <View style={Styles.HeaderI}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={goback} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.businessName}>{currentChat?.business_name}</Text>
        </View>
        <Image source={chatmenu} style={styles.menuIcon} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme3.primaryColor} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadChatHistory}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.messageId}
          renderItem={renderMessage}
          style={styles.messageList}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
        />
      )}
      {showEmojiPicker && (
        <EmojiSelector
          onEmojiSelected={handleEmojiSelected}
          columns={8}
          showSearchBar={false}
          showHistory={false}
          style={styles.emojiPicker}
        />
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Image source={emoji} style={styles.emojiIcon} />
        </TouchableOpacity>
        <TextInput
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image source={attachment} style={styles.attachmentIcon} />
        </TouchableOpacity>
      </View>
      <ErrorAlert
        show={showError}
        onAction={handleCloseError}
        title={translations.actionErrorTitle}
        body={errorMessage}
      />
    </KeyboardAvoidingView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FE",
    height:WindowHeight
  },
  header: {
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backIcon: {
    width: 8,
    height: 14,
    marginRight: 20,
  },
  businessName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    margin: 10,
    borderRadius: 20,
    padding: 10,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: theme3.secondaryColor,
    alignSelf: "flex-end",
  },
  providerMessage: {
    backgroundColor: theme3.primaryColor,
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#ffffff",
  },
  messageTimestamp: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#E1E1E1",
    paddingBottom: 20,
  },
  emojiIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#E1E1E1",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#F0F4FE",
  },
  sendButton: {
    padding: 10,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
  emojiPicker: {
    height: 250,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme3.primaryColor,
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatMessage;
