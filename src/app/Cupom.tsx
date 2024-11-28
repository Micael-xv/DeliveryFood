import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

interface Cupom {
  id: number;
  code: string;
  type: string;
  value: string;
  uses: number;
}

export default function CupomScreen() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentCupom, setCurrentCupom] = useState<Partial<Cupom> | null>(null);

  useEffect(() => {
    fetchCupons();
  }, []);

  const fetchCupons = async () => {
    try {
      const response = await axios.get('http://192.168.68.113:3333/cupoms');
      console.log('Cupons buscados:', response.data);
      setCupons(response.data.data); // Acessa o array de cupons dentro do objeto de resposta
    } catch (error) {
      console.error('Erro ao buscar cupons:', error);
      Alert.alert('Erro', 'Erro ao buscar cupons. Por favor, tente novamente mais tarde.');
    }
  };

  const handleSave = async () => {
    try {
      if (!currentCupom?.code || !currentCupom?.type || !currentCupom?.value || !currentCupom?.uses) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }

      let response;
      if (currentCupom.id) {
        console.log('Editando cupom:', currentCupom);
        response = await axios.post(`http://192.168.68.113:3333/cupoms/persist/${currentCupom.id}`, currentCupom);
      } else {
        console.log('Criando cupom:', currentCupom);
        response = await axios.post('http://192.168.68.113:3333/cupoms/persist', currentCupom);
      }

      console.log('Resposta da API:', response.data);
      if (response.data.success) {
        Alert.alert('Sucesso', currentCupom.id ? 'Cupom editado com sucesso.' : 'Cupom criado com sucesso.');
      } else {
        Alert.alert( response.data.message || 'Erro ao salvar cupom. Por favor, tente novamente mais tarde.');
      }

      setDialogVisible(false);
      setCurrentCupom(null);
      fetchCupons();
    } catch (error) {
      console.error('Erro ao salvar cupom:', error);
      Alert.alert( 'Erro ao salvar cupom. Por favor, tente novamente mais tarde.');
    }
  };

  const handleDelete = async (cupom: Cupom) => {
    Alert.alert(
      'Confirmação',
      `Deseja deletar o registro com id ${cupom.id}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.post('http://192.168.68.113:3333/cupoms/destroy', { id: cupom.id });
              if (response.data.success) {
                Alert.alert('Sucesso', 'Cupom excluído com sucesso.');
                setCupons(cupons.filter(c => c.id !== cupom.id)); // Atualiza o estado dos cupons
              }
            } catch (error) {
              Alert.alert( 'Erro ao excluir cupom. Por favor, tente novamente mais tarde.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (cupom: Cupom) => {
    setCurrentCupom(cupom);
    setDialogVisible(true);
  };

  const handleCreate = () => {
    setCurrentCupom({ id: 0, code: '', type: '', value: '', uses: 0 });
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cupons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Código: {item.code}</Text>
            <Text style={styles.itemText}>Tipo: {item.type}</Text>
            <Text style={styles.itemText}>Valor: {item.value}</Text>
            <Text style={styles.itemText}>Usos: {item.uses}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Cupom</Text>
            <Text style={styles.tableHeaderCell}>Tipo</Text>
            <Text style={styles.tableHeaderCell}>Valor</Text>
            <Text style={styles.tableHeaderCell}>Usos</Text>
            <Text style={styles.tableHeaderCell}>Ações</Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar Cupom</Text>
      </TouchableOpacity>

      <Modal visible={dialogVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{currentCupom?.id ? 'Editar Cupom' : 'Adicionar Cupom'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Código"
              value={currentCupom?.code}
              onChangeText={(text) => setCurrentCupom({ ...currentCupom, code: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Tipo"
              value={currentCupom?.type}
              onChangeText={(text) => setCurrentCupom({ ...currentCupom, type: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={currentCupom?.value}
              onChangeText={(text) => setCurrentCupom({ ...currentCupom, value: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade de uso"
              value={currentCupom?.uses ? currentCupom.uses.toString() : ''}
              onChangeText={(text) => setCurrentCupom({
                ...currentCupom,
                uses: text ? parseInt(text) : 0
              })}
/>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setDialogVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#ddd',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemText: {
    fontSize: 16,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FF0000',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
  },
  addButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 8,
    padding: 8,
    backgroundColor: '#FF0000',
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
  },
  saveButton: {
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
  },
});