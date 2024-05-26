import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axiosInstance from "../../utils/axios";
import { usePostContext } from "../../context/postContext";

const EditNewsModal = ({ visible, onClose, newsItem }) => {
  const { fetchPosts } = usePostContext();
  const [title, setTitle] = useState(newsItem.title);
  const [content, setContent] = useState(newsItem.content);
  const [description, setDescription] = useState(newsItem.description);
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

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      if (image) {
        const uriParts = image.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("file", {
          uri: image.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const res = await axiosInstance.put(`/post/${newsItem._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data) {
        fetchPosts();
      }
      onClose();
    } catch (error) {
      console.error("Error updating news item:", error);
      Alert.alert("Error", "Failed to update news item.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit News</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Content"
            value={content}
            onChangeText={setContent}
            multiline
          />
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
          <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "deeppink",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "green",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});

export default EditNewsModal;
