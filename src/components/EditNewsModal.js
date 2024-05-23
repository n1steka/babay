// src/components/EditNewsModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import axiosInstance from "../../utils/axios";
import { usePostContext } from "../../context/postContext";

const EditNewsModal = ({ visible, onClose, newsItem }) => {
  const { fetchPosts } = usePostContext();
  const [title, setTitle] = useState(newsItem.title);
  const [content, setContent] = useState(newsItem.content);
  const [description, setDescription] = useState(newsItem.description);

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/post/${newsItem._id}`, {
        title: title,
        description: description,
        content: content,
      });
      fetchPosts();
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
          <Text style={styles.modalTitle}>Шинэчлэх</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={description}
            onChangeText={setDescription}
          />
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.Button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Хадгалах</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={onClose}>
              <Text style={styles.buttonText}>Болих</Text>
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
  Button: {
    backgroundColor: "deeppink",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default EditNewsModal;
