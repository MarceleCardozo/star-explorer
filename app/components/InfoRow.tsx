import React from 'react';
import { Text, View } from 'react-native';
import tw from '../utils/tailwind';

interface InfoRowProps {
  label: string;
  value: string | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={tw`flex-row justify-between py-1.5 border-b border-gray-700`}>
    <Text style={tw`text-base text-gray-200 font-semibold`}>{label}:</Text>
    <Text style={tw`text-base text-gray-200`}>{value || '-'}</Text>
  </View>
);

export default InfoRow;