// src/screens/NewsReadScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image, // Import Image component
} from "react-native";
import { usePostContext } from "../../context/postContext";
import axiosInstance, { IMGURL } from "../../utils/axios";
import EditNewsModal from "../components/EditNewsModal";

const NewsReadScreen = ({ navigation }) => {
  const { posts, fetchPosts } = usePostContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const deleteNewsItem = async (id) => {
    try {
      await axiosInstance.delete(`/post/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting news item:", error);
      Alert.alert("Error", "Failed to delete news item.");
    }
  };

  const handleUpdate = (item) => {
    setSelectedNewsItem(item);
    setModalVisible(true);
  };

  const renderNewsItem = ({ item }) => {
    return (
      <View style={styles.newsItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        {item.photo && (
          <Image
            source={{
              uri: `${IMGURL}/${item.photo}`,
            }}
            style={styles.image}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => deleteNewsItem(item._id)}
          >
            <Text style={styles.buttonText}>Устгах</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => handleUpdate(item)}
          >
            <Text style={styles.buttonText}>Шинэчлэх</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredNews = posts.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Хайлт хийх"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
      />
      {selectedNewsItem && (
        <EditNewsModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          newsItem={selectedNewsItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  newsItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  Button: {
    backgroundColor: "deeppink",
    borderRadius: 5,
    padding: 10,
    marginBottom: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Adjust as needed
    marginTop: 10,
    padding: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default NewsReadScreen;
