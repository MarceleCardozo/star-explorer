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

const BASE_URL = 'https://swapi.dev/api';

export const fetchCharacters = async (page: number = 1, retryCount: number = 0, maxRetries: number = 2): Promise<ApiResponse> => {
  try {
    console.log('Buscando página:', page, 'Tentativa:', retryCount + 1);
    
    const response = await axios.get(`${BASE_URL}/people`);
    
    console.log('Status da resposta:', response);
    
    const data: ApiResponse = response.data;
    console.log('Dados recebidos:', data.count, 'personagens');
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