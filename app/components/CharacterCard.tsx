import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CharacterCardProps {
  name: string;
  height: string;
  mass: string;
  birthYear: string;
  onPress: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, height, mass, birthYear, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Altura: {height} cm</Text>
        <Text style={styles.info}>Peso: {mass} kg</Text>
        <Text style={styles.info}>Nascimento: {birthYear}</Text>
      </View>
      <View style={styles.viewMoreContainer}>
        <Text style={styles.viewMoreText}>Toque para mais detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE81F',
    marginBottom: 8,
  },
  infoContainer: {
    gap: 4,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  viewMoreContainer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});

export default CharacterCard;