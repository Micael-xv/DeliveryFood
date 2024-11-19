import { View, Pressable, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { FoodProps } from '..';
export function CardHorizontalFood({ food }: {food: FoodProps}) {
  return (
    <Pressable className='flex flex-col rounded-xl'>
      <Image
        source= {{ uri: food.image}}
        className="w-44 h-36 rounded-xl"
      />
      <Text className='text-green-700 font-medium text-lg'>R$ {food.price}</Text>
      <Text className='text-black mt-1'>{food.name}</Text>
    </Pressable>
  );
}