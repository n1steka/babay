import React, { useState } from "react";
import { View, Modal, Text, TextInput, Button, StyleSheet } from "react-native";
import axiosInstance from "../../utils/axios";
import { usePostContext } from "../../context/postContext";
const EditDoctorModal = ({ visible, onClose, doctor }) => {
  const { fetchDoctors } = usePostContext();
  const [editedDoctor, setEditedDoctor] = useState(doctor);

  const handleSave = async () => {
    const response = await axiosInstance.put(`/doctors/${doctor._id}`);
    if (response) {
      console.log(response.data.data);
      fetchDoctors();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text>Edit Doctor Information</Text>
        <Text> {editedDoctor._id} </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={editedDoctor.name}
          onChangeText={(text) =>
            setEditedDoctor({ ...editedDoctor, name: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Education"
          value={editedDoctor.education}
          onChangeText={(text) =>
            setEditedDoctor({ ...editedDoctor, education: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Hospital"
          value={editedDoctor.hospital}
          onChangeText={(text) =>
            setEditedDoctor({ ...editedDoctor, hospital: text })
          }
        />{" "}
        v
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={editedDoctor.phoneNumber}
          onChangeText={(text) =>
            setEditedDoctor({ ...editedDoctor, phoneNumber: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={editedDoctor.address}
          onChangeText={(text) =>
            setEditedDoctor({ ...editedDoctor, address: text })
          }
        />
        <Button title="Save" onPress={handleSave} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
});

export default EditDoctorModal;
