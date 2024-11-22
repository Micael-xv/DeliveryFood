import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
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

export default function ProdutosScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.3.5:3333/products');
      console.log('Produtos buscados:', response.data);
      setProducts(response.data.data); // Acessa o array de produtos dentro do objeto de resposta
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Erro ao buscar produtos. Por favor, tente novamente mais tarde.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.3.5:3333/categories');
      console.log('Categorias buscadas:', response.data);
      setCategories(response.data.data); // Acessa o array de categorias dentro do objeto de resposta
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

      const token = localStorage.getItem('token');
      let response;
      if (currentProduct.id) {
        console.log('Editando produto:', currentProduct);
        response = await axios.post(`http://192.168.3.5:3333/products/persist/${currentProduct.id}`, currentProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log('Criando produto:', currentProduct);
        response = await axios.post('http://192.168.3.5:3333/products/persist', currentProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log('Resposta da API:', response.data);
      if (response.data.success) {
        Alert.alert('Sucesso', currentProduct.id ? 'Produto editado com sucesso.' : 'Produto criado com sucesso.');
      } else {
        Alert.alert('Erro', 'Erro ao salvar produto. Por favor, tente novamente mais tarde.');
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
    try {
      const token = localStorage.getItem('token');
      if (confirm(`Deseja deletar o registro com id ${product.id}`)) {
        await axios.post('http://192.168.3.5:3333/products/destroy', { id: product.id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert('Sucesso', 'Produto excluído com sucesso.');
        fetchProducts();
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      Alert.alert('Erro', 'Erro ao excluir produto. Por favor, tente novamente mais tarde.');
    }
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.itemContainer}>
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
    backgroundColor: '#ddd',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
  },
  tableCellActions: {
    flexDirection: 'row',
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
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
  },
  editButtonText: {
    color: '#007BFF',
  },
  deleteButton: {},
  deleteButtonText: {
    color: '#FF0000',
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
    height: 59,
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