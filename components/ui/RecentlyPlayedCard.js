import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Pressable, Image} from "react-native";

function RecentlyPlayedCard({ item }) {
  const navigation = useNavigation();
  function handlePressMiniatureSongTile(item) {
    navigation.navigate("MoreAboutSong", { item: item });
  }
  return (
    <View>
      <Pressable onPress={() => handlePressMiniatureSongTile(item)}>
        <Image
          style={{ width: 130, height: 130, borderRadius: '5%', margin: 10}}
          source={{ uri: item.track.album.images[0].url }}
        />
        <Text
        numberOfLines={1} style={{marginLeft: 10, fontWeight: 400}} >{item?.track?.name}</Text>
      </Pressable>
    </View>
  );
}

export default RecentlyPlayedCard;
