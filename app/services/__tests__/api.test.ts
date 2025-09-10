import axios from 'axios';
import { fetchCharacters, getPageNumberFromUrl } from '../api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCharacters', () => {
    it('should fetch characters successfully', async () => {
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

    it('should fetch characters with search term', async () => {
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
        'https://swapi.tech/api/people?name=Luke'
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, 'https://swapi.tech/api/people/1');

      expect(result.results[0].name).toBe('Luke Skywalker');
    });

    it('should handle errors when fetching character details', async () => {
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

    it('should throw error when main API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(fetchCharacters()).rejects.toThrow();
    });
  });

  describe('getPageNumberFromUrl', () => {
    it('should extract page number from URL', () => {
      const url = 'https://swapi.tech/api/people?page=3&limit=10';
      expect(getPageNumberFromUrl(url)).toBe(3);
    });

    it('should return 1 when URL does not contain page number', () => {
      const url = 'https://swapi.tech/api/people';
      expect(getPageNumberFromUrl(url)).toBe(1);
    });

    it('should return 1 when URL is null', () => {
      expect(getPageNumberFromUrl(null)).toBe(1);
    });

    it('should return 1 when URL is undefined', () => {
      expect(getPageNumberFromUrl(undefined as any)).toBe(1);
    });

    it('should extract page from URLs with different formats', () => {
      expect(getPageNumberFromUrl('https://swapi.tech/api/people?page=5')).toBe(5);
      expect(getPageNumberFromUrl('https://swapi.tech/api/people?page=10&limit=10')).toBe(10);
      expect(getPageNumberFromUrl('https://swapi.tech/api/people?name=luke&page=3')).toBe(3);
    });

    it('should return 1 for malformed URLs', () => {
      expect(getPageNumberFromUrl('invalid-url')).toBe(1);
      expect(getPageNumberFromUrl('https://swapi.tech/api/people?page=abc')).toBe(1);
      expect(getPageNumberFromUrl('https://swapi.tech/api/people?page=')).toBe(1);
    });
  });

  describe('fetchCharacters - additional cases', () => {
    it('should handle empty API response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          message: 'ok',
          total_records: 0,
          total_pages: 0,
          previous: null,
          next: null,
          results: []
        }
      });

      const result = await fetchCharacters();

      expect(result.results).toEqual([]);
      expect(result.count).toBe(0);
      expect(result.next).toBeNull();
      expect(result.previous).toBeNull();
    });

    it('should make request with correct parameters for specific page', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          message: 'ok',
          total_records: 82,
          total_pages: 9,
          previous: 'https://swapi.tech/api/people?page=1&limit=10',
          next: 'https://swapi.tech/api/people?page=3&limit=10',
          results: []
        }
      });

      await fetchCharacters(2);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://swapi.tech/api/people?page=2&limit=10'
      );
    });

    it('should handle search that returns direct result', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          result: [
            {
              properties: {
                name: 'Luke Skywalker',
                height: '172',
                mass: '77',
                birth_year: '19BBY',
                gender: 'male',
                eye_color: 'blue',
                hair_color: 'blond',
                films: ['https://swapi.dev/api/films/1/'],
                url: 'https://swapi.tech/api/people/1'
              }
            }
          ]
        }
      });

      const result = await fetchCharacters(1, 'Luke');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://swapi.tech/api/people?name=Luke'
      );
      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('Luke Skywalker');
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(fetchCharacters()).rejects.toThrow('Network Error');
    });

    it('should handle request timeout', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      timeoutError.name = 'TimeoutError';
      mockedAxios.get.mockRejectedValueOnce(timeoutError);

      await expect(fetchCharacters()).rejects.toThrow('timeout of 5000ms exceeded');
    });

    it('should correctly process characters with partial data', async () => {
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
              height: undefined,
              mass: null,
              birth_year: '',
              gender: 'male'
            }
          }
        }
      });

      const result = await fetchCharacters();

      expect(result.results[0]).toEqual({
        name: 'Luke Skywalker',
        height: 'Desconhecido',
        mass: 'Desconhecido',
        birth_year: 'Desconhecido',
        url: 'https://swapi.tech/api/people/1',
        gender: 'male',
        eye_color: 'Desconhecido',
        hair_color: 'Desconhecido',
        films: []
      });
    });
  });
});