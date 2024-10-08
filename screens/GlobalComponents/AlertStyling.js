import { StyleSheet, Dimensions } from "react-native";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("screen").height;

import { theme3 } from "../../assets/branding/themes";

const AlertStyles = StyleSheet.create({
  Container: {
    width: WindowWidth,
    height: WindowHeight,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  AlertBox: {
    width: WindowWidth / 1.2,
    borderRadius: 20,
    backgroundColor: theme3.GlobalBg,
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  AlertTitle: {
    color: theme3.fontColor,
    fontWeight: "bold",
    fontSize: 16,
  },
  AlertTxt: {
    color: theme3.fontColor,
    margin: 10,
    textAlign: "center",
  },
  ButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  Button: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  ConfirmButton: {
    backgroundColor: theme3.primaryColor,
    marginLeft: 10,
  },
  CancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  BtnTxt: {
    color: theme3.GlobalBg,
    fontWeight: "bold",
  },
  CancelBtnTxt: {
    color: "#333",
    fontWeight: "bold",
  },
});
export default AlertStyles;
