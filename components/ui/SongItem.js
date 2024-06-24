import { Text, View, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import Colors from "../../Colors";
import { useContext } from "react";
import { Feather } from "@expo/vector-icons";

import { Player } from "../../PlayerContext";

function SongItem({ item, onPress, isPlaying }) {
  const { currentTrack, setCurrentTrack } = useContext(Player);

  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };
  return (
    <Pressable onPress={handlePress}>
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={{ uri: item?.track?.album?.images[0].url }}
        />
        <View style={styles.songDetailsContainer}>
          <Text
            style={
              isPlaying
                ? {
                    fontSize: 16,
                    fontWeight: "700",
                    paddingBottom: 6,
                    color: Colors.darkGrey,
                  }
                : {
                    fontSize: 16,
                    fontWeight: "400",
                    paddingBottom: 6,
                    color: Colors.darkGrey,
                  }
            }
          >
            {item?.track?.name}
          </Text>
          <Text style={{ fontSize: 10, color: Colors.dusk }}>
            {item?.track?.album?.artists[0].name}
          </Text>
        </View>
        <Feather name="more-horizontal" size={24} color={Colors.darkGrey} />
      </View>
    </Pressable>
  );
}

export default SongItem;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingRight: 16,
    gap: 10,
    borderTopLeftRadius: "50%",
    borderRadius: "20%",
    backgroundColor: Colors.lightGrey,
  },
  image: {
    height: 80,
    width: 80,
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "10%",
  },
  songDetailsContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 12,

    alignContent: "center",
    justifyContent: "center",
  },
});
