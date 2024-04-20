import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../Colors";

function Button({ text, iconName, iconColor, onPress, mainContainerStyle, textStyle, paddingStyle }) {
  return (
    <View style={[styles.mainContainer, mainContainerStyle]}>
      <Pressable style={[styles.PressableContainer, paddingStyle]} onPress={onPress}>
        <Ionicons name={iconName} size={20} color={iconColor} />
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  
  mainContainer: {
    width: "75%",
    backgroundColor: Colors.buttonBg,
    borderWidth: 1,
    borderRadius: 50,
    margin: 10,
    borderColor: Colors.buttonOutline,
    alignItems: "center",
  },

  PressableContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 40,
  },

  text: {
    fontSize: 16,
    color: Colors.textTitle,
    fontWeight: "300",
    paddingLeft: 8,
  },
  // mainContainer: {
  //   flex:1,
  //   width:"100%",
  //   height: "100%",

  //   backgroundColor: Colors.buttonBg,
  //   borderWidth: 1,
  //   borderRadius: 50,
  //   margin: 10,
  //   borderColor: Colors.buttonOutline,
  //   alignItems: "center",
  //   justifyContent: 'center',
  // },

  // PressableContainer: {
  //   flex:1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   paddingVertical: 8,
  //   paddingHorizontal: 40,
  // },

  // text: {
  //   textAlign: 'center',
  //   textAlignVertical: 'center',
  //   fontSize: 16,
  //   color: Colors.textTitle,
  //   fontWeight: "300",
  //   paddingLeft: 8,
  // },
});
