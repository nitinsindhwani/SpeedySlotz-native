import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";

import Styles from "../../assets/branding/GlobalStyles";
import ChatProf from "../../assets/newimage/users.png";
import Search from "../../assets/newimage/Search.png";
import { useNavigation } from "@react-navigation/native";
import { theme3 } from "../../assets/branding/themes";

import { useWebSocket } from "../../api/WebSocketContext";
import {
  getStoredToken,
  getStoredUser,
  fetchChatHistory,
} from "../../api/ApiCall";

import NoDataFound from "../GlobalComponents/NoDataFound";
import Header from "../../components/Header";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false); // Added state for 'open'
  const [searchInput, setSearchInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [chats, setChats] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const { incomingMessage, resetIncomingMessage } = useWebSocket();
  const [currentChat, setCurrentChat] = useState(null);
  const [activeChatMessage, setActiveChatMessage] = useState(null);

  // Call this function when you need to navigate back
  const goBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const initialize = async () => {
      const [user, token] = await Promise.all([
        getStoredUser(),
        getStoredToken(),
      ]);
      if (user && token) {
        setUserData(user);
        loadChats(user, token);
      }
    };
    initialize();
  }, []);

  const loadChats = async (user, token) => {
    const chatInfo = { user_id: user.user_id, username: user.username };
    const fetchedChats = await fetchChatHistory(chatInfo, token);
    const formattedChats = fetchedChats.data.map((chat) => ({
      ...chat,
      chatMessages: Object.values(chat.chatMessages || {}),
    }));
    setChats(formattedChats);
    setFilteredResults(formattedChats);
  };
  const isToday = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Function to format the date
  const formatDate = (timestamp) => {
    if (isToday(timestamp)) {
      // Return just the time for today
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Return the date in small font for other days
      return (
        <Text style={{ fontSize: 10 }}>
          {new Date(timestamp).toLocaleDateString()}
        </Text>
      );
    }
  };
  useEffect(() => {
    // Handle data from the DetailScreen
    if (route.params?.chatData) {
      handleIncomingData(route.params.chatData, "detailScreen");
    }
  }, [route.params?.chatData]);

  useEffect(() => {
    // Handle incoming WebSocket messages
    if (incomingMessage) {
      handleIncomingData(incomingMessage, "incomingMessage");
      resetIncomingMessage();
    }
  }, [incomingMessage, resetIncomingMessage]);
  const handleIncomingData = (data, source) => {
    let chatIndex = -1;

    if (source === "detailScreen") {
      // Attempt to find an existing chat for the business_id
      chatIndex = chats.findIndex(
        (chat) => chat.business_id === data.business_id
      );
      if (chatIndex !== -1) {
        // Existing chat found, set it as the current chat and navigate
        setCurrentChat(chats[chatIndex]);
        navigateToChat(chats[chatIndex].business_id);
      } else {
        // No existing chat found, create a new one and navigate
        const newChat = {
          ...data,
          chatMessages: [], // Initialize with an empty array of messages
        };
        setChats([...chats, newChat]);
        setFilteredResults([...chats, newChat]);
        // Navigate to the new chat
        navigateToChatWithChatData(newChat);
      }
    } else if (source === "incomingMessage") {
      console.log("incoming", data);
      const incomingMessages = Object.values(data.chatMessages || {});

      chatIndex = chats.findIndex(
        (chat) => chat.business_id === data.business_id
      );

      if (chatIndex !== -1) {
        // Obtain the existing chat messages
        const existingMessages = chats[chatIndex].chatMessages;
        // Create a Set to track existing message IDs
        const existingMessageIds = new Set(
          existingMessages.map((msg) => msg.messageId)
        );

        // Filter the incoming messages to include only those not already present
        const uniqueIncomingMessages = incomingMessages.filter(
          (msg) => !existingMessageIds.has(msg.messageId)
        );

        if (uniqueIncomingMessages.length > 0) {
          // Update the chat messages with the new unique messages
          const updatedChats = [...chats];
          updatedChats[chatIndex].chatMessages = [
            ...existingMessages,
            ...uniqueIncomingMessages,
          ];
          setChats(updatedChats);
          setFilteredResults(updatedChats);

          if (currentChat && currentChat.business_id === data.business_id) {
            setCurrentChat(updatedChats[chatIndex]);
          } else {
            navigateToChatWithChatData(updatedChats[chatIndex]);
          }
        }
      } else {
        // Handle the case for new chat from incoming message
        // ...
      }
    }
  };
  const navigateToChatWithChatData = (chatData) => {
    navigation.navigate("App", {
      screen: "ChatMessage",
      params: {
        currentChat: chatData,
        activeChatMessage: activeChatMessage || chatData, // Pass activeChatMessage or default to chatData
      },
    });
  };

  const navigateToChat = (businessId) => {
    let targetChat = chats.find((chat) => chat.business_id === businessId);
    if (targetChat) {
      setActiveChatMessage(targetChat);
      navigation.navigate("App", {
        screen: "ChatMessage",
        params: { currentChat: targetChat },
      });
    }
  };
  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (!searchValue.trim()) {
      setFilteredResults(chats);
    } else {
      const lowercasedFilter = searchValue.toLowerCase();
      const filteredData = chats.filter(
        (chat) =>
          chat.business_name.toLowerCase().includes(lowercasedFilter) ||
          chat.chatMessages.some((message) =>
            message.content.toLowerCase().includes(lowercasedFilter)
          )
      );
      setFilteredResults(filteredData);
    }
  };

  useEffect(() => {
    const messageCount = chats.reduce((total, chat) => {
      return (
        total +
        (chat.chatMessages ? Object.values(chat.chatMessages).length : 0)
      );
    }, 0);
    console.log(`Total message count across all chats: ${messageCount}`);
  }, [chats]);

  const renderMessageItem = ({ item }) => {
    if (!item || !item.chatMessages || item.chatMessages.length === 0) {
      return null; // or return some fallback UI
    }
    const lastMessage = item.chatMessages[item.chatMessages.length - 1] || {};
    const formattedDate = formatDate(lastMessage.timestamp);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("App", {
            screen: "ChatMessage",
            params: { currentChat: item },
          })
        }
        style={styles.ChatView}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={ChatProf} style={{ width: 40, height: 40 }} />
          <View style={{ marginLeft: 15 }}>
            <Text style={{ color: theme3.fontColor, fontWeight: "bold" }}>
              {item.business_name || "Unknown"}
            </Text>
            <Text style={{ color: theme3.LightTxtClr }}>
              {lastMessage.content || "No messages"}
            </Text>
          </View>
        </View>
        <Text style={{ marginLeft: 10 }}>{formattedDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Pressable onPress={() => setOpen(false)} style={[Styles.Container]}>
      <Header user={userData} />
      <View style={styles.TextInput}>
        <Image
          source={Search}
          style={{ width: 15, height: 15, marginLeft: 15, marginRight: 5 }}
        />
        <TextInput
          value={searchInput}
          onChangeText={searchItems}
          placeholder="Search"
          style={{ flex: 1 }}
        />
      </View>
      <Text style={styles.RecentChatText}>Recent Chat</Text>
      {filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) =>
            item.chat_id ? item.chat_id.toString() : index.toString()
          }
        />
      ) : (
        <NoDataFound />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  TextInput: {
    width: WindowWidth / 1.12,
    borderRadius: 10,
    backgroundColor: "#F0F4FE",
    height: WindowHeight / 17,
    margin: 20,
    alignSelf: "center",
    shadowColor: "black",
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ChatView: {
    width: WindowWidth / 1.12,
    height: WindowHeight / 9.3,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.8,
    borderBottomColor: "#E1E1E1",
  },
  RecentChatText: {
    color: theme3.fontColor,
    fontWeight: "bold",
    alignSelf: "stretch",
    marginLeft: 25,
    fontSize: 17,
    marginTop: 0,
  },
});

export default ChatScreen;
