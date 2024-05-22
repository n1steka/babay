import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../../utils/axios"; // Assuming axiosInstance is set up for API calls

const DoctorProfileOutputScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axiosInstance.get("/user"); // Adjust the endpoint as needed
      setProfiles(response.data);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileItem = ({ item }) => {
    const imageUri = item.image ? `data:image/jpeg;base64,${item.image}` : null;
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
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={profiles}
          renderItem={renderProfileItem}
          keyExtractor={(item) => item.id.toString()}
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
});

export default DoctorProfileOutputScreen;
