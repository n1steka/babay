import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios"; // Assuming axiosInstance is configured
import * as ImagePicker from "expo-image-picker";
import "react-native-gesture-handler";

const News = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [cont, setCont] = useState("");
  const [imageUri, setImageUri] = useState(null);

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
      handleUploadImage(result.uri);
    }
  };

  const handleUploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUri(response.data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
      Alert.alert("Image upload failed. Please try again.");
    }
  };

  const saveNewsPost = async () => {
    if (!title || !content || !imageUri || !cont) {
      Alert.alert("Please fill out all fields and upload an image.");
      return;
    }

    try {
      const response = await axiosInstance.post("/news", {
        title,
        content,
        image: imageUri,
        cont,
      });

      setTitle("");
      setContent("");
      setImage(null);
      setImageUri(null);
      setCont("");

      Alert.alert("News post saved successfully!");
    } catch (error) {
      console.error("Failed to save news post:", error);
      Alert.alert("Failed to save news post. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Additional Content"
        value={cont}
        onChangeText={setCont}
      />
      <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
        <Text>Choose Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={saveNewsPost}>
        <Text>Save News Post</Text>
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default News;
