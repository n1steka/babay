import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, GestureHandlerRootView,ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-gesture-handler';

const News = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [cont, setCont] = useState('');

  useEffect(async () => {
    const db = SQLite.openDatabaseAsync('news.db');
    await db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS news (news_id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, image BLOB, cont TEXT,comment TEXT, year INTEGER, month INTEGER);'
      );
    });
  }, []);

  const handleChooseImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
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

  const saveNewsPost = async () => {
    const db = await SQLite.openDatabaseAsync('news.db');
    await db.transaction(tx => {
      tx.executeSql('INSERT INTO news (title, content, image, cont) VALUES (?,?,?,?)', [title, content, image, cont]);
    });
    setTitle('');
    setContent('');
    setImage(null);
    setCont('');
  };

  return (
    <GestureHandlerRootView>
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
      <TouchableOpacity style={styles.button} onPress={handleChooseImage}>
        <Text>Choose Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveNewsPost}>
        <Text>Save News Post</Text>
      </TouchableOpacity>
    </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default News;