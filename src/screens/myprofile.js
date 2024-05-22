import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseAsync("myprofile.db");

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    createProfileTable();
    fetchUserInfo();
  }, []);

  const createProfileTable = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, bio TEXT)"
      );
    });
  };

  const fetchUserInfo = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM profile LIMIT 1",
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            const { username, email, bio } = rows.item(0);
            setUsername(username);
            setEmail(email);
            setBio(bio);
          }
        },
        (_, error) => {
          console.error("Error fetching user info:", error);
        }
      );
    });
  };

  const saveProfile = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO profile (username, email, bio) VALUES (?, ?, ?)",
        [username, email, bio],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log("Мэдээлэл шинэчлэгдлээ");
          }
        },
        (_, error) => {
          console.error("Error saving profile:", error);
        }
      );
    });
    setEditMode(false);
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
