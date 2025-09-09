import charactersReducer, {
  clearSearchQuery,
  fetchCharactersThunk,
  setSearchQuery
} from '../charactersSlice';

jest.mock('../../../services/api', () => ({
  fetchCharacters: jest.fn().mockImplementation(() => Promise.resolve({
    results: [
      {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        birth_year: '19BBY',
        url: 'https://swapi.dev/api/people/1/',
        gender: 'male',
        eye_color: 'blue',
        hair_color: 'blond',
        films: ['https://swapi.dev/api/films/1/']
      }
    ],
    next: 'https://swapi.tech/api/people?page=2',
    previous: null,
    count: 82
  }))
}));

describe('charactersSlice', () => {
  describe('reducers', () => {
    it('deve definir o termo de busca', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: ''
      };

      const nextState = charactersReducer(
        initialState,
        setSearchQuery('Luke')
      );

      expect(nextState.searchQuery).toBe('Luke');
    });

    it('deve limpar o termo de busca', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: 'Luke'
      };

      const nextState = charactersReducer(
        initialState,
        clearSearchQuery()
      );

      expect(nextState.searchQuery).toBe('');
    });
  });

  describe('extraReducers', () => {
    it('deve definir loading como true quando fetchCharactersThunk.pending é disparado', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: ''
      };

      const action = { type: fetchCharactersThunk.pending.type };
      const nextState = charactersReducer(initialState, action);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('deve definir pageLoading como true quando fetchCharactersThunk.pending é disparado e já existem personagens', () => {
      const initialState = {
        characters: [{ 
          name: 'Luke Skywalker', 
          url: 'https://swapi.dev/api/people/1/',
          height: '172',
          mass: '77',
          birth_year: '19BBY',
          gender: 'male',
          eye_color: 'blue',
          hair_color: 'blond',
          films: ['https://swapi.dev/api/films/1/']
        }],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: ''
      };

      const action = { type: fetchCharactersThunk.pending.type };
      const nextState = charactersReducer(initialState, action);

      expect(nextState.pageLoading).toBe(true);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(null);
    });

    it('deve atualizar o estado com os dados quando fetchCharactersThunk.fulfilled é disparado', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: ''
      };

      const mockCharacters = [
        {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          birth_year: '19BBY',
          url: 'https://swapi.dev/api/people/1/',
          gender: 'male',
          eye_color: 'blue',
          hair_color: 'blond',
          films: ['https://swapi.dev/api/films/1/']
        }
      ];

      const action = {
        type: fetchCharactersThunk.fulfilled.type,
        payload: {
          results: mockCharacters,
          next: 'https://swapi.tech/api/people?page=2',
          previous: null
        },
        meta: { arg: { page: 1 } }
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.pageLoading).toBe(false);
      expect(nextState.characters).toEqual(mockCharacters);
      expect(nextState.nextPage).toBe('https://swapi.tech/api/people?page=2');
      expect(nextState.prevPage).toBe(null);
      expect(nextState.error).toBe(null);
    });

    it('deve definir o erro quando fetchCharactersThunk.rejected é disparado', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: ''
      };

      const action = {
        type: fetchCharactersThunk.rejected.type,
        payload: 'Erro ao buscar personagens'
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.pageLoading).toBe(false);
      expect(nextState.error).toBe('Erro ao buscar personagens');
    });
  });
});