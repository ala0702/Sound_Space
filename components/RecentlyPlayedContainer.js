import { FlatList, Text, View, StyleSheet } from "react-native";
import RecentlyPlayedCard from "./ui/RecentlyPlayedCard";

function RecentlyPlayedContainer({ recentlyPlayed }) {
  return (
    <View>
      <Text style={styles.headerText}>Recently Played</Text>
      <FlatList
        data={recentlyPlayed}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <RecentlyPlayedCard item={item} key={index} />
        )}
      />
    </View>
  );
}

export default RecentlyPlayedContainer;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 22,
    marginTop: 25,
    marginBottom: 8,
    marginHorizontal: 10,
  },
});
