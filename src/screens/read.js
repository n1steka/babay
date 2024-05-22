import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';


const NewsReadScreen = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    createTables();
    fetchNews();
  }, []);

  const createTables = async () => {
    const db = await SQLite.openDatabaseAsync('news.db');
    await db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, cont TEXT, image TEXT)',
        [],
        () => console.log('News table created successfully'),
        (_, error) => console.error('Error creating news table:', error)
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS comment (id INTEGER PRIMARY KEY AUTOINCREMENT, news_id INTEGER, comment TEXT)',
        [],
        () => console.log('Comment table created successfully'),
        (_, error) => console.error('Error creating comment table:', error)
      );
    });
  };

  const fetchNews = async () => {
     await db.transaction((tx) => {
      tx.executeSql(
        'SELECT news.id, news.title, news.content, news.cont, news.image, comment.comment FROM news LEFT JOIN comment ON news.id = comment.news_id',
        [],
        (_, { rows }) => {
          const newsData = {};
          rows._array.forEach((row) => {
            if (!newsData[row.id]) {
              newsData[row.id] = {
                id: row.id,
                title: row.title,
                content: row.content,
                cont: row.cont,
                image: row.image,
                comments: [],
              };
            }
            if (row.comment) {
              newsData[row.id].comments.push(row.comment);
            }
          });
          setNews(Object.values(newsData));
        },
        (_, error) => {
          console.error('Error fetching news:', error);
        }
      );
    });
  };

  const renderNewsItem = ({ item }) => {
    return (
      <View style={styles.newsItem}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <Text style={styles.cont}>{item.cont}</Text>
        <Text style={styles.image}>{item.image}</Text>
        <Text style={styles.comment}>Сэтгэгдэл:</Text>
        {item.comments && item.comments.map((comment, index) => (
          <Text key={index} style={styles.comment}>
            {comment}
          </Text>
        ))}
        <TextInput
          style={styles.commentInput}
          placeholder="Сэтгэгдэл бичих"
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Сэтгэгдэл нийтлэх" onPress={() => addComment(item.id)} />
      </View>
    );
  };

  const addComment = (newsId) => {
    if (newComment.trim() === '') return;

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO comment (news_id, comment) VALUES (?, ?)',
        [newsId, newComment],
        () => {
          fetchNews();
          setNewComment('');
        },
        (_, error) => {
          console.error('Error adding comment:', error);
        }
      );
    });
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
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  newsItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  cont: {
    fontSize: 16,
  },
  image: {
    fontSize: 16,
  },
  comment: {
    fontSize: 16,
    color: 'gray',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default NewsReadScreen;
