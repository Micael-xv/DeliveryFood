import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodProps {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

export function CardHorizontalFood({ food }: { food: FoodProps }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePurchase = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: food.image }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{food.description}</Text>
        <Text style={styles.price}>R$ {food.price}</Text>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.button}
            onPress={handlePurchase}
          >
            <Ionicons name="cart" size={18} color="#2AAA8A" />
            <Text style={styles.buttonText}>Comprar</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Produto comprado com sucesso!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5dc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2AAA8A',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#324f9d',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 66,
    textAlign: 'center',
    marginTop: 50,
    color: '#2AAA8A',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});