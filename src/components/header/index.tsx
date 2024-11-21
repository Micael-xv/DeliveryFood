import React, { useState } from "react";
import { View, Pressable, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

export function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Pressable
        style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="menu" size={20} color="#121212" />
      </Pressable>

      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#4A5568' }}>Localização</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="map-pin" size={14} color={"#FF0000"} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Chapecó</Text>
        </View>
      </View>

      <Pressable style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Feather name="bell" size={20} color="#121212" />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Menu</Text>
            <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Produtos'); }}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>CRUD de Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Cupom'); }}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>CRUD de Cupons</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Login'); }}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 16, color: 'red' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}