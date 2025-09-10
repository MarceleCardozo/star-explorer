import axios from 'axios';

export interface Character {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  url: string;
  gender?: string;
  eye_color?: string;
  hair_color?: string;
  films?: string[];
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

export const fetchCharacters = async (page: number = 1, searchQuery: string = ''): Promise<ApiResponse> => {
  try {
    let url = `${BASE_URL}/people`;
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.append('page', page.toString());
      params.append('limit', '10');
    }
    
    if (searchQuery) {
      params.append('name', searchQuery);
      if (page > 1) {
        params.append('page', page.toString());
      }
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url);

    if (searchQuery && response.data.result && Array.isArray(response.data.result)) {
      const searchResults = response.data.result;
      
      const apiResponse: ApiResponse = {
        count: searchResults.length,
        next: null,
        previous: null,
        results: searchResults.map((item: any) => ({
          name: item.properties.name,
          height: item.properties.height || 'Desconhecido',
          mass: item.properties.mass || 'Desconhecido',
          birth_year: item.properties.birth_year || 'Desconhecido',
          url: item.properties.url,
          gender: item.properties.gender || 'Desconhecido',
          eye_color: item.properties.eye_color || 'Desconhecido',
          hair_color: item.properties.hair_color || 'Desconhecido',
          films: item.properties.films || []
        }))
      };
      
      return apiResponse;
    }

    const swapiData: SwapiResponse = response.data;
    
    const apiResponse: ApiResponse = {
      count: swapiData.total_records,
      next: swapiData.next,
      previous: swapiData.previous,
      results: await Promise.all(swapiData.results.map(async (character) => {
        try {
          const detailResponse = await axios.get(`${BASE_URL}/people/${character.uid}`);
          const characterDetail = detailResponse.data.result.properties;
          
          return {
            name: character.name,
            height: characterDetail.height || 'Desconhecido',
            mass: characterDetail.mass || 'Desconhecido',
            birth_year: characterDetail.birth_year || 'Desconhecido',
            url: character.url,
            gender: characterDetail.gender || 'Desconhecido',
            eye_color: characterDetail.eye_color || 'Desconhecido',
            hair_color: characterDetail.hair_color || 'Desconhecido',
            films: characterDetail.films || []
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes do personagem ${character.name}:`, error);
          return {
            name: character.name,
            height: 'Desconhecido',
            mass: 'Desconhecido',
            birth_year: 'Desconhecido',
            url: character.url,
            gender: 'Desconhecido',
            eye_color: 'Desconhecido',
            hair_color: 'Desconhecido',
            films: []
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