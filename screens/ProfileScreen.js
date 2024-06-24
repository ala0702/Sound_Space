import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Colors from "../Colors";

function ProfileScreen() {
  const [userProfile, setUserProfile] = useState();
  const [userPlaylists, setUserPlaylists] = useState([]);

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    const getPlaylists = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserPlaylists(response.data.items); // Pobieramy tylko tablicę playlist
      } catch (err) {
        console.log(err.message);
      }
    };
    getPlaylists();
  }, []);

  return (
    <LinearGradient
      style={styles.root}
      colors={[Colors.gradientLoginOne, Colors.gradientLoginTwo]}
    >
      <SafeAreaView>
        <ScrollView>
          <View style={styles.profileContainer}>
            <View>
              {userProfile?.images && userProfile.images.length > 0 ? (
                <Image
                  style={styles.image}
                  source={{ uri: userProfile.images[0].url }}
                />
              ) : (
                <View style={[styles.image, styles.placeholder]} />
              )}
            </View>
            <View>
              <Text style={[styles.text, {fontWeight: "600"}]}>{userProfile?.display_name}</Text>
              <Text style={styles.text}>{userProfile?.email}</Text>
            </View>
          </View>
          <Text style={styles.playlistHeader}>your playlists:</Text>
          <View style={styles.playlistsContainer}>
            {userPlaylists.map((item) => (
              <View key={item.id} style={styles.playlistItem}>
                <Image
                  source={{
                    uri:
                      item?.images[0]?.url ||
                      "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                  }}
                  style={styles.playlistImage}
                />
                <View>
                  <Text style={[styles.text, {fontSize: 14}]}>{item?.name}</Text>
                  {/* <Text style={styles.text}> followers</Text> */}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    margin: 10,
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
  text: {
    paddingTop: 5,
    color: Colors.textTitle,
    fontWeight: "400",
    fontSize: 19,
    marginBottom: 0,
    paddingRight: 45,
  },
  playlistHeader: {
    paddingTop: 20,
    paddingHorizontal: 30,
    fontSize: 18,
    color: Colors.textTitle,
  },
  playlistsContainer: {
    paddingTop: 10,
    paddingLeft: 25,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 10,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
});
