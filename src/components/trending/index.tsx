import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { CardHorizontalFood } from './food';

export interface FoodProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export function TrendingFoods() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [query, setQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<FoodProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await axios.get("http://192.168.38.192:3333/products");
      setFoods(response.data.data);
      setFilteredFoods(response.data.data);
    }
    getFoods();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = foods.filter(food => food.name.toLowerCase().includes(query.toLowerCase()));
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods(foods);
    }
  }, [query, foods]);

  return (
    <View className="flex-1 p-4 bg-slate-200">
      <View className="flex-row border border-slate-500 h-14 rounded-full items-center gap-2 px-4 bg-white mb-4">
        <Feather name="search" size={24} color={"#64748b"} />
        <TextInput
          className="flex-1 h-full bg-transparent"
          placeholder="Buscar produtos..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {loading ? (
        <Text className="text-center mt-4">Buscando...</Text>
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={({ item }) => <CardHorizontalFood food={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 20, paddingLeft: 16, paddingRight: 16 }}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text className="text-center mt-4 text-gray-600">Nenhum produto encontrado</Text>}
        />
      )}
    </View>
  );
}
