import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";

import Colors from "../Colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Button from "../components/ui/button";
import MiniatureTile from "../components/ui/miniatureTile";
import MiniatureTilePhoto from "../components/ui/miniatureTilePhoto";
import TopArtistsContainer from "../components/TopArtistsContainer";

import axios from "axios";

import { LogBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import {
  ResponseType,
  useAuthRequest,
  makeRedirectUri,
} from "expo-auth-session";

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

function HomeScreen() {
  const [userProfile, setUserProfile] = useState();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtist] = useState([]);
  const navigation = useNavigation();

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning:)";
    } else if (currentTime < 16) {
      return "Good Afternoon <33";
    } else {
      return "Good Evening;)) ";
    }
  };
  const message = greetingMessage();

  const getProfile = async () => {
    //access token
    const accessToken = await AsyncStorage.getItem("token");
    try {
      // console.log("Access token:", accessToken);

      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  // console.log("User profile:", userProfile);

  const getRecentlyPlayedSong = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecentlyPlayedSong();
  }, []);

  const getTopArtists = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("token");
      if (!accessToken) {
        return;
      }
      const type = "artists";
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/${type}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const topArtists = response.data.items;
      setTopArtist(topArtists);
    } catch (error) {
      console.log(message);
    }
  };
  console.log(topArtists);
  useEffect(() => {
    getTopArtists();
  }, []);

  function handlePressMiniatureTile() {}
  return (
    <LinearGradient
      style={styles.root}
      colors={[Colors.gradientLoginOne, Colors.gradientLoginTwo]}
    >
      <SafeAreaView>
        <ScrollView>
          <View style={styles.navContainer}>
            {userProfile?.images && userProfile.images.length > 0 ? (
              <Image
                style={styles.image}
                source={{ uri: userProfile.images[0].url }}
              />
            ) : (
              <View style={[styles.image, styles.placeholder]} />
            )}
            <View>
              <Text style={styles.text}>{message}</Text>
              <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                <Button
                  text="music"
                  mainContainerStyle={styles.buttonNav}
                  textStyle={{
                    color: Colors.coconut,
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingHorizontal: 20,
                  }}
                  paddingStyle={{
                    flex: 1,
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  }}
                />
                <Button
                  text="podcast"
                  mainContainerStyle={styles.buttonNav}
                  textStyle={{
                    color: Colors.coconut,
                    fontSize: 12,
                    paddingLeft: 20,
                    paddingHorizontal: 20,
                  }}
                  paddingStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                />
              </View>
            </View>
          </View>
          <View style={styles.songsContainer}>
            <View style={styles.songsContainer}>
              <MiniatureTile
                handlePress={() => navigation.navigate("Liked")}
                text="Liked Songs"
              />
            </View>
            <FlatList
              data={recentlyPlayed}
              renderItem={({ item }) => (
                <MiniatureTilePhoto
                  text={item.track.name}
                  source={{ uri: item.track.album.images[0].url }}
                />
              )}
              numColumns={2}
            />
          </View>
          <View style={styles.artistsContainer}>
            <TopArtistsContainer topArtists={topArtists} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  navContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 10,
    resizeMode: "cover",
  },
  placeholder: {
    backgroundColor: "#333", // Dark gray background color
  },
  text: {
    paddingTop: 15,
    color: Colors.textTitle,
    fontWeight: "600",
    fontSize: 22,
    marginBottom: 0,
    paddingRight: 45,
  },

  buttonNav: {
    flex: 1,
    backgroundColor: Colors.buttonBg,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dusk,
    borderColor: Colors.dusk,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 25,
    marginTop: 18,
    marginBottom: 18,
    margin: 0,
  },

  songsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  artistsContainer: {},
  lastPlayedContainer: {},
});
