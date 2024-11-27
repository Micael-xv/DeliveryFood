import { Text, View, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Banner } from "./../components/banner/index";
import { TrendingFoods } from "../components/trending";
import Constants from "expo-constants";
import { Section } from "../components/section";


const statusBarHeight = Constants.statusBarHeight;
export default function Index() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={true}
    >
      <View className="w-full px-3" style={{ marginTop: statusBarHeight + 8 }}>
        <Header />

        <Banner />
      </View>

      <Section
        name="Produtos"
        label="Veja mais"
        action={() => console.log("Clicou em ver mais")}
        size="text-2xl"
      />

      <TrendingFoods/>

    </ScrollView>
  );
}
