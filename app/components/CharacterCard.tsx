import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from '../utils/tailwind';

interface CharacterCardProps {
  name: string;
  height: string;
  mass: string;
  birthYear: string;
  onPress: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, height, mass, birthYear, onPress }) => {
  return (
    <TouchableOpacity style={tw`bg-gray-800 rounded-lg p-4 my-2 mx-4 shadow-md`} onPress={onPress} activeOpacity={0.7}>
      <Text style={tw`text-lg font-bold text-yellow-400 mb-2`}>{name}</Text>
      <View style={tw`gap-1 mb-3`}>
        <Text style={tw`text-sm text-gray-200`}>Altura: {height} cm</Text>
        <Text style={tw`text-sm text-gray-200`}>Peso: {mass} kg</Text>
        <Text style={tw`text-sm text-gray-200`}>Nascimento: {birthYear}</Text>
      </View>
      <View style={tw`border-t border-gray-700 pt-2 mt-1 items-center`}>
        <Text style={tw`text-xs text-gray-400 italic`}>Toque para mais detalhes</Text>
      </View>
    </TouchableOpacity>
  );
};


export default CharacterCard;