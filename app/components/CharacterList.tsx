import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearSearchQuery, fetchCharactersThunk, setSearchQuery } from '../redux/slices/charactersSlice';
import { Character, getPageNumberFromUrl } from '../services/api';
import CharacterCard from './CharacterCard';
import CharacterModal from './CharacterModal';

const CharacterList: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { 
    characters, 
    loading, 
    pageLoading, 
    error, 
    nextPage, 
    prevPage, 
    currentPage, 
    searchQuery 
  } = useAppSelector(state => state.characters);
  const usingFallbackData = error !== null && characters.length > 0;

  const retryFetch = (page: number) => {
    dispatch(fetchCharactersThunk({ page, query: searchQuery }));
  };

  useEffect(() => {
    dispatch(fetchCharactersThunk({ page: 1, query: '' }));
  }, [dispatch]);

  const handleNextPage = () => {
    if (nextPage) {
      const nextPageNumber = getPageNumberFromUrl(nextPage);
      dispatch(fetchCharactersThunk({ page: nextPageNumber, query: searchQuery }));
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      const prevPageNumber = getPageNumberFromUrl(prevPage);
      dispatch(fetchCharactersThunk({ page: prevPageNumber, query: searchQuery }));
    }
  };
  
  const handleSearch = () => {
    dispatch(fetchCharactersThunk({ page: 1, query: searchQuery }));
  };
  
  const handleClearSearch = () => {
    dispatch(clearSearchQuery());
    dispatch(fetchCharactersThunk({ page: 1, query: '' }));
  };

  const renderSearchBar = () => (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personagem por nome..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && characters.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={styles.loadingText}>Carregando personagens...</Text>
      </View>
    );
  }

  if (error && characters.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => retryFetch(currentPage)}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const OfflineBanner = () => {
    if (usingFallbackData) {
      return (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButtonSmall} 
            onPress={() => retryFetch(currentPage)}
          >
            <Text style={styles.retryButtonTextSmall}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      {renderSearchBar()}
      
      {pageLoading ? (
        <View style={styles.pageLoadingContainer}>
          <ActivityIndicator size="large" color="#FFE81F" />
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <CharacterCard
              name={item.name}
              height={item.height}
              mass={item.mass}
              birthYear={item.birth_year}
              onPress={() => {
                setSelectedCharacter(item);
                setModalVisible(true);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <CharacterModal
        isVisible={modalVisible}
        character={selectedCharacter}
        onClose={() => setModalVisible(false)}
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, (!prevPage || usingFallbackData || pageLoading) && styles.disabledButton]} 
          onPress={handlePrevPage}
          disabled={!prevPage || usingFallbackData || pageLoading}
        >
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>
          {usingFallbackData ? 'Modo Offline' : `Página ${currentPage}`}
        </Text>
        
        <TouchableOpacity 
          style={[styles.paginationButton, (!nextPage || usingFallbackData || pageLoading) && styles.disabledButton]} 
          onPress={handleNextPage}
          disabled={!nextPage || usingFallbackData || pageLoading}
        >
          <Text style={styles.paginationButtonText}>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchLabel: {
    color: '#FFE81F',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#E5E7EB',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#FFE81F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#FFE81F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  searchButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  clearButton: {
    position: 'absolute',
    right: 70,
    top: 22,
    zIndex: 1,
  },
  clearButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
  },
  pageLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E5E7EB',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FFE81F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#FFE81F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButtonSmall: {
    backgroundColor: '#FFE81F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#FFE81F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retryButtonTextSmall: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offlineBanner: {
    backgroundColor: '#4B5563',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6B7280',
  },
  offlineBannerText: {
    color: '#FFE81F',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1E293B',
  },
  paginationButton: {
    backgroundColor: '#FFE81F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#4B5563',
    opacity: 0.5,
  },
  paginationButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageIndicator: {
    color: '#E5E7EB',
    fontSize: 14,
  },
});

export default CharacterList;