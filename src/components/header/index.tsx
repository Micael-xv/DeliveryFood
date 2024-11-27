import React, { useState } from "react";
import { View, Pressable, Text, Modal, TouchableOpacity, Image } from "react-native";
import { Ionicons,  Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../app/App';

export function Header() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <Pressable style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Image
              source={require("../../assets/logo-mercado.png")}
              style={{ width: '90%', height: '90%', borderRadius: 20 }}
          />
        </Pressable>

        <View className="flex flex-col items-center justify-center">
            <Text className="text-center text-sm text-slate-800">Localização</Text>

            <View className="flex flex-row items-center justify-center gap-1">
                <Feather name="map-pin" size={14} color="#FF0000" />
                <Text className="text-lg font-bold">Chapecó</Text>
            </View>
        </View>

        <Pressable
          style={{ width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="menu" size={20} color="#121212" />
        </Pressable>
      </View>

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
              <Text style={{ fontSize: 16, marginBottom: 10 }}>Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(false); navigation.navigate('Cupom'); }}>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>Cupons</Text>
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
