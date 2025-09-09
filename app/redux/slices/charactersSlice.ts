import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, fetchCharacters } from '../../services/api';

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

interface CharactersState {
  characters: Character[];
  loading: boolean;
  pageLoading: boolean;
  error: string | null;
  nextPage: string | null;
  prevPage: string | null;
  currentPage: number;
  searchQuery: string;
}

const initialState: CharactersState = {
  characters: [],
  loading: true,
  pageLoading: false,
  error: null,
  nextPage: null,
  prevPage: null,
  currentPage: 1,
  searchQuery: '',
};

export const fetchCharactersThunk = createAsyncThunk(
  'characters/fetchCharacters',
  async ({ page, query }: { page: number; query: string }, { rejectWithValue }) => {
    try {
      const response = await fetchCharacters(page, query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar personagens');
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharactersThunk.pending, (state) => {
        if (state.characters.length === 0) {
          state.loading = true;
        } else {
          state.pageLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchCharactersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pageLoading = false;
        state.characters = action.payload.results;
        state.nextPage = action.payload.next;
        state.prevPage = action.payload.previous;
        state.currentPage = action.meta.arg.page;
      })
      .addCase(fetchCharactersThunk.rejected, (state, action) => {
        state.loading = false;
        state.pageLoading = false;
        state.error = action.payload as string || 'Erro ao buscar personagens';
        state.characters = FALLBACK_DATA;
        state.nextPage = null;
        state.prevPage = null;
      });
  },
});

export const { setSearchQuery, clearSearchQuery } = charactersSlice.actions;
export default charactersSlice.reducer;