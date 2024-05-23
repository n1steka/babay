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
import { IMGURL } from "../../utils/axios"; // Ensure the path is correct
import { usePostContext } from "../../context/postContext"; // Ensure the path is correct
import EditDoctorModal from "../components/EditDoctorModal"; // Ensure the path is correct

const DoctorsReadScreen = () => {
  const { fetchDoctors, doctor } = usePostContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

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
        <Button
          title="Мэдээлэл өөрчлөх"
          onPress={() => handleEditDoctor(item)}
        />
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
      {selectedDoctor && (
        <EditDoctorModal
          visible={isEditModalVisible}
          onClose={() => setEditModalVisible(false)}
          doctor={selectedDoctor}
        />
      )}
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
