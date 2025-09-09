import axios from 'axios';

export interface Character {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  url: string;
}

export interface SwapiCharacter {
  uid: string;
  name: string;
  url: string;
}

export interface SwapiResponse {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: SwapiCharacter[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

const BASE_URL = 'https://swapi.tech/api';

export const fetchCharacters = async (page: number = 1, searchQuery: string = '', retryCount: number = 0, maxRetries: number = 2): Promise<ApiResponse> => {
  try {
    let url = `${BASE_URL}/people`;
    if (page > 1) {
      url = `${BASE_URL}/people?page=${page}&limit=10`;
    }
    if (searchQuery) {
      url = `${BASE_URL}/people/?search=${encodeURIComponent(searchQuery)}&page=${page}`;
    }
    
    const response = await axios.get(url);
    
    console.log('Status da resposta:', response.data);
    
    // Adaptar a resposta da API SWAPI.tech para o formato esperado pelo componente
    const swapiData: SwapiResponse = response.data;
    
    // Converter para o formato ApiResponse
    const apiResponse: ApiResponse = {
      count: swapiData.total_records,
      next: swapiData.next,
      previous: swapiData.previous,
      results: await Promise.all(swapiData.results.map(async (character) => {
        // Para cada personagem, precisamos fazer uma requisição adicional para obter os detalhes
        try {
          const detailResponse = await axios.get(`${BASE_URL}/people/${character.uid}`);
          const characterDetail = detailResponse.data.result.properties;
          
          return {
            name: character.name,
            height: characterDetail.height || 'Desconhecido',
            mass: characterDetail.mass || 'Desconhecido',
            birth_year: characterDetail.birth_year || 'Desconhecido',
            url: character.url
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes do personagem ${character.name}:`, error);
          return {
            name: character.name,
            height: 'Desconhecido',
            mass: 'Desconhecido',
            birth_year: 'Desconhecido',
            url: character.url
          };
        }
      }))
    };
    
    return apiResponse;
  } catch (error: any) {
    console.error('Erro ao buscar personagens:', JSON.stringify(error));
    throw error;
  }
};

export const getPageNumberFromUrl = (url: string | null): number => {
  if (!url) return 1;
  
  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
};

export default { fetchCharacters, getPageNumberFromUrl };