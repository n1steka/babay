import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("doctorProfiles.db");

const DoctorProfileOutputScreen = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM doctorProfiles",
        [],
        (_, { rows }) => {
          setProfiles(rows._array);
        },
        (_, error) => {
          console.error("Error fetching doctor profiles:", error);
        }
      );
    });
  };

  const deleteProfile = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM doctorProfiles WHERE id = ?",
        [id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log("Profile deleted successfully");
            // Refresh profiles after deletion
            fetchProfiles();
          } else {
            console.log("No profile deleted");
          }
        },
        (_, error) => {
          console.error("Error deleting profile:", error);
        }
      );
    });
  };

  const renderProfileItem = ({ item }) => {
    return (
      <View style={styles.profileItem}>
        <Text style={styles.label}>Нэр :</Text>
        <Text style={styles.value}>{item.name}</Text>
        <Text style={styles.label}>Боловсрол:</Text>
        <Text style={styles.value}>{item.education}</Text>
        <Text style={styles.label}>Ажлын туршлага:</Text>
        <Text style={styles.value}>{item.hospital}</Text>
        <Text style={styles.label}>Ажлын газрын хаяг:</Text>
        <Text style={styles.value}>{item.address}</Text>
        <Text style={styles.label}>Утасны дугаар:</Text>
        <Text style={styles.value}>{item.phoneNumber}</Text>
        <Text style={styles.label}>Ажлын газрын утасны дугаар:</Text>
        <Text style={styles.value}>{item.phone}</Text>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => deleteProfile(item.id)}
          >
            <Text style={styles.buttonText}>Устгах</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUpdate(item)}
          >
            <Text style={styles.buttonText}>Шинэчлэх</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleUpdate = (item) => {
    // Implement update logic here
    console.log("Updating profile:", item);
    // For navigation to update screen or modal, you can use navigation library or modal component
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        renderItem={renderProfileItem}
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
  profileItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    backgroundColor: "deeppink",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DoctorProfileOutputScreen;
