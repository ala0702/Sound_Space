import { Text, View, StyleSheet, Animated, Pressable } from "react-native";
import { useRef } from "react";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ResponseType, useAuthRequest } from "expo-auth-session";


import Button from "../components/ui/button";
import Colors from "../Colors";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const discovery = {
    authorizationEndPoin: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "4f8b3e8fdc2c4323bd1b179df401d3b9",
      clientSecret: "d04c006bdce54980be0669ae7f58fb03",
      scopes: [
        "user-read-email",
        "user-read-private",
        "user-read-currently-playing",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming",
        "user-top-read",
        "user-read-recently-played",
        "",
        "",
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.5.9:8081",
    },
    discovery
  );

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { access_token } = response.params;
  //     console.log("accessToken", access_token);
  //   }
  // }, [response]);
  // //
  // const navigation = useNavigation();
  // //chceck if the token is present (empty dependency because we only want to check once)
  // useEffect(() => {
  //   const isTokenValid = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem("token");
  //       const expirationDate = await AsyncStorage.getItem("expirationDate");
  //       console.log("access token", accessToken);
  //       console.log("expiration date", expirationDate);
  //       if (accessToken && expirationDate) {
  //         const currentTime = Date.now();
  //         if (currentTime < parseInt(expirationDate)) {
  //           // token still valid -> navigate to main screen
  //           navigation.replace("Main");
  //         } else {
  //           // token expired -> remove it from async storage, because when we log in again we need new token
  //           AsyncStorage.removeItem("token");
  //           AsyncStorage.removeItem("expirationDate");
  //         }
  //       }
  //     } catch (error) {
  //       console.error(
  //         "An error occurred while checking token validity:",
  //         error
  //       );
  //       // Możesz tutaj obsłużyć błąd, np. wyświetlając komunikat dla użytkownika
  //     }
  //   };
  //   isTokenValid();
  // }, []);

  // async function authenticate() {
  //   try {
  //     const config = {
  //       issuer: "http://accounts.spotify.com",
  //       clientId: "4f8b3e8fdc2c4323bd1b179df401d3b9",
  //       scopes: [
  //         "user-read-private",
  //         "user-read-email",
  //         "playlist-read-private",
  //         "playlist-read-collaborative",
  //         "playlist-modify-public",
  //         "playlist-modify-private",
  //         "user-library-read",
  //         "user-library-modify",
  //         "user-follow-read",
  //         "user-follow-modify",
  //         "streaming",
  //       ],
  //       redirectUrl: "exp://localhost:19002/--/spotify-auth-callback",
  //     };
  //     const result = await AppAuth.authAsync(config);
  //     console.log(result);
  //     // if login expired -> show login page to the user
  //     if (result.accessToken) {
  //       const expirationDate = new Date(
  //         result.accessToken.expirationDate
  //       ).getTime();
  //       AsyncStorage.setItem("token", result.accessToken.accessToken);

  //       AsyncStorage.setItem("expirationDate", expirationDate.toString());
  //       navigation.navigate("Main");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred during authentication:", error);
  //   }
  // }

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
          <Button
            text="Sign in with Spotify"
            iconName="musical-notes"
            iconColor={Colors.darkGreen}
            onPress={() => promptAsync()}
          />
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
          />
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
