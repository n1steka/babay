import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios";
import * as ImagePicker from "expo-image-picker";
import { usePostContext } from "../../context/postContext";
const DoctorProfile = () => {
  const { fetchDoctors } = usePostContext();
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [hospital, setHospital] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

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
      setImage(result.assets[0]);
    }
  };

  const saveDoctorProfile = async () => {
    if (
      !name ||
      !education ||
      !hospital ||
      !phoneNumber ||
      !address ||
      !image
    ) {
      Alert.alert("Бүх талбарыг бөглөнө үү ");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: image.uri,
      name: image.fileName,
      type: image.mimeType,
    });
    formData.append("name", name);
    formData.append("education", education);
    formData.append("hospital", hospital);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);

    try {
      const response = await axiosInstance.post("/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        fetchDoctors();
        setName("");
        setEducation("");
        setHospital("");
        setPhoneNumber("");
        setAddress("");
        setImage(null);
        Alert.alert("Doctor profile saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save doctor profile:", error);
      Alert.alert("Failed to save doctor profile. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Education"
        value={education}
        onChangeText={setEducation}
      />
      <TextInput
        style={styles.input}
        placeholder="Hospital"
        value={hospital}
        onChangeText={setHospital}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={saveDoctorProfile}>
        <Text style={styles.buttonText}>Save Doctor Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default DoctorProfile;
