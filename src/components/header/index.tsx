import React, { useState } from "react";
import { View, Pressable, Text, Modal, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../app/App'; // Certifique-se de que o caminho está correto

export function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="w-full flex flex-row items-center justify-between">
      <Pressable
        className="w-10 h-10 bg-white rounded-full flex justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="menu" size={20} color="#121212" />
      </Pressable>

      <View className="flex flex-col items-center justify-center">
        <Text className="text-center text-sm text-slate-800">Localização</Text>

        <View className="flex-row items-center justify-center gap-1">
          <Feather name="map-pin" size={14} color={"#FF0000"}></Feather>
          <Text className="text-lg font-bold">Chapecó</Text>
        </View>
      </View>

      <Pressable className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
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
            <TouchableOpacity onPress={() => { setModalVisible(false); }}>
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
