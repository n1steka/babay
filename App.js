import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewsScreen from "./src/screens/News";
import LoginScreen from "./src/screens/Login";
import RegisterScreen from "./src/screens/Register";
import LogoutScreen from "./src/screens/Logout";
import Profile from "./src/screens/doctorprofile";
import DoctorRead from "./src/screens/DoctorRead";
import Mypro from "./src/screens/myprofile";
import Doctor from "./src/screens/DoctorScreen";
import Post from "./src/screens/Post";
import Read from "./src/screens/read";
import DRegister from "./src/screens/Dregister";
import { PostProvider } from "./context/postContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNav = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Нүүр хуудас" component={Read} />
    <Drawer.Screen name="Миний булан" component={Mypro} />
    <Drawer.Screen name="Эмч мэдээлэл харах" component={Doctor} />
    <Drawer.Screen name="Гарах" component={LogoutScreen} />
  </Drawer.Navigator>
);

const AdminDrawerNav = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Үндсэн" component={Post} />
    <Drawer.Screen
      name="Эмч мэдээлэл оруулах  dev and test"
      component={DoctorRead}
    />
    <Drawer.Screen name="Эмч мэдээлэл" component={Doctor} />
    <Drawer.Screen name="Зөвөлгөө оруулах" component={NewsScreen} />
    <Drawer.Screen name="Гарах" component={LogoutScreen} />
  </Drawer.Navigator>
);

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === "admin") {
          setInitialRoute("AdminDrawerNav");
        } else {
          setInitialRoute("DrawerNav");
        }
      } else {
        setInitialRoute("Login");
      }
    };
    checkUser();
  }, []);

  if (!initialRoute) {
    return null; // Render a loading spinner here if you wish
  }

  return (
    <NavigationContainer>
      <PostProvider>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="DrawerNav"
            component={DrawerNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdminDrawerNav"
            component={AdminDrawerNav}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </PostProvider>
    </NavigationContainer>
  );
}
