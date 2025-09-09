import axios from 'axios';

export interface Character {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  url: string;
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
    let url = `${BASE_URL}/people/?page=${page}`;
    if (searchQuery) {
      url = `${BASE_URL}/people/?search=${encodeURIComponent(searchQuery)}&page=${page}`;
    }
    
    const response = await axios.get(url);

    console.log(response, 'response')
    
    console.log('Status da resposta:', response.data);
    
    const data: ApiResponse = response.data;
    return data;
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