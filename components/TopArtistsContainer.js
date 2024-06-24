import { View, Text, StyleSheet, ScrollView } from "react-native";
import Colors from "../Colors";
import ArtistCard from "./ui/artistCard";

function TopArtistsContainer({topArtists}) {
  return (
    <View>
      <Text style={styles.headerText}>Top artists</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {topArtists.map((item, index) => (<ArtistCard item={item} key={index}/>))}
      </ScrollView>
    </View>
  );
}

export default TopArtistsContainer;

const styles = StyleSheet.create({
    headerText: {
        fontSize: 22,
        marginTop: 25,
        marginBottom: 8,
        marginHorizontal: 10,

    },
})