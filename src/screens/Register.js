import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const RegisterUser = () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Хэрэглэгчийн мэдээллийг бүрэн бөглөнө үү.");
      return;
    }

    axiosInstance
      .post("/user", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        Alert.alert("Амжилттай бүртгэгдлээ!");
        navigation.navigate("Login");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Бүртгэл амжилтгүй боллоо: ", err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Бүртгүүлэх</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Цахим шуудан"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
          value={email}
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
