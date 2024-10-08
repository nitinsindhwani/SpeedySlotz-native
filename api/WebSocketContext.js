import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import { baseApiUrl } from "../api/Config";
import { getStoredToken, getStoredUser } from "../api/ApiCall";
import SockJS from "sockjs-client";
import * as Notifications from "expo-notifications";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const resetIncomingMessage = useCallback(() => {
    setIncomingMessage(null);
  }, []);

  const broadcastMessage = useCallback((message) => {
    setIncomingMessage({ ...message, _timestamp: Date.now() });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "New Message!",
        body: message.content,
        data: { screen: "ChatScreen", chatData: message },
      },
      trigger: null,
    });
  }, []);

  useEffect(() => {
    const initializeWebSocket = async () => {
      const authToken = await getStoredToken();
      const userData = await getStoredUser();
      if (!authToken || !userData) {
        console.log(
          "No auth token or user data. Aborting WebSocket initialization."
        );
        return;
      }

      const stompClient = new Client({
        webSocketFactory: () => new SockJS(`${baseApiUrl}/websocket`),
        connectHeaders: {
          "auth-token": authToken,
        },

        onConnect: () => {
          stompClient.subscribe(
            `/user/${userData.user_id}/queue/private`,
            (message) => {
              const newMessage = JSON.parse(message.body);
              broadcastMessage(newMessage);
            }
          );
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame.headers["message"]);
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
        },
      });

      stompClient.activate();
      setClient(stompClient);

      return () => {
        client?.deactivate();
      };
    };

    initializeWebSocket();
  }, [broadcastMessage]);

  return (
    <WebSocketContext.Provider
      value={{
        client,
        incomingMessage,
        broadcastMessage,
        resetIncomingMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
