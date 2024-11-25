import { View, Pressable, Text, Image } from "react-native";
import PagerView from "react-native-pager-view";

export function Banner() {
  return (
    <View className="w-full h-36 md:h-60 rounded-2xl mt-5 mb-5">
      <PagerView style={{ flex: 1 }} initialPage={0} pageMargin={14}>
        
        <Pressable
          className="w-full h-36 md:h-60 rounded-2xl"
          key="1"
          onPress={() => console.log("Clicou no BANNER 1")}
        >
          <Image
            source={require("../../assets/cupom1.png")}
            className="w-full h-36 md:h-60 rounded-2xl"
          />
        </Pressable>

        <Pressable
          className="w-full h-36 md:h-60 rounded-2xl"
          key="2"
          onPress={() => console.log("Clicou no BANNER 2")}
        >
          <Image
            source={require("../../assets/cupom2.png")}
            className="w-full h-36 md:h-60 rounded-2xl"
          />
        </Pressable>
      </PagerView>
    
    </View>
  );
}
