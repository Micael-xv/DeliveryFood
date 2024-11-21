import { Text, View, ScrollView } from "react-native";
import { Header } from "../components/header";
import { Banner } from "./../components/banner/index";
import { Search } from "../components/search";
import { TrendingFoods } from "../components/trending";
import Constants from "expo-constants";
import { Section } from "../components/section";
export * from '../api/cupoms';

const statusBarHeight = Constants.statusBarHeight;
export default function Index() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <Header />

        <Banner />

        <Search />
      </View>

      <Section
        name="Comidas em alta"
        label="Veja mais"
        action={() => console.log("Clicou em ver mais")}
        size="text-2xl"
      />

      <TrendingFoods/>

    </ScrollView>
  );
}
