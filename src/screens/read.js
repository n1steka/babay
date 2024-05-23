import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ScrollView,
} from "react-native";
import axiosInstance, { IMGURL } from "../../utils/axios";

const NewsReadScreen = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/post");
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const addComment = async (postId) => {
    if (newComment.trim() === "") return;

    try {
      await axiosInstance.post(`/post/${postId}/comments`, {
        comment: newComment,
      });
      fetchPosts();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.content}>{item.content}</Text>
        {item.photo && (
          <Image
            source={{
              uri: `${IMGURL}/${item.photo}`,
            }}
            style={styles.image}
          />
        )}
        <Text style={styles.comment}>Comments:</Text>
        {item.comments &&
          item.comments.map((comment, index) => (
            <Text key={index} style={styles.comment}>
              {comment}
            </Text>
          ))}
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment"
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Post Comment" onPress={() => addComment(item._id)} />
      </View>
    );
  };

  const filteredPosts = posts.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: 20,
  },
  postItem: {
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
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default NewsReadScreen;
