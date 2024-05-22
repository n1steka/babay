import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("doctorProfiles.db");

const DoctorProfileInputScreen = () => {
  const [name, setName] = useState("");
  const [education, setEdu] = useState("");
  const [hospital, setHospital] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Create the doctorProfiles table if it doesn't exist
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS doctorProfiles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, education TEXT, hospital TEXT, phoneNumber TEXT, phone TEXT, address TEXT, image BLOB)"
      );
      tx.executeSql("ALTER TABLE doctorProfiles ADD COLUMN phone TEXT");
    });
  }, []);

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    const base64Image = image
      ? image.split("data:image/jpeg;base64,")[1]
      : null;
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO doctorProfiles (name, education, hospital, phoneNumber,address, phone, image) VALUES (?, ?, ?, ?,?,?, ?)",
        [name, education, hospital, phoneNumber, address, phone, base64Image],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log("Doctor profile saved successfully");
            // Reset form fields after submission
            setName("");
            setEdu("");
            setHospital("");
            setPhoneNumber("");
            setPhone("");
            setAddress("");
            setImage(null);
          }
        },
        (_, error) => {
          console.error("Error saving doctor profile:", error);
        }
      );
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Нэр:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Нэр бичнэ үү"
        />
        <Text style={styles.label}>Боловсрол:</Text>
        <TextInput
          style={styles.input}
          value={education}
          onChangeText={setEdu}
          placeholder="Боловсрол бичнэ үү"
        />
        <Text style={styles.label}>Ажлын туршлага:</Text>
        <TextInput
          style={styles.input}
          value={hospital}
          onChangeText={setHospital}
          placeholder="Ажлын туршлага бичнэ үү"
        />
        <Text style={styles.label}>Утасны дугаар:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Утасны дугаар бичнэ үү"
          keyboardType="phone-pad"
        />
        <Text style={styles.label}>Ажлын газрын хаяг:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Ажлын газрын хаяг бичнэ үү"
        />
        <Text style={styles.label}>Ажлын газрын утасны дугаар:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Утасны дугаар бичнэ үү"
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleChooseImage}
        >
          <Text style={styles.imageButtonText}>Зураг сонгох</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Хадгалах</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  imageButton: {
    backgroundColor: "deepskyblue",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "white",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "deepskyblue",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DoctorProfileInputScreen;
