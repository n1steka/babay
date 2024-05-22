import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axiosInstance from "../../utils/axios";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkLogin = async () => {
    axiosInstance.post("/user/login");

    navigation.navigate("DrawerNav", { screen: "Миний булан" });
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../../assets/baby.png")} />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Цахим шуудан"
          placeholderTextColor="#003f5c"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Нууц үг"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <TouchableOpacity>
        <Text
          style={styles.forgot_button}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          Шинээр бүртгүүлэх
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={checkLogin}>
        <Text style={styles.loginText}>Нэвтрэх</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "#003f5c",
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    color: "#003f5c",
  },
  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
  loginText: {
    color: "#fff",
  },
});
