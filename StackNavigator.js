import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import LikedSongsScreen from "./screens/LikedSongsScreen";

import Colors from "./Colors";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SongMoreScreen from "./screens/SongMoreScreen";
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: styles.bottomBarNavigator }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabsLabel: "Home",
          headerShown: false,
          tabBarLabelStyle: { color: Colors.tabBarLabel },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={24} color={Colors.tabIconColor} />
            ) : (
              <Ionicons
                name="home-outline"
                size={24}
                color={Colors.tabIconColor}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabsLabel: "Profile",
          headerShown: false,
          tabBarLabelStyle: { color: Colors.tabBarLabel },
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons
                name="person-circle-sharp"
                size={24}
                color={Colors.tabIconColor}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={Colors.tabIconColor}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LikedSongs"
          component={LikedSongsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MoreAboutSong"
          component={SongMoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;

const styles = StyleSheet.create({
  bottomBarNavigator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.navigationBottom,
    color: Colors.tabBarLabel,
    height: 78,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
