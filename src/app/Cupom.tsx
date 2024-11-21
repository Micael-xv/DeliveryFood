// CupomCrud.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

interface Cupom {
  id: number;
  code: string;
  discount: number;
  expirationDate: string;
}

export default function CupomCrud() {
  const [cupoms, setCupoms] = useState<Cupom[]>([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [editingCupom, setEditingCupom] = useState<Cupom | null>(null);

  useEffect(() => {
    fetchCupoms();
  }, []);

  const fetchCupoms = async () => {
    try {
      const response = await axios.get('http://192.168.3.5:3333/cupoms');
      setCupoms(response.data);
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingCupom) {
        await axios.put(`http://192.168.3.5:3333/cupoms/${editingCupom.id}`, {
          code,
          discount: Number(discount),
          expirationDate,
        });
        Alert.alert('Sucesso', 'Cupom atualizado com sucesso!');
      } else {
        await axios.post('http://192.168.3.5:3333/cupoms', {
          code,
          discount: Number(discount),
          expirationDate,
        });
        Alert.alert('Sucesso', 'Cupom criado com sucesso!');
      }
      setCode('');
      setDiscount('');
      setExpirationDate('');
      setEditingCupom(null);
      fetchCupoms();
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o cupom.');
    }
  };

  const handleEdit = (cupom: Cupom) => {
    setCode(cupom.code);
    setDiscount(cupom.discount.toString());
    setExpirationDate(cupom.expirationDate);
    setEditingCupom(cupom);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://192.168.3.5:3333/cupoms/${id}`);
      Alert.alert('Sucesso', 'Cupom deletado com sucesso!');
      fetchCupoms();
    } catch (error) {
      console.error('Erro ao deletar cupom:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao deletar o cupom.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Cupons</Text>
      <FlatList
        data={cupoms}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cupomContainer}>
            <Text>{item.code} - {item.discount}% - Expira: {item.expirationDate}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Código"
          value={code}
          onChangeText={setCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Desconto (%)"
          value={discount}
          onChangeText={setDiscount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Expiração"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateOrUpdate}>
          <Text style={styles.buttonText}>{editingCupom ? 'Atualizar Cupom' : 'Criar Cupom'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  cupomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
  },
});

