import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Character } from '../services/api';

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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{character.name}</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Altura:</Text>
                <Text style={styles.infoValue}>{character.height} cm</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Peso:</Text>
                <Text style={styles.infoValue}>{character.mass} kg</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nascimento:</Text>
                <Text style={styles.infoValue}>{character.birth_year}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gênero:</Text>
                <Text style={styles.infoValue}>{character.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cor dos olhos:</Text>
                <Text style={styles.infoValue}>{character.eye_color}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cor do cabelo:</Text>
                <Text style={styles.infoValue}>{character.hair_color}</Text>
              </View>
            </View>

            {character.films && character.films.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Aparece em</Text>
                {character.films.map((film, index) => (
                  <Text key={index} style={styles.filmItem}>
                    • {getFilmName(film)}
                  </Text>
                ))}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#FFE81F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFE81F',
  },
  scrollView: {
    width: '100%',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFE81F',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFE81F',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoLabel: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  filmItem: {
    fontSize: 16,
    color: '#E5E7EB',
    paddingVertical: 4,
  },
  closeButton: {
    backgroundColor: '#FFE81F',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CharacterModal;