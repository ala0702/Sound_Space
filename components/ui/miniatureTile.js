import { StyleSheet, Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../Colors";
import { FontAwesome } from "@expo/vector-icons";

function MiniatureTile({ handlePress, text }) {
  return (
    <Pressable onPress={handlePress} style={styles.containerOuter}>
      <LinearGradient colors={[Colors.buttonBg, Colors.gradientLoginTwo]}>
        <Pressable onPress={handlePress} style={styles.icon}>
          <FontAwesome name="heart" size={24} color="black" />
        </Pressable>
      </LinearGradient>
      <Text style={styles.text}>{text}</Text>
      
    </Pressable>
  );
}

export default MiniatureTile;

const styles = StyleSheet.create({
  containerOuter: {
    flex: 1,
    width: '100%',
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.buttonBg,
    backgroundColor: Colors.buttonBg,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 5,
  },
  icon: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
});
