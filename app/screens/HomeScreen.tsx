import { SafeAreaView, StatusBar, Text, View } from "react-native";
import CharacterList from "../components/CharacterList";
import StarField from "../components/StarField";
import tw from "../utils/tailwind";

export default function HomeScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-slate-900`}>
      <StarField />
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={tw`p-4 bg-slate-800/90 border-b border-slate-600 mt-4`}>
        <Text style={tw`text-2xl font-bold text-yellow-400 text-center`}>Star Explorer</Text>
        <Text style={tw`text-base text-gray-200 text-center mt-1`}>Personagens de Star Wars</Text>
      </View>
      <CharacterList />
    </SafeAreaView>
  );
}