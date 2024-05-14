// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { Client } from "@stomp/stompjs";
// import { baseApiUrl } from "../api/Config";
// import {
//   getStoredToken,
//   getStoredUser,
//   fetchChatHistory,
// } from "../api/ApiCall";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import moment from "moment";
// const ChatScreen = (route) => {
//   const [client, setClient] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigation = useNavigation();
//   const [userData, setUserData] = useState(null);
//   const [authToken, setAuthToken] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const data = await getStoredUser(); // Assuming getStoredUser is an async function
//       console.log("User Data:", data); // Debugging line
//       setUserData(data);
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchAuthToken = async () => {
//       const token = await getStoredToken(); // Assuming getStoredUser is an async function
//       console.log("Auth Token:", token); // Debugging line
//       setAuthToken(token);
//     };

//     fetchAuthToken();
//   }, []);

//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <Ionicons
//           name="arrow-back"
//           size={24}
//           color="black"
//           style={{ marginLeft: 10 }} // Adjust the margin as needed
//           onPress={() => navigation.goBack()}
//         />
//       ),
//       headerTitle: "Chat",
//       headerTitleStyle: {
//         fontWeight: "bold",
//         fontSize: 24,
//         color: "purple", // You can adjust color and other CSS properties as needed
//       },
//       headerStyle: {
//         backgroundColor: "white", // Adjust background color or other CSS properties
//       },
//     });
//   }, [navigation]);

//   useEffect(() => {
//     if (!authToken || !userData) return;
//     const fetchHistory = async () => {
//       const chatInfo = {
//         business_id: userData.business_id || null,
//         user_id: userData.user_id || null,
//         username: userData.username || null,
//       };

//       try {
//         const chatHistoryResponse = await fetchChatHistory(chatInfo, authToken);
//         if (chatHistoryResponse?.data) {
//           const formattedChats = chatHistoryResponse.data.map((chat) => ({
//             ...chat,
//             chatMessages: Object.values(chat.chatMessages || {}),
//           }));
//           setMessages(formattedChats);

//           // Corrected to use formattedChats instead of sortedChats
//           const currentChat = formattedChats.find(
//             (chat) =>
//               chat.username.toLowerCase() === slot?.username.toLowerCase()
//           );

//           // If there's no chat history for the current user/slot, initialize a new chat
//           if (!currentChat && slot) {
//             const newChat = {
//               chat_id: uuidv4(), // Ensure you have a UUID generator
//               username: slot.username,
//               user_id: slot.user_id,
//               business_id: slot.business_id,
//               business_name: slot.business_name,
//               selectedServiceType:
//                 slot &&
//                 slot.selectedServiceTypes &&
//                 slot.selectedServiceTypes.length > 0
//                   ? slot.selectedServiceTypes[0]
//                   : null,
//               chatMessages: [],
//               // Include other necessary fields
//             };
//             setSelectedChat(newChat);
//             setMessages((prevMessages) => [...prevMessages, newChat]); // Add the new chat to messages
//           } else {
//             setSelectedChat(currentChat);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching chat history:", error);
//       }
//     };

//     fetchHistory();
//   }, [authToken, userData]);

//   useEffect(() => {
//     if (!authToken || !userData || !userData.user_id) return;
//     const initializeWebSocketConnection = async () => {
//       var SockJS = require("sockjs-client/dist/sockjs.js");
//       const stompClient = new Client({
//         webSocketFactory: () => new SockJS(baseApiUrl + "/websocket"),
//         connectHeaders: {
//           "auth-token": authToken,
//         },
//         onConnect: () => {
//           console.log("Connected to the server");

//           // Subscribe to the user's private queue
//           stompClient.subscribe(
//             `/user/${userData.user_id}/queue/private`,
//             (message) => {
//               // Handle incoming message for the user
//               console.log("Received: ", message.body);
//               const newMessage = JSON.parse(message.body);
//               handleNewMessage(newMessage);
//             }
//           );
//         },
//         // Include onError and onDisconnect handlers
//       });

//       stompClient.activate();
//       setClient(stompClient);

//       return () => {
//         stompClient.deactivate();
//       };
//     };

//     initializeWebSocketConnection();
//   }, [authToken, userData?.user_id]);

//   const handleNewMessage = (newMessage) => {
//     setMessages((prevMessages) => {
//       // Ensure newMessage.chatMessages is an array
//       const newChatMessages = Array.isArray(newMessage.chatMessages)
//         ? newMessage.chatMessages
//         : Object.values(newMessage.chatMessages || {});

//       const existingChatIndex = prevMessages.findIndex(
//         (chat) => chat.chat_id === newMessage.chat_id
//       );

//       if (existingChatIndex >= 0) {
//         const updatedChat = {
//           ...prevMessages[existingChatIndex],
//           chatMessages: newChatMessages,
//         };
//         return [
//           ...prevMessages.slice(0, existingChatIndex),
//           updatedChat,
//           ...prevMessages.slice(existingChatIndex + 1),
//         ];
//       } else {
//         return [
//           ...prevMessages,
//           { ...newMessage, chatMessages: newChatMessages },
//         ];
//       }
//     });
//   };

//   const renderMessageItem = ({ item }) => {
//     const chatMessagesArray = item.chatMessages || [];
//     const lastMessage = chatMessagesArray[chatMessagesArray.length - 1];
//     const formattedDate = lastMessage
//       ? moment(lastMessage.timestamp).format("MM/DD")
//       : "";

//     return (
//       <TouchableOpacity
//         style={styles.messageItem}
//         onPress={() =>
//           navigation.navigate("ChatMessage", { selectedChat: item })
//         }
//       >
//         <View style={styles.messageHeader}>
//           <Text style={styles.messageTitle}>{item.business_name}</Text>
//           <Text style={styles.messageDate}>{formattedDate}</Text>
//         </View>
//         <Text style={styles.messagePreview}>
//           {lastMessage ? lastMessage.content : "No message"}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//         placeholder="Search messages"
//       />
//       <FlatList
//         data={messages.filter((msg) =>
//           msg.business_name.toLowerCase().includes(searchQuery.toLowerCase())
//         )}
//         renderItem={renderMessageItem}
//         keyExtractor={(item) => item.chat_id}
//         style={styles.messageList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "rgba(255, 255, 255, 0.5)",
//   },

//   searchInput: {
//     borderWidth: 1,
//     borderColor: "gray",
//     padding: 10,
//     marginBottom: 10,
//   },
//   messageItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "gray",
//   },
//   messageTitle: {
//     fontWeight: "bold",
//   },
//   messageDate: {
//     fontSize: 12,
//     color: "gray",
//   },
//   messagePreview: {
//     color: "gray",
//   },
//   messageHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   messageList: {
//     marginTop: 10,
//   },
// });

// export default ChatScreen;
