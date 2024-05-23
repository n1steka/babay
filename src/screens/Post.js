import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";

const NewsReadScreen = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const db = await SQLite.openDatabaseSync("news.db");
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM news",
        [],
        (_, { rows }) => {
          setNews(rows._array);
        },
        (_, error) => {
          console.error("Error fetching news:", error);
        }
      );
    });
  };

  const deleteNewsItem = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM news WHERE id = ?",
        [id],
        () => {
          fetchNews(); // Refresh the news list after deletion
        },
        (_, error) => {
          console.error("Error deleting news item:", error);
        }
      );
    });
  };

  const renderNewsItem = ({ item }) => {
    return (
      <View style={styles.newsItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => deleteNewsItem(item.id)}
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

  const handleUpdate = (item) => {
    // Implement update logic here, such as navigation to update screen with item details
    navigation.navigate("News", { newsItem: item });
  };

  const filteredNews = news.filter((item) =>
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
        keyExtractor={(item) => item.id.toString()}
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
});

export default NewsReadScreen;
