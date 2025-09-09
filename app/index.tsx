import { Text, View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import CharacterList from "./components/CharacterList";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <Text style={styles.title}>Star Explorer</Text>
        <Text style={styles.subtitle}>Personagens de Star Wars</Text>
      </View>
      <CharacterList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    padding: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFE81F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 4,
  },
});
