import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { IMGURL } from "../../utils/axios";
import { usePostContext } from "../../context/postContext";
import EditDoctorModal from "../components/EditDoctorModal";

const DoctorsReadScreen = () => {
  const { fetchDoctors, doctor } = usePostContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [role, setRole] = useState("");

  const userRoleFetch = async () => {
    const user = await AsyncStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const role = parsedUser.role;
    setRole(role);
  };

  useEffect(() => {
    userRoleFetch();
    fetchDoctors();
  }, []); // Fetch role only once when the component mounts

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setEditModalVisible(true);
  };

  const renderDoctorItem = ({ item }) => {
    return (
      <View style={styles.doctorItem}>
        <Image
          source={{
            uri: `${IMGURL}/${item.photo}`,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>Name: {item.name}</Text>
        <Text style={styles.education}>Education: {item.education}</Text>
        <Text style={styles.hospital}>Hospital: {item.hospital}</Text>
        <Text style={styles.phoneNumber}>Phone Number: {item.phoneNumber}</Text>
        <Text style={styles.address}>Address: {item.address}</Text>
        {role === "admin" && (
          <Button
            title="Edit Information"
            onPress={() => handleEditDoctor(item)}
          />
        )}
      </View>
    );
  };

  const filteredDoctors = doctor.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        data={filteredDoctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <EditDoctorModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        doctor={selectedDoctor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  doctorItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  education: {
    fontSize: 16,
    marginBottom: 5,
  },
  hospital: {
    fontSize: 16,
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: 280,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default DoctorsReadScreen;
