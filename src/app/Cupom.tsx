import { Text, View, ScrollView } from "react-native";
import { Cupons } from "../components/cupomlist";

export default function CupomCrud() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-slate-200"
      showsVerticalScrollIndicator={true}
    >
      <Cupons/>

    </ScrollView>
  );
}