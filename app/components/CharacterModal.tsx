import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import tw from '../utils/tailwind';
import { Character } from '../services/api';
import InfoRow from './InfoRow';
import FilmItem from './FilmItem';
import InfoSection from './InfoSection';

interface CharacterModalProps {
  isVisible: boolean;
  character: Character | null;
  onClose: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isVisible, character, onClose }) => {
  if (!character) return null;

  const getFilmName = (url: string) => {
    const filmId = url.split('/').filter(Boolean).pop();
    const filmNames: Record<string, string> = {
      '1': 'Episódio IV: Uma Nova Esperança',
      '2': 'Episódio V: O Império Contra-Ataca',
      '3': 'Episódio VI: O Retorno de Jedi',
      '4': 'Episódio I: A Ameaça Fantasma',
      '5': 'Episódio II: Ataque dos Clones',
      '6': 'Episódio III: A Vingança dos Sith',
      '7': 'Episódio VII: O Despertar da Força',
    };
    return filmNames[filmId || ''] || `Filme ${filmId}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/70`}>
        <View style={tw`w-[85%] max-h-[80%] bg-gray-800 rounded-xl p-5 items-center shadow-lg border border-yellow-400`}>
          <Text style={tw`text-2xl font-bold text-yellow-400 mb-4 text-center`}>{character.name}</Text>
          
          <ScrollView style={tw`w-full my-2.5`}>
            <InfoSection title="Informações Pessoais">
              <InfoRow label="Altura" value={`${character.height} cm`} />
              <InfoRow label="Peso" value={`${character.mass} kg`} />
              <InfoRow label="Nascimento" value={character.birth_year} />
              <InfoRow label="Gênero" value={character.gender} />
              <InfoRow label="Cor dos olhos" value={character.eye_color} />
              <InfoRow label="Cor do cabelo" value={character.hair_color} />
            </InfoSection>

            {character.films && character.films.length > 0 && (
              <InfoSection title="Aparece em">
                {character.films.map((film, index) => (
                  <FilmItem key={index} filmName={getFilmName(film)} />
                ))}
              </InfoSection>
            )}
          </ScrollView>

          <TouchableOpacity
            style={tw`mt-4 bg-yellow-500 py-2.5 px-5 rounded-lg`}
            onPress={onClose}
          >
            <Text style={tw`text-base font-bold text-gray-900`}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CharacterModal;