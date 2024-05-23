import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      const { data, token } = response.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      await AsyncStorage.setItem("role", JSON.stringify(data.role));
      navigation.navigate("DrawerNav", { screen: "Миний булан" });
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Нэвтрэхэд алдаа гарлаа",
        err.response?.data?.msg || "Алдаа гарлаа."
      );
    }
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
          keyboardType="email-address"
          autoCapitalize="none"
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
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.forgot_button}>Шинээр бүртгүүлэх</Text>
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
