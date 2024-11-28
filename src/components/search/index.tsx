import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      axios
        .get(`http://192.168.68.113:3333/products?name=${query}`)
        .then(response => {
          setResults(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar produtos:", error);
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={24} color={"#64748b"} />
        <TextInput
          style={styles.input}
          placeholder="Buscar produtos..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Buscando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem}>
              <Text style={styles.resultText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>Nenhum produto encontrado</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    flexDirection: 'row',
    borderColor: '#64748b',
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    backgroundColor: 'transparent',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#64748b',
  },
});
