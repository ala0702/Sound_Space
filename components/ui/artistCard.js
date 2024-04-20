import { View, Text, Image } from "react-native";

function ArtistCard({item}) {
  return (
    <View>
      <Image style={{width:130, height:130}} source={{uri: item.images[0].url}}/>
    </View>
  );
}

export default ArtistCard;
