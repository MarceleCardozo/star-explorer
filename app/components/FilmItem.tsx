import React from 'react';
import { Text } from 'react-native';
import tw from '../utils/tailwind';

interface FilmItemProps {
  filmName: string;
}

const FilmItem: React.FC<FilmItemProps> = ({ filmName }) => (
  <Text style={tw`text-base text-gray-200 py-1`}>
    • {filmName}
  </Text>
);

export default FilmItem;