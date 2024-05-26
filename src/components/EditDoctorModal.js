import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { usePostContext } from "../../context/postContext";
import axiosInstance from "../../utils/axios";

const EditDoctorModal = ({ visible, onClose, doctor }) => {
  const { fetchDoctors } = usePostContext();
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [hospital, setHospital] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || "");
      setEducation(doctor.education || "");
      setHospital(doctor.hospital || "");
      setPhoneNumber(doctor.phoneNumber || "");
      setAddress(doctor.address || "");
      setImage(doctor.image ? { uri: doctor.image } : null);
    }
  }, [doctor]);

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

  const handleSave = async () => {
    if (!name || !education || !hospital || !phoneNumber || !address) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    if (image) {
      const uriParts = image.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("file", {
        uri: image.uri,
        name: image.fileName,
        type: image.mimeType,
      });
    }
    formData.append("name", name);
    formData.append("education", education);
    formData.append("hospital", hospital);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);

    try {
      const response = await axiosInstance.put(
        `/doctors/${doctor._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Doctor profile saved successfully!");
        onClose(); // Close the modal after saving
        fetchDoctors();
      }
    } catch (error) {
      console.error("Failed to save doctor profile:", error);
      Alert.alert("Failed to save doctor profile. Please try again.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Doctor Information</Text>
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
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Doctor Profile</Text>
        </TouchableOpacity>
        <Button title="Close" onPress={onClose} />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
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

export default EditDoctorModal;
