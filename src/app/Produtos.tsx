import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, StyleSheet } from 'react-native';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  idCategory: number;
}

export default function ProdutosScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.3.5:3333/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Erro ao buscar produtos. Por favor, tente novamente mais tarde.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.3.5:3333/categories');
      setCategories(response.data);
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
        response = await axios.post(`http://192.168.3.5:3333/products/persist/${currentProduct.id}`, currentProduct);
        Alert.alert('Sucesso', 'Produto editado com sucesso.');
      } else {
        response = await axios.post('http://192.168.3.5:3333/products/persist', currentProduct);
        Alert.alert('Sucesso', 'Produto criado com sucesso.');
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
      if (confirm(`Deseja deletar o registro com id ${product.id}`)) {
        await axios.post('http://192.168.3.5:3333/products/destroy', { id: product.id });
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
    setCurrentProduct({ id: 0, name: '', price: '', description: '', image: '', idCategory: 0 });
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>{item.price}</Text>
            <Text>{item.description}</Text>
            <Text>{item.idCategory}</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Categoria"
              value={currentProduct?.idCategory.toString()}
              onChangeText={(text) => setCurrentProduct({ ...currentProduct, idCategory: parseInt(text) })}
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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#ccc',
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