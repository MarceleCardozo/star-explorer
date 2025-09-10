import React from 'react';
import { Text, View } from 'react-native';
import tw from '../utils/tailwind';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <View style={tw`w-full mb-5`}>
    <Text style={tw`text-lg font-bold text-yellow-400 mb-2.5`}>{title}</Text>
    {children}
  </View>
);

export default InfoSection;