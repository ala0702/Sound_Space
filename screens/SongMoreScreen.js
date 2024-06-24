import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../Colors";

function SongMoreScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const albumUrl = route?.params?.item?.track?.album?.uri;
  const albumId = albumUrl.split(":")[2];

  const [tracks, setTracks] = useState([]);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    async function fetchSongs() {
      const accessToken = await AsyncStorage.getItem("token");
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch album songs");
        }
        const data = await response.json();
        setTracks(data.items);
      } catch (err) {
        console.log(err.message);
      }
    }

    async function fetchAlbum() {
      const accessToken = await AsyncStorage.getItem("token");
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${albumId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch album details");
        }
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    fetchSongs();
    fetchAlbum();
  }, [albumId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderTrack = ({ item }) => (
    <View style={styles.trackContainer}>
      <Text style={styles.trackName}>{item.name}</Text>
    </View>
  );

  return (
    <LinearGradient
      style={styles.root}
      colors={[Colors.gradientLoginOne, Colors.gradientLoginTwo]}
    >
    <SafeAreaView>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={Colors.darkGreenGrey}/>
          </TouchableOpacity>
          <Text style={styles.title}>Album Tracks</Text>
          <Text></Text>
        </View>
        {album && (
          <View style={styles.albumInfo}>
            <Image
              source={{ uri: album.images[0].url }}
              style={styles.albumImage}
            />
            <Text style={styles.albumName}>{album.name}</Text>
            <View
          style={{
            marginHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 10,
            gap: 7,
          }}
        >
          {route?.params?.item?.track?.artists?.map((item, index) => (
            <Text   key={item.id} style={{ color: Colors.dusk, fontSize: 16, fontWeight: "300" }}>
              {item.name}
            </Text>
          ))}
        </View>
          </View>
        )}
        
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default SongMoreScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
  },
  header: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.buttonBg,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 18,
    color: "white",
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "200",
    color: Colors.title,
  },
  albumInfo: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  albumImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumName: {
    fontSize: 22,
    fontWeight: "400",
    color: Colors.darkGrey,
    textAlign: "center",
  },
  albumArtist: {
    fontSize: 18,
    padding: 8,
    color: Colors.dusk,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  trackContainer: {
    padding: 8,
    alignItems: 'center',
    borderBottomColor: "#ccc",
    backgroundColor: Colors.coconut,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "300",
    color: Colors.dusk,
  },
});
