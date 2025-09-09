import axios from 'axios';
import { fetchCharacters, getPageNumberFromUrl } from '../api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCharacters', () => {
    it('deve buscar personagens com sucesso', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          message: 'ok',
          total_records: 82,
          total_pages: 9,
          previous: null,
          next: 'https://swapi.tech/api/people?page=2&limit=10',
          results: [
            {
              uid: '1',
              name: 'Luke Skywalker',
              url: 'https://swapi.tech/api/people/1'
            }
          ]
        }
      });

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: {
            properties: {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              birth_year: '19BBY',
              gender: 'male',
              eye_color: 'blue',
              hair_color: 'blond',
              films: [
                'https://swapi.dev/api/films/1/',
                'https://swapi.dev/api/films/2/',
                'https://swapi.dev/api/films/3/'
              ]
            }
          }
        }
      });

      const result = await fetchCharacters();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenNthCalledWith(1, 'https://swapi.tech/api/people');
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://swapi.tech/api/people/1');

      expect(result).toEqual({
        count: 82,
        next: 'https://swapi.tech/api/people?page=2&limit=10',
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            birth_year: '19BBY',
            url: 'https://swapi.tech/api/people/1',
            gender: 'male',
            eye_color: 'blue',
            hair_color: 'blond',
            films: [
              'https://swapi.dev/api/films/1/',
              'https://swapi.dev/api/films/2/',
              'https://swapi.dev/api/films/3/'
            ]
          }
        ]
      });
    });

    it('deve buscar personagens com termo de busca', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          message: 'ok',
          total_records: 1,
          total_pages: 1,
          previous: null,
          next: null,
          results: [
            {
              uid: '1',
              name: 'Luke Skywalker',
              url: 'https://swapi.tech/api/people/1'
            }
          ]
        }
      });

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: {
            properties: {
              name: 'Luke Skywalker',
              height: '172',
              mass: '77',
              birth_year: '19BBY',
              gender: 'male',
              eye_color: 'blue',
              hair_color: 'blond',
              films: ['https://swapi.dev/api/films/1/']
            }
          }
        }
      });

      const result = await fetchCharacters(1, 'Luke');

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        1,
        'https://swapi.tech/api/people/?search=Luke&page=1'
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://swapi.tech/api/people/1');

      expect(result.results[0].name).toBe('Luke Skywalker');
    });

    it('deve lidar com erros ao buscar detalhes do personagem', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          message: 'ok',
          total_records: 1,
          total_pages: 1,
          previous: null,
          next: null,
          results: [
            {
              uid: '1',
              name: 'Luke Skywalker',
              url: 'https://swapi.tech/api/people/1'
            }
          ]
        }
      });

      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await fetchCharacters();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result.results[0]).toEqual({
        name: 'Luke Skywalker',
        height: 'Desconhecido',
        mass: 'Desconhecido',
        birth_year: 'Desconhecido',
        url: 'https://swapi.tech/api/people/1',
        gender: 'Desconhecido',
        eye_color: 'Desconhecido',
        hair_color: 'Desconhecido',
        films: []
      });
    });

    it('deve lançar erro quando a API principal falha', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(fetchCharacters()).rejects.toThrow();
    });
  });

  describe('getPageNumberFromUrl', () => {
    it('deve extrair o número da página da URL', () => {
      const url = 'https://swapi.tech/api/people?page=3&limit=10';
      expect(getPageNumberFromUrl(url)).toBe(3);
    });

    it('deve retornar 1 quando a URL não contém número de página', () => {
      const url = 'https://swapi.tech/api/people';
      expect(getPageNumberFromUrl(url)).toBe(1);
    });

    it('deve retornar 1 quando a URL é null', () => {
      expect(getPageNumberFromUrl(null)).toBe(1);
    });
  });
});