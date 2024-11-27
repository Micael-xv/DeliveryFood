import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  idCategory: string;
}

interface Category {
  id: number;
  name: string;
}

// Define PartialProduct with all properties optional
type PartialProduct = Partial<Product> & { id?: number };

export default function ProdutosScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<PartialProduct | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.68.113:3333/products');
      console.log('Produtos buscados:', response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Erro ao buscar produtos. Por favor, tente novamente mais tarde.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.68.113:3333/categories');
      console.log('Categorias buscadas:', response.data);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      Alert.alert('Erro', 'Erro ao buscar categorias. Por favor, tente novamente mais tarde.');
    }
  };

  const handleSave = async () => {
    try {
      if (!currentProduct?.name || !currentProduct?.price || !currentProduct?.description || !currentProduct?.idCategory) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }

      let response;
      if (currentProduct.id) {
        console.log('Editando produto:', currentProduct);
        response = await axios.post(`http://192.168.68.113:3333/products/persist/${currentProduct.id}`, currentProduct);
      } else {
        console.log('Criando produto:', currentProduct);
        response = await axios.post('http://192.168.68.113:3333/products/persist', currentProduct);
      }

      console.log('Resposta da API:', response.data);
      if (response.data.success) {
        Alert.alert('Sucesso', currentProduct.id ? 'Produto editado com sucesso.' : 'Produto criado com sucesso.');
      } else {
        Alert.alert( response.data.message || 'Erro ao salvar produto. Por favor, tente novamente mais tarde.');
      }

      setDialogVisible(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      Alert.alert('Erro', 'Erro ao salvar produto. Por favor, tente novamente mais tarde.');
    }
  };

  const handleDelete = async (product: Product) => {
    Alert.alert(
      'Confirmação',
      `Deseja deletar o registro com id ${product.id}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.post('http://192.168.68.113:3333/products/destroy', { id: product.id });
              if (response.data.success) {
                Alert.alert('Sucesso', 'Produto excluído com sucesso.');
                fetchProducts();
              } else {
                Alert.alert( response.data.message || 'Erro ao excluir produto. Por favor, tente novamente mais tarde.');
              }
            } catch (error) {
              console.error('Erro ao excluir produto:', error);
              Alert.alert('Erro', 'Erro ao excluir produto. Por favor, tente novamente mais tarde.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setDialogVisible(true);
  };

  const handleCreate = () => {
    setCurrentProduct({ id: 0, name: '', price: '', description: '', image: '', idCategory: '' });
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.container}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.price}</Text>
                <Text style={styles.tableCell}>{item.description}</Text>
                <View style={styles.tableCellActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Nome</Text>
              <Text style={styles.tableHeaderCell}>Preço</Text>
              <Text style={styles.tableHeaderCell}>Descrição</Text>
              <Text style={styles.tableHeaderCell}>Ações</Text>
            </View>
          )}
        />
      </SafeAreaView>
      <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      <Modal visible={dialogVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{currentProduct?.id ? 'Editar Produto' : 'Adicionar Produto'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={currentProduct?.name}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              value={currentProduct?.price}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={currentProduct?.description}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Imagem"
              value={currentProduct?.image}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, image: text })}
            />
            <Picker
              selectedValue={currentProduct?.idCategory}
              style={styles.input}
              onValueChange={(itemValue) => setCurrentProduct({ ...currentProduct, idCategory: itemValue })}
            >
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5', 
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f8f8f8', 
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16, 
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginBottom: 10, 
  },
  tableCell: {
    flex: 1,
    textAlign: 'center', 
    fontSize: 14,
  },
  tableCellActions: {
    flexDirection: 'row',
    justifyContent: 'center', 
  },
  editButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007BFF',
    borderRadius: 4, 
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F44336',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2196F3',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', 
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F44336',
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
