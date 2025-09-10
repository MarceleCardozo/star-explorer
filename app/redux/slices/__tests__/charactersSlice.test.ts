import charactersReducer, {
  clearPagesCache,
  clearSearchQuery,
  fetchCharactersThunk,
  loadPageFromCache,
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
    it('should set search query', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
      };

      const nextState = charactersReducer(
        initialState,
        setSearchQuery('Luke')
      );

      expect(nextState.searchQuery).toBe('Luke');
    });

    it('should clear search query', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: 'Luke',
        pages: {}
      };

      const nextState = charactersReducer(
        initialState,
        clearSearchQuery()
      );

      expect(nextState.searchQuery).toBe('');
    });

    it('should load page from cache', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {
          '2-': {
            characters: [{
              name: 'C-3PO',
              height: '167',
              mass: '75',
              birth_year: '112BBY',
              url: 'https://swapi.dev/api/people/2/',
              gender: 'n/a',
              eye_color: 'yellow',
              hair_color: 'n/a',
              films: ['https://swapi.dev/api/films/1/']
            }],
            nextPage: 'https://swapi.tech/api/people?page=3',
            prevPage: 'https://swapi.tech/api/people?page=1'
          }
        }
      };

      const nextState = charactersReducer(
        initialState,
        loadPageFromCache({ page: 2, query: '' })
      );

      expect(nextState.currentPage).toBe(2);
      expect(nextState.characters).toHaveLength(1);
      expect(nextState.characters[0].name).toBe('C-3PO');
      expect(nextState.nextPage).toBe('https://swapi.tech/api/people?page=3');
      expect(nextState.prevPage).toBe('https://swapi.tech/api/people?page=1');
    });

    it('should clear pages cache', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {
          '1-': { characters: [], nextPage: null, prevPage: null },
          '2-': { characters: [], nextPage: null, prevPage: null }
        }
      };

      const nextState = charactersReducer(
        initialState,
        clearPagesCache()
      );

      expect(nextState.pages).toEqual({});
    });
  });

  describe('extraReducers', () => {
    it('should set loading to true when fetchCharactersThunk.pending is dispatched', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
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
        searchQuery: '',
        pages: {}
      };

      const action = { type: fetchCharactersThunk.pending.type };
      const nextState = charactersReducer(initialState, action);

      expect(nextState.pageLoading).toBe(true);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(null);
    });

    it('should update state with data when fetchCharactersThunk.fulfilled is dispatched', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
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
        meta: { arg: { page: 1, query: '' } }
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.pageLoading).toBe(false);
      expect(nextState.characters).toEqual(mockCharacters);
      expect(nextState.nextPage).toBe('https://swapi.tech/api/people?page=2');
      expect(nextState.prevPage).toBe(null);
      expect(nextState.error).toBe(null);
      
      expect(nextState.pages['1-']).toEqual({
        characters: mockCharacters,
        nextPage: 'https://swapi.tech/api/people?page=2',
        prevPage: null
      });
    });

    it('should set error when fetchCharactersThunk.rejected is dispatched', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
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

    it('should update currentPage when fetchCharactersThunk.fulfilled is dispatched', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
      };

      const action = {
        type: fetchCharactersThunk.fulfilled.type,
        payload: {
          results: [],
          next: null,
          previous: null
        },
        meta: { arg: { page: 3, query: 'test' } }
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.currentPage).toBe(3);
    });

    it('should save data to cache with query when fetchCharactersThunk.fulfilled is dispatched', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: 'luke',
        pages: {}
      };

      const mockCharacters = [{
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        birth_year: '19BBY',
        url: 'https://swapi.dev/api/people/1/',
        gender: 'male',
        eye_color: 'blue',
        hair_color: 'blond',
        films: ['https://swapi.dev/api/films/1/']
      }];

      const action = {
        type: fetchCharactersThunk.fulfilled.type,
        payload: {
          results: mockCharacters,
          next: null,
          previous: null
        },
        meta: { arg: { page: 1, query: 'luke' } }
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.pages['1-luke']).toEqual({
        characters: mockCharacters,
        nextPage: null,
        prevPage: null
      });
    });

    it('should handle error without payload', () => {
      const initialState = {
        characters: [],
        loading: true,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
      };

      const action = {
        type: fetchCharactersThunk.rejected.type,
        error: { message: 'Network Error' },
        payload: undefined
      };

      const nextState = charactersReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.pageLoading).toBe(false);
      expect(nextState.error).toBe('Erro ao buscar personagens');
    });
  });

  describe('edge cases', () => {
    it('should maintain state when loadPageFromCache is called with non-existent page', () => {
      const initialState = {
        characters: [{
          name: 'Existing Character',
          height: '180',
          mass: '80',
          birth_year: '20BBY',
          url: 'https://swapi.dev/api/people/999/',
          gender: 'male',
          eye_color: 'brown',
          hair_color: 'black',
          films: []
        }],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: 'https://swapi.tech/api/people?page=2',
        prevPage: null,
        currentPage: 1,
        searchQuery: '',
        pages: {}
      };

      const nextState = charactersReducer(
        initialState,
        loadPageFromCache({ page: 5, query: '' })
      );

      expect(nextState).toEqual(initialState);
    });

    it('should maintain searchQuery when setSearchQuery is called with empty string', () => {
      const initialState = {
        characters: [],
        loading: false,
        pageLoading: false,
        error: null,
        nextPage: null,
        prevPage: null,
        currentPage: 1,
        searchQuery: 'previous search',
        pages: {}
      };

      const nextState = charactersReducer(
        initialState,
        setSearchQuery('')
      );

      expect(nextState.searchQuery).toBe('');
    });
  });
});