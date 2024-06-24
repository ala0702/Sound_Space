import {
  Text,
  View,
  StyleSheet,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRef } from "react";
import * as React from "react";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ResponseType,
  useAuthRequest,
  makeRedirectUri,
} from "expo-auth-session";

import Button from "../components/ui/button";
import Colors from "../Colors";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const navigation = useNavigation();

  // Endpoint
  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "4f8b3e8fdc2c4323bd1b179df401d3b9",
      clientSecret: "d04c006bdce54980be0669ae7f58fb03",
      scopes: [
        "user-library-read",
        "user-read-email",
        "user-read-private",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
        "user-top-read",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
      ],
      usePKCE: false,
      redirectUri: "exp://localhost:19000/--/",
    },
    discovery
  );
  // Obsługa reakcji na autoryzację
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token, expires_in } = response.params;
      const expirationDate = new Date().getTime() + parseInt(expires_in) * 1000;

      AsyncStorage.setItem("token", access_token);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.replace("Main");
    }
  }, [response]);

  // Funkcja do sprawdzania ważności tokenu
  const checkTokenValidity = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    const expirationDate = await AsyncStorage.getItem("expirationDate");
    console.log("access token:", accessToken);
    console.log("expiration date:", expirationDate);
    console.log(makeRedirectUri());

    if (accessToken && expirationDate) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationDate)) {
        // Token jest nadal ważny
        navigation.replace("Main");
      } else {
        // Token wygasł, usuń go
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("expirationDate");
      }
    }
  };
  React.useEffect(() => {
    checkTokenValidity();
  }, []);

  //animacja logo
  const waveAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoInterpolate = waveAnim.interpolate({
    inputRange: [0, 0.8],
    outputRange: ["-10deg", "10deg"],
  });

  const logoStyle = {
    transform: [{ skewY: logoInterpolate }],
  };

  return (
    <LinearGradient
      style={styles.root}
      colors={[Colors.gradientLoginOne, Colors.gradientLoginTwo]}
    >
      <SafeAreaView style={styles.root}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logo, logoStyle]}>
            <MaterialCommunityIcons
              name="playlist-music-outline"
              size={124}
              color={Colors.textTitle}
            />
          </Animated.View>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Your Place in the World of Music</Text>
        </View>
        <View style={styles.loginContainer}>
          {/* <TouchableOpacity onPress={() => promptAsync()}>
            <View>
              <Text>SIGN IN</Text>
            </View>
          </TouchableOpacity> */}
          <Button
          onPress={() => promptAsync()}
            text="Sign in with Spotify"
            iconName="musical-notes"
            iconColor={Colors.darkGreen}
          />
{/* 
          <Button
            text="Sign in with Google"
            iconName="logo-google"
            iconColor={Colors.googleIconColor}
          />
          <Button
            text="Sign in with FaceBook"
            iconName="logo-facebook"
            iconColor={Colors.fbIconColor}
          />
          <Button
            text="Sign in with Phone Number"
            iconName="phone-portrait"
            iconColor={Colors.notesIconColor}
          /> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  logo: {
    alignItems: "center",
    padding: 60,
    transform: [{ skewY: "-10deg" }], // Przechylanie logo o 10 stopni w kierunku pionowym
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Efekt cienia dla lepszej czytelności na tle gradientu
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    paddingBottom: 20,
    paddingHorizontal: 80,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.4)", // Dodany efekt cienia dla lepszej czytelności na tle gradientu
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1.6,
    color: Colors.textTitle,
  },
});
