import { View, Pressable, Text, Image } from 'react-native';
import { CupomProps } from '..';

export function CardVerticalCupom({ item }: {item: CupomProps}) {
  return (
    <Pressable 
    className='flex flex-col items-center justify-center'
    onPress={() => console.log("Clicou no Cupom " + item.code)}
    >
     <Text className='text-bg mt-2 w-40 text-center leading-2 text-black' numberOfLines={4}>
         {item.code} 
     </Text>
    </Pressable>
  );
}