import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import NewsScreen from "./src/screens/News";
import LoginScreen from "./src/screens/Login";
import RegisterScreen from "./src/screens/Register";
import LogoutScreen from "./src/screens/Logout";
import Profile from "./src/screens/doctorprofile";
import Mypro from "./src/screens/myprofile";
import Doctor from "./src/screens/DoctorScreen";
import Post from "./src/screens/Post";
import Read from "./src/screens/read";
import DRegister from "./src/screens/Dregister";
import UserContext from "./context/userContext";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Нүүр хуудас" component={Read} />
      <Drawer.Screen name="Миний булан" component={Mypro} />
      <Drawer.Screen name="Эмч мэдээлэл харах" component={Doctor} />
      <Drawer.Screen name="News" component={NewsScreen} />
      <Drawer.Screen name="Гарах" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

const AdminDrawerNav = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="huudas" component={Post} />
      <Drawer.Screen name="Эмч мэдээлэл оруулах" component={Profile} />
      <Drawer.Screen name="Эмч мэдээлэл харах" component={Doctor} />
      <Drawer.Screen name="Зөвөлгөө оруулах" component={NewsScreen} />
      <Drawer.Screen name="Эмч мэдээлэл засах" component={DRegister} />
      <Drawer.Screen name="Гарах" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="News" component={NewsScreen} />
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
    </NavigationContainer>
  );
}
