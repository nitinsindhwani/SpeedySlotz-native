// import React, { useState, useEffect, useLayoutEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { getStoredToken, getStoredUser } from "../api/ApiCall";
// import { Client } from "@stomp/stompjs";
// import moment from "moment";
// import { v4 as uuidv4 } from "uuid";
// import { baseApiUrl } from "../api/Config";
// const ChatMessage = ({ route }) => {
//   const { selectedChat: initialSelectedChat } = route.params;
//   const [selectedChat, setSelectedChat] = useState({
//     ...initialSelectedChat,
//     chatMessages: Array.isArray(initialSelectedChat.chatMessages)
//       ? initialSelectedChat.chatMessages
//       : [],
//   });
//   const [currentMessage, setCurrentMessage] = useState("");
//   const navigation = useNavigation();
//   const [client, setClient] = useState(null);

//   const formatTime = (timestamp) => {
//     return moment(timestamp).format("HH:mm");
//   };

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerTitle: selectedChat.business_name
//         ? selectedChat.business_name
//         : "Chat",
//     });
//   }, [navigation, selectedChat.business_name]);

//   useEffect(() => {
//     const secureToken = getStoredToken();
//     const userData = getStoredUser();

//     var SockJS = require("sockjs-client/dist/sockjs.js");
//     const stompClient = new Client({
//       webSocketFactory: () => new SockJS(baseApiUrl + "/websocket"),
//       connectHeaders: { "auth-token": secureToken },
//       onConnect: () => {
//         stompClient.subscribe(
//           `/user/${userData.user_id}/queue/private`,
//           (message) => {
//             const newMessage = JSON.parse(message.body);
//             handleNewMessage(newMessage);
//           }
//         );
//       },
//       onStompError: (frame) => {
//         console.error("Broker reported error: " + frame.headers["message"]);
//       },
//       onDisconnect: () => console.log("Disconnected from server"),
//     });

//     stompClient.activate();
//     setClient(stompClient);
//     return () => stompClient.deactivate();
//   }, []);

//   const handleNewMessage = (newMessage) => {
//     if (newMessage.chat_id === selectedChat.chat_id) {
//       setSelectedChat((prevChat) => {
//         const existingMessageIds = new Set(
//           prevChat.chatMessages.map((m) => m.messageId)
//         );
//         const newUniqueMessages = Object.values(newMessage.chatMessages).filter(
//           (msg) => !existingMessageIds.has(msg.messageId)
//         );

//         return {
//           ...prevChat,
//           chatMessages: [...prevChat.chatMessages, ...newUniqueMessages],
//         };
//       });
//     }
//   };

//   const sendMessage = () => {
//     if (client && client.connected && currentMessage.trim()) {
//       const newMessage = {
//         messageId: uuidv4(),
//         content: currentMessage.trim(),
//         timestamp: moment().toISOString(),
//         messageType: "user",
//       };

//       // Append the new message to the array
//       const updatedChatMessages = [...selectedChat.chatMessages, newMessage];
//       const nextIndex = Object.keys(selectedChat.chatMessages).length;

//       const chatMessage = {
//         chat_id: selectedChat.chat_id,
//         user_id: selectedChat.user_id,
//         username: selectedChat.username,
//         business_id: selectedChat.business_id,
//         business_name: selectedChat.business_name,
//         project_name: selectedChat.project_name,
//         chatMessages: {
//           ...selectedChat.chatMessages,
//           [nextIndex]: newMessage, // Use next index as key
//         },
//       };

//       console.log("Sending message:", chatMessage);

//       client.publish({
//         destination: `/user/${selectedChat.business_id}/queue/private`,
//         body: JSON.stringify(chatMessage), // Sending the whole chatMessage object
//       });

//       // Update local state
//       setSelectedChat((prevChat) => ({
//         ...prevChat,
//         chatMessages: updatedChatMessages,
//       }));

//       setCurrentMessage("");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//     >
//       <ScrollView style={styles.chatMessagesContainer}>
//         {selectedChat.chatMessages.map((message, index) => (
//           <View
//             key={index}
//             style={[
//               styles.chatMessage,
//               message.messageType === "user"
//                 ? styles.senderMessage
//                 : styles.receiverMessage,
//             ]}
//           >
//             <Text style={styles.chatMessageContent}>
//               {message.content}
//               <Text style={styles.messageTime}>
//                 {formatTime(message.timestamp)}
//               </Text>
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//       <View style={styles.messageInputContainer}>
//         <TouchableOpacity
//           onPress={() => {
//             /* Handle attachment */
//           }}
//         >
//           <Ionicons name="add-circle-outline" size={30} color="gray" />
//         </TouchableOpacity>
//         <TextInput
//           style={styles.messageInput}
//           value={currentMessage}
//           onChangeText={setCurrentMessage}
//           placeholder="Type your message here"
//         />
//         <TouchableOpacity onPress={sendMessage}>
//           <Ionicons name="send" size={30} color="blue" />
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   // ... existing styles ...
//   chatMessagesContainer: {
//     // Add styles for chat messages container
//   },
//   chatMessage: {
//     padding: 12,
//     borderRadius: 20,
//     marginVertical: 5,
//     maxWidth: "70%",
//   },
//   senderMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#DCF8C6",
//   },
//   receiverMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#FFF",
//   },
//   messageTime: {
//     fontSize: 12,
//     color: "gray",
//     paddingLeft: 10,
//   },
//   messageInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: "#ddd",
//     backgroundColor: "#fff",
//   },
//   messageInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "gray",
//     padding: 12,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     backgroundColor: "#f9f9f9",
//   },
// });

// export default ChatMessage;
