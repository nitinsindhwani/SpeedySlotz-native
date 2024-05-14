const handleChatButtonPress = async (business) => {
    let user = userData;
    if (!user) {
      user = await getStoredUser(); // Synchronously get user data if not already loaded
      if (!user) {
        console.error("User data is not available.");
        return; // Optionally, handle this case (e.g., show an error)
      }
    }
    if (business.is_registered) {
      const selectedChat = {
        chat_id: uuidv4(),
        project_name: "New Job",
        user_id: user.user_id, // Use local user variable
        username: user.username, // Use local user variable
        business_id: business.id,
        business_name: business.name,
        chatMessages: [],
      };

      navigation.navigate("App", {
        screen: "ChatScreen",
        params: {
          chatData: selectedChat,
        },
      });
    }
  };
  export default handleChatButtonPress