
import { Movie, TVShow, PaginatedResponse, Credits, Person } from '@/types';

// IMPORTANT: Replace this with your own TMDb API key
const API_KEY = "b95973a8437d1ec3b1b0bf6a07760d6a";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

const apiFetch = async <T>(endpoint: string): Promise<T> => {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${BASE_URL}/${endpoint}${separator}api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }
    return response.json();
};

export const getTrending = async (mediaType: 'movie' | 'tv' = 'movie'): Promise<PaginatedResponse<Movie | TVShow>> => {
    return apiFetch<PaginatedResponse<Movie | TVShow>>(`trending/${mediaType}/week`);
};

export const getPopular = async (mediaType: 'movie' | 'tv'): Promise<PaginatedResponse<Movie | TVShow>> => {
    return apiFetch<PaginatedResponse<Movie | TVShow>>(`${mediaType}/popular`);
};

export const getTopRated = async (mediaType: 'movie' | 'tv'): Promise<PaginatedResponse<Movie | TVShow>> => {
    return apiFetch<PaginatedResponse<Movie | TVShow>>(`${mediaType}/top_rated`);
};

export const getMediaDetails = async (mediaType: 'movie' | 'tv', id: string): Promise<Movie | TVShow> => {
    return apiFetch<Movie | TVShow>(`${mediaType}/${id}`);
};

export const getMediaCredits = async (mediaType: 'movie' | 'tv', id: string): Promise<Credits> => {
    return apiFetch<Credits>(`${mediaType}/${id}/credits`);
};

export const getRecommendations = async (mediaType: 'movie' | 'tv', id: string): Promise<PaginatedResponse<Movie | TVShow>> => {
    return apiFetch<PaginatedResponse<Movie | TVShow>>(`${mediaType}/${id}/recommendations`);
};

export const searchMulti = async (query: string): Promise<PaginatedResponse<Movie | TVShow | Person>> => {
    return apiFetch<PaginatedResponse<Movie | TVShow | Person>>(`search/multi?query=${encodeURIComponent(query)}`);
};
