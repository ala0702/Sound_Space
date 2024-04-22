import { StyleSheet, Text, View, ScrollView, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongItem from '../components/SongItem';
import axios from "axios";

const LikedSongsScreen = () => {
    const navigation = useNavigation()
    const [savedTracks, setSavedTracks] = useState([])
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [userProfile, setUserProfile] = useState();

    const getProfile = async () => {
        //access token
        const accessToken = await AsyncStorage.getItem("token");
        try {
          //console.log("Access token:", accessToken);
    
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
      console.log("User profile:", userProfile);

    // async function getSavedTracks() {
    //     const accessToken = await AsyncStorage.getItem("token");
    //     const response = await fetch(
    //       "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //         params: {
    //           limit: 50,
    //         },
    //       }
    //     );
    
    //     if (!response.ok) {
    //       throw new Error("failed to fetch the tracks");
    //     }
    //     const data = await response.json();
    //     setSavedTracks(data.items);
    //   }
    //   useEffect(() => {
    //     getSavedTracks();
    //   }, []);

    return (
        <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, marginTop: 50 }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                
                <View style={{height: 50}} />
                <View style={{marginHorizontal:10}}>
                    <Text style={{fontSize:18, fontWeight:"bold", color:"white"}}>Liked Songs</Text>
                    <Text style={{fontSize:13, color:"white", marginTop:5}}>{savedTracks.length} current</Text>
                </View>

                <FlatList data={savedTracks} renderItem={({item}) => (
                    <SongItem item = {item}/>
                )} />
            </ScrollView>
        </LinearGradient>

    )
}

export default LikedSongsScreen

const styles = StyleSheet.create({})