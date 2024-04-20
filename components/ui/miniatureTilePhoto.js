import { StyleSheet, Pressable, Text, Image, View } from "react-native";

import Colors from "../../Colors";
import { FontAwesome } from "@expo/vector-icons";

function MiniatureTilePhoto({ handlePress, source, text }) {
  return (
    <Pressable onPress={handlePress} style={styles.containerOuter}>
      <Image style={{ height: 60, width: 60, padding: 0 }} source={source} />
      {/* <Pressable onPress={handlePress} style={styles.icon}>
        </Pressable> */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
}

export default MiniatureTilePhoto;

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.buttonBg,
    backgroundColor: Colors.buttonBg,
    marginBottom: 10,
    margin: 7,
  },
  textContainer: {
    flex: 1,
    width: "70%",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
  },
  icon: {},
});
