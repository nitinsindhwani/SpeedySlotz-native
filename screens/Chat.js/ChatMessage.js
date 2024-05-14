import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useWebSocket } from "../../api/WebSocketContext";
import goback from "../../assets/newimage/goback.png";
import emoji from "../../assets/newimage/emoji.png";
import attachment from "../../assets/newimage/attachment.png";
import chatmenu from "../../assets/newimage/chatmenu.png";
import { theme3 } from "../../assets/branding/themes";
import Styles from "../../assets/branding/GlobalStyles";
import { v4 as uuidv4 } from "uuid";
const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

const primaryColor = "#084887";
const secondaryColor = "#f9ab55";
const fontColor = "#ffffff"; // Assuming you want white text on the colored backgrounds

const ChatMessage = ({ route }) => {
  const navigation = useNavigation();
  const { client, incomingMessage, resetIncomingMessage } = useWebSocket();
  const keyExtractor = (item) => item.messageId;

  const [currentChat, setCurrentChat] = useState(route.params.currentChat);

  const [messages, setMessages] = useState(
    currentChat?.chatMessages ? Object.values(currentChat.chatMessages) : []
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (
      incomingMessage &&
      incomingMessage.business_id === currentChat.business_id
    ) {
      // Extract messages from incomingMessage
      const newMessages = Object.values(incomingMessage.chatMessages || {});

      // Create a Set of existing message IDs for faster lookup
      const existingIds = new Set(messages.map((msg) => msg.messageId));

      // Filter out any messages that already exist in the state
      const uniqueNewMessages = newMessages.filter(
        (newMsg) => !existingIds.has(newMsg.messageId)
      );

      // Append the new, unique messages to the state
      setMessages((prevMessages) => [...prevMessages, ...uniqueNewMessages]);

      // Reset the incoming message to prevent re-processing
      resetIncomingMessage();
    }
  }, [
    incomingMessage,
    currentChat.business_id,
    messages,
    resetIncomingMessage,
  ]);

  const sendMessage = () => {
    if (client && client.connected && currentMessage.trim()) {
      const newMessage = {
        messageId: uuidv4(),
        content: currentMessage.trim(),
        timestamp: moment().toISOString(),
        messageType: "user",
      };

      // Calculate the next index based on the current number of messages
      const nextIndex = Object.keys(currentChat.chatMessages).length;

      // Construct the message object including the new message with its index
      const chatMessage = {
        ...currentChat,
        chatMessages: {
          ...currentChat.chatMessages,
          [nextIndex]: newMessage,
        },
      };

      // Append the new message to the array
      const updatedChatMessages = [...messages, newMessage];
      console.log("Sending to Web:", chatMessage);
      client.publish({
        destination: `/user/${currentChat.business_id}/queue/private`,
        body: JSON.stringify(chatMessage), // Sending the whole chatMessage object
      });

      setMessages(updatedChatMessages);
      setCurrentChat({
        ...currentChat,
        chatMessages: updatedChatMessages,
      });

      setCurrentMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View
        style={[
          Styles.Header,
          { justifyContent: "space-between", paddingTop: 30 },
        ]}
      >
        <View style={[Styles.HeaderI]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={goback}
              style={{ width: 8, height: 14, margin: 20 }}
            />
          </TouchableOpacity>

          <Text
            onPress={() => {
              onPress();
            }}
            style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
          >
            {currentChat?.business_name}
          </Text>
        </View>
        <Image
          source={chatmenu}
          style={{ width: 20, height: 20, margin: 20 }}
        />
      </View>
      <FlatList
        data={messages}
        keyExtractor={keyExtractor} // Use messageId as the key, which should be unique
        renderItem={({ item }) => {
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
        }}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <Image source={emoji} style={styles.emojiIcon} />
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginRight: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    margin: 10,
    borderRadius: 20,
    padding: 10,
  },
  userMessage: {
    backgroundColor: theme3.secondaryColor,
    alignSelf: "flex-end",
    marginRight: 20,
  },
  providerMessage: {
    backgroundColor: theme3.primaryColor,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  messageText: {
    color: fontColor,
  },
  messageTimestamp: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  emojiIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  TextInput: {
    width: WindowWidth / 1.12,
    borderRadius: 10,
    backgroundColor: "#F0F4FE",
    height: WindowHeight / 17,
    marginBottom: 50,
    alignSelf: "flex-end",
    shadowColor: "black",
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E1E1E1",
  },
  sendButton: {
    padding: 10,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
});

export default ChatMessage;
