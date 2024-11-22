import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { CardHorizontalFood } from './food';
import axios from 'axios';

export interface FoodProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}
export function TrendingFoods() {

  const [foods, setFoods] = useState<FoodProps[]>([]);

  useEffect(() => {
    async function getFoods() {
      const response = await axios.get("http://192.168.3.5:3333/products")
      setFoods(response.data.data);
      console.log(response.data);
    } 
    getFoods();
  }, []);

  return (
    <FlatList
      data={foods}
      renderItem={ ({item}) => <CardHorizontalFood food={item}/> }
      contentContainerStyle= {{ gap: 14, paddingLeft: 16, paddingRight: 16}}
      showsHorizontalScrollIndicator={false}
    />
  );
}