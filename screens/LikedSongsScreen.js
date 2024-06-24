import {
  Image,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";

import React, { useEffect, useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../Colors";
import SongItem from "../components/ui/SongItem";

import { Audio } from "expo-av";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import BasicButton from "../components/ui/basicButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { Player } from "../PlayerContext";
import { BottomModal, ModalContent } from "react-native-modals";

function LikedSongsScreen() {
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [currentSound, setcurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [input, setInput] = useState("");
  const [savedSongs, setSavedSongs] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const index = useRef(0);

  const getSavedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    if (!accessToken) {
      setError("No acces token found");
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/tracks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      });
      const data = response.data.items;
      setSavedSongs(data);
    } catch (error) {
      setError(
        error.response ? error.response.data.error.message : error.message
      );
      console.error("Error fetching saved songs:", error);
    }
  };

  useEffect(() => {
    getSavedSongs();
  }, []);

  const playTrack = async () => {
    if (savedSongs.length > 0) {
      setCurrentTrack(savedSongs[0]);
    }
    await startTrack(savedSongs[0]);
  };

  const startTrack = async (nextSong) => {
    console.log(nextSong);
    const preview_url = nextSong?.track?.preview_url;
    if (currentSound) {
      await currentSound.stopAsync();
    }
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      console.log("sound", status);
      onPlaybackStatusUpdate(status);
      setcurrentSound(sound);
      setIsPlaying(status.isLoaded);

      await sound.playAsync();
    } catch (err) {
      console.log(err.message);
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalTime(status.durationMillis);
      console.log(progress);
    }
    if (status.didJustFinish === true) {
      //rsetcurrentSound(null);
      handlePlayNextSong();
    }
  };

  function handleOnPressIconBackArrow() {
    if (currentSound) {
      currentSound.stopAsync();
    }
    navigation.navigate("Main");
  }

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handlePlayNextSong = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setcurrentSound(null);
    }
    if (index.current < savedSongs.length - 1) {
      index.current += 1;
    } else {
      index.current = 0;
    }
    const nextSong = savedSongs[index.current];
    setCurrentTrack(nextSong);

    await startTrack(nextSong);
  };

  const handlePlayPreviousSong = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setcurrentSound(null);
    }

    if (index.current > 0) {
      index.current -= 1;
    } else {
      index.current = 0;
    }

    const nextSong = savedSongs[index.current];
    setCurrentTrack(nextSong);
    await startTrack(nextSong);
  };

  return (
    <>
      <LinearGradient
        style={styles.root}
        colors={[Colors.gradientLoginOne, Colors.gradientLoginTwo]}
      >
        <SafeAreaView>
          <ScrollView>
            <Ionicons
              name="arrow-back-sharp"
              size={28}
              color={Colors.dusk}
              onPress={handleOnPressIconBackArrow}
            />

            {/* NAVABAR */}
            {/* TODO EXAM */}
            <Pressable style={styles.navBar}>
              {/* Search bar */}
              {/* <Pressable style={styles.searchBar}>
                <AntDesign name="search1" size={24} color={Colors.dusk} />
                <TextInput
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  placeholder="Find in liked songs"
                ></TextInput>
              </Pressable> */}

              {/* Sort icon */}
              <Pressable>{/* <BasicButton title="" /> */}</Pressable>
            </Pressable>

            {/* SHORT INFO */}
            {/* TODO */}
            <View>
              <Text style={styles.textTitle}>Liked songs</Text>
              <Text style={styles.textParagraph}>999 songs</Text>
            </View>

            {/* ICONS  */}
            <Pressable style={styles.iconRow}>
              <Pressable>
                <MaterialCommunityIcons
                  name="download-circle"
                  size={24}
                  color={Colors.navigationBottom}
                />
              </Pressable>
              <Pressable onPress={playTrack}>
                <FontAwesome name="random" size={24} color={Colors.dusk} />
              </Pressable>
            </Pressable>

            {/* SHOW LIKED SONGS */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={savedSongs}
              renderItem={({ item }) => (
                <SongItem
                  item={item}
                  onPress={startTrack}
                  isPlaying={item === currentTrack}
                />
              )}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {currentTrack && (
        <Pressable onPress={() => setModalVisibility(!modalVisibility)}>
          <View style={styles.currentTrackContainer}>
            <Image
              style={styles.currentPayingImage}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <View style={styles.trackInfoContainer}>
              <Text style={styles.trackTitle}>{currentTrack?.track?.name}</Text>
              <Text style={styles.trackArtist}>
                {currentTrack?.track?.artists[0].name}
              </Text>
            </View>
            <Pressable onPress={handlePlayPause}>
              {isPlaying ? (
                <Ionicons name="pause" size={24} color={Colors.darkGrey} />
              ) : (
                <Ionicons name="play" size={24} color={Colors.darkGrey} />
              )}
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisibility}
        onHardwareBackPress={() => setModalVisibility(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: Colors.navigationBottom,
          }}
        >
          <View style={{ width: "100%", height: "100%", marginTop: 50 }}>
            <Pressable
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "top",
                paddingHorizontal: 20,
              }}
              onPress={() => setModalVisibility(!modalVisibility)}
            >
              <Entypo name="chevron-thin-down" size={24} color="black" />
              {/* <Text>Polubione utwory!</Text> */}
            </Pressable>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <Image
                style={{
                  height: 300,
                  width: "100%",
                  alignContent: "center",
                  marginHorizontal: "auto",
                  margin: 50,
                  borderRadius: 8,
                }}
                source={{ uri: currentTrack?.track.album?.images[0].url }}
              />
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              {/* nazwa-big, autor-maly */}
              <Text style={[styles.trackTitle, { fontSize: 20 }]}>
                {currentTrack?.track?.name}
              </Text>
              <Text style={[styles.trackArtist, { fontSize: 16 }]}>
                {currentTrack?.track?.album?.artists[0].name}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
              <View>
                <View
                  style={[styles.progressBar, { width: `${progress * 100}%` }]}
                ></View>
              </View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: Colors.dusk,
                    fontWeight: "300",
                    fontSize: 16,
                  }}
                >
                  {(currentTime / 1000).toFixed(1)}
                </Text>
                <Text
                  style={{
                    color: Colors.dusk,
                    fontWeight: "300",
                    fontSize: 16,
                  }}
                >
                  {((-totalTime + currentTime) / 1000).toFixed(1)}
                </Text>
              </View>
            </View>
            {/* BUTTONS SECTION */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 20,
              }}
            >
              <Pressable onPress={handlePlayPreviousSong}>
                <Ionicons
                  name="play-skip-back"
                  size={24}
                  color={Colors.darkGrey}
                />
              </Pressable>
              <Pressable onPress={handlePlayPause}>
                {isPlaying ? (
                  <Ionicons name="pause" size={24} color={Colors.darkGrey} />
                ) : (
                  <Ionicons name="play" size={24} color={Colors.darkGrey} />
                )}
                {/* <Ionicons name="pause" size={24} color={Colors.darkGrey} /> */}
              </Pressable>
              <Pressable onPress={handlePlayNextSong}>
                <Ionicons
                  name="play-skip-forward"
                  size={24}
                  color={Colors.darkGrey}
                />
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
}

export default LikedSongsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },

  navBar: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  searchBar: {
    flex: 1,

    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.lightGreen,
    padding: 8,
    borderRadius: "5%",
  },

  textTitle: {
    color: Colors.dusk,
    fontSize: 20,
    fontWeight: "500",
    paddingTop: 18,
  },

  textParagraph: {
    color: Colors.dusk,
    fontSize: 16,
    fontWeight: "300",
  },

  iconRow: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  currentTrackContainer: {
    position: "absolute",
    left: 0, // Ensure left is set to see right margin
    right: 0, // Ensure right is set to see right margin
    bottom: 0,
    flexDirection: "row",
    borderRadius: 20,
    borderEndStartRadius: 40,
    borderEndEndRadius: 40,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 18,
    // Changed right margin to match left margin

    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: `${Colors.navigationBottom}D9`,
  },

  currentPayingImage: {
    borderBottomRightRadius: "20%",
    borderRadius: "2%",
    width: 50,
    height: 50,
  },

  trackTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark2Grey,
  },

  trackArtist: {
    fontSize: 12,
    color: Colors.darkGrey,
  },

  modalContentContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.navigationBottom,
  },
  songModalContent: {},
  progressBar: {
    height: 1.4,
    backgroundColor: Colors.dusk,
  },
});
