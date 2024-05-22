import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const RegisterUser = async () => {
    if (email.length === 0 || password.length === 0 || name.length === 0) {
      Alert.alert("Нэр, цахим шуудан, нууц үгийн мэдээллийг бүрэн бөглөнө үү.");
      return;
    }

    try {
      const inputData = {
        email,
        password,
        name,
      };
      const response = await axiosInstance.post("/user", inputData);
      console.log(response.data.data);
      const { data, token } = response.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(data));

      Alert.alert("Амжилттай бүртгэгдлээ!");
      // Clear input fields after successful registration
      setEmail("");
      setPassword("");
      setName("");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration Error:", error);
      let errorMessage = "Бүртгэл амжилтгүй боллоо.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Алдаа", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Бүртгүүлэх</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Нэр"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setName(text)}
          value={name}
          autoCapitalize="words"
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Цахим шуудан"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
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
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={RegisterUser}>
        <Text style={styles.loginText}>Бүртгүүлэх</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
