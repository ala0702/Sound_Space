import { View, Text, Image } from "react-native";

function ArtistCard({item}) {
  return (
    <View>
      <Image style={{width:130, height:130, borderRadius: '5%', margin: 10}} source={{uri: item.images[0].url}}/>
      <Text style={{marginLeft: 10, fontWeight: 400}}>{item?.name}</Text>
    </View>
  );
}

export default ArtistCard;
