import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodProps } from '..';

export function CardHorizontalFood({ food }: { food: FoodProps }) {
  return (
    <View className='flex flex-row rounded-xl bg-[#f5f5dc] p-4'>
      <Image
        source={{ uri: food.image }}
        className='w-44 h-36 rounded-xl'
      />
      <View className='flex-1 ml-4'>
        <Text className='text-black mt-1 text-xl'>{food.name}</Text>
        <Text className='text-neutral-600 text-sm' numberOfLines={2}>{food.description}</Text>
        <Text className='text-green-700 font-medium text-lg'>R$ {food.price}</Text>
        <View className='flex-1 justify-end'>
          <Pressable 
            className='flex flex-row bg-white gap-1 rounded-full px-2 py-1 items-center justify-center mt-2'
            onPress={() => console.log('Adicionou ao carrinho')}
            style={{ borderWidth: 2, borderColor: '#324f9d' }}
          >
            <Ionicons name="cart" size={18} color="#2AAA8A" />
            <Text className='text-sm w-20 text-start leading-4 text-black'>Comprar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
