import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("user");
        const role = await AsyncStorage.getItem("role");
        console.log("---------", role);
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setUsername(user.name || "");
          setEmail(user.email || "");
          setBio(user.bio || ""); // Adjust based on your actual user object structure
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const saveProfile = async () => {
    try {
      const updatedUser = {
        name: username,
        email,
        bio,
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      Alert.alert("Амжилттай хадгалагдлаа");
    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Хадгалахад алдаа гарлаа");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Нэр:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Нэрээ бичнэ үү"
        editable={editMode}
      />
      <Text style={styles.label}>Цахим шуудан:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Цахим шуудангаа бичнэ үү"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={editMode}
      />
      <Text style={styles.label}>Утасны дугаар:</Text>
      <TextInput
        style={[styles.input, { height: 50 }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Утасны дугаараа оруулна уу"
        keyboardType="phone-pad"
        multiline
        editable={editMode}
      />
      {editMode ? (
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Хадгалах</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Засварлах</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "orange",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProfileScreen;
