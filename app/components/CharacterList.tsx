import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { clearSearchQuery, fetchCharactersThunk, setSearchQuery } from '../redux/slices/charactersSlice';
import { Character, getPageNumberFromUrl } from '../services/api';
import tw from '../utils/tailwind';
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
      <View style={tw`flex-row p-3 bg-slate-800 border-b border-slate-700 items-center`}>
        <TextInput
          style={tw`flex-1 h-10 bg-slate-900 rounded-lg px-3 text-gray-200 mr-2`}
          placeholder="Buscar personagem por nome..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity style={tw`absolute right-[70px] top-[22px] z-10`} onPress={handleClearSearch}>
            <Text style={tw`text-gray-400 text-base font-bold`}>✕</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={tw`bg-yellow-400 px-4 py-2.5 rounded-lg flex-row items-center justify-center shadow-md`} onPress={handleSearch}>
          <Text style={tw`text-black font-bold text-[15px]`}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && characters.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-900 p-5`}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={tw`mt-4 text-base text-gray-200`}>Carregando personagens...</Text>
      </View>
    );
  }

  if (error && characters.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-900 p-5`}>
        <Text style={tw`text-base text-red-500 text-center mb-4`}>{error}</Text>
        <TouchableOpacity 
          style={tw`bg-yellow-400 py-3 px-6 rounded-lg shadow-md`} 
          onPress={() => retryFetch(currentPage)}
        >
          <Text style={tw`text-black font-bold text-base text-center`}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const OfflineBanner = () => {
    if (usingFallbackData) {
      return (
        <View style={tw`bg-gray-600 py-2.5 px-4 flex-row justify-between items-center border-b border-gray-500`}>
          <Text style={tw`text-yellow-400 text-sm flex-1 font-medium`}>{error}</Text>
          <TouchableOpacity 
            style={tw`bg-yellow-400 py-2 px-4 rounded-md ml-2 shadow-sm`} 
            onPress={() => retryFetch(currentPage)}
          >
            <Text style={tw`text-black font-bold text-sm text-center`}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={tw`flex-1 bg-slate-900`}>
      <OfflineBanner />
      {renderSearchBar()}
      
      {pageLoading ? (
        <View style={tw`flex-1 justify-center items-center bg-slate-900 p-5`}>
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
          contentContainerStyle={tw`py-4`}
        />
      )}
      
      <CharacterModal
        isVisible={modalVisible}
        character={selectedCharacter}
        onClose={() => setModalVisible(false)}
      />

      <View style={tw`flex-row justify-between items-center py-4 px-4 bg-slate-800`}>
        <TouchableOpacity 
          style={tw`${(!prevPage || usingFallbackData || pageLoading) ? 'bg-gray-600 opacity-50' : 'bg-yellow-400'} py-2.5 px-4 rounded-lg`} 
          onPress={handlePrevPage}
          disabled={!prevPage || usingFallbackData || pageLoading}
        >
          <Text style={tw`text-black font-bold text-sm`}>Anterior</Text>
        </TouchableOpacity>
        
        <Text style={tw`text-gray-200 text-sm`}>
          {usingFallbackData ? 'Modo Offline' : `Página ${currentPage}`}
        </Text>
        
        <TouchableOpacity 
          style={tw`${(!nextPage || usingFallbackData || pageLoading) ? 'bg-gray-600 opacity-50' : 'bg-yellow-400'} py-2.5 px-4 rounded-lg`} 
          onPress={handleNextPage}
          disabled={!nextPage || usingFallbackData || pageLoading}
        >
          <Text style={tw`text-black font-bold text-sm`}>Próxima</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CharacterList;