import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Character, fetchCharacters, getPageNumberFromUrl } from '../services/api';
import CharacterCard from './CharacterCard';

const FALLBACK_DATA: Character[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/1/'
  },
  {
    name: 'C-3PO',
    height: '167',
    mass: '75',
    birth_year: '112BBY',
    url: 'https://swapi.dev/api/people/2/'
  },
  {
    name: 'R2-D2',
    height: '96',
    mass: '32',
    birth_year: '33BBY',
    url: 'https://swapi.dev/api/people/3/'
  },
  {
    name: 'Darth Vader',
    height: '202',
    mass: '136',
    birth_year: '41.9BBY',
    url: 'https://swapi.dev/api/people/4/'
  },
  {
    name: 'Leia Organa',
    height: '150',
    mass: '49',
    birth_year: '19BBY',
    url: 'https://swapi.dev/api/people/5/'
  }
];

const CharacterList: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const retryFetch = (page: number) => {
    loadCharacters(page, debouncedSearchQuery);
  };

  const loadCharacters = async (page: number = 1, query: string = '', retryCount: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      const data = await fetchCharacters(page, query);
      
      if (data && data.results) {
        setCharacters(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCurrentPage(page);
      } else {
        throw new Error('Dados inválidos recebidos da API');
      }
    } catch (err: any) {
      console.error('Erro detalhado:', err);
     
      setCharacters(FALLBACK_DATA);
      setUsingFallbackData(true);
      setNextPage(null);
      setPrevPage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters(1, debouncedSearchQuery);
  }, [debouncedSearchQuery]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNextPage = () => {
    if (nextPage) {
      const nextPageNumber = getPageNumberFromUrl(nextPage);
      loadCharacters(nextPageNumber, debouncedSearchQuery);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      const prevPageNumber = getPageNumberFromUrl(prevPage);
      loadCharacters(prevPageNumber, debouncedSearchQuery);
    }
  };
  
  const handleSearch = () => {
    setDebouncedSearchQuery(searchQuery);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };

  const renderSearchBar = () => (
    <View>
      <View style={styles.searchLabelContainer}>
        <Text style={styles.searchLabel}>Filtrar personagens por nome:</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar personagem por nome..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
      
      <FlatList
        data={characters}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <CharacterCard
            name={item.name}
            height={item.height}
            mass={item.mass}
            birthYear={item.birth_year}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
      
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, (!prevPage || usingFallbackData) && styles.disabledButton]} 
          onPress={handlePrevPage}
          disabled={!prevPage || usingFallbackData}
        >
          <Text style={styles.paginationButtonText}>Anterior</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>
          {usingFallbackData ? 'Modo Offline' : `Página ${currentPage}`}
        </Text>
        
        <TouchableOpacity 
          style={[styles.paginationButton, (!nextPage || usingFallbackData) && styles.disabledButton]} 
          onPress={handleNextPage}
          disabled={!nextPage || usingFallbackData}
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
  searchLabelContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: '#1E293B',
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
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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