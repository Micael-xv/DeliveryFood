import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { CardVerticalCupom } from './cupons';
import axios from 'axios';

export interface CupomProps {
  id: string;
  code: string;
  type: string;
  value: number;
  uses: number;
  created_at: Date;
  updated_at: Date;
}
export function Cupons() {
  const [cupoms, setCupons] = useState<CupomProps[]>([]);

  useEffect(() => {
    async function getFoods() {
      const response = await axios.get("http://192.168.68.113:3333/cupoms")
      setCupons(response.data.data);
      console.log(response.data);
    } 
    getFoods();
  }, []);

  return (
    <FlatList
      data={cupoms}
      renderItem={ ({item}) => <CardVerticalCupom item={item}/> }
      horizontal={false}
      contentContainerStyle= {{ gap: 14, paddingLeft: 16, paddingRight: 16}}
      showsVerticalScrollIndicator={true}
    />
  );
}