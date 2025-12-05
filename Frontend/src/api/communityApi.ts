/**
 * Community API wrapper
 * Handles all community-related API calls
 */

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Community Type enum matching backend
 */
export enum CommunityType {
  GAMING = 'GAMING',
  ART = 'ART',
  MUSIC = 'MUSIC',
  TECHNOLOGY = 'TECHNOLOGY',
  SPORTS = 'SPORTS',
  FINANCE = 'FINANCE',
  LIFESTYLE = 'LIFESTYLE',
  TRAVEL = 'TRAVEL',
  EDUCATION = 'EDUCATION',
  OTHER = 'OTHER',
}

/**
 * Community DTO matching backend structure
 */
export interface CommunityDto {
  id: number;
  name: string;
  description: string;
  bannerUrl: string | null;
  type: CommunityType;
}

/**
 * Extended Community interface for frontend use
 * Includes additional properties needed for UI rendering
 */
export interface Community extends CommunityDto {
  // Additional frontend-only properties can be added here
  // For now, we'll use the DTO as-is and map additional properties in components
}

/**
 * Fetches all communities from the backend
 * @returns Promise resolving to array of CommunityDto
 * @throws Error if the API call fails
 */
export const getAllCommunities = async (): Promise<CommunityDto[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch communities: ${response.status} ${response.statusText}`);
    }

    const data: CommunityDto[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all communities:', error);
    throw error;
  }
};

/**
 * User Profile DTO matching backend structure
 */
export interface UserProfileDto {
  id: number;
  username: string;
  avatarUrl: string | null;
  age: number | null;
  communitiesJoined: CommunityDto[];
  communitiesCreated: CommunityDto[];
  posts: any[]; // PostDto[] - not needed for this module
}

/**
 * Fetches communities for a specific user
 * @param userId - The ID of the user
 * @returns Promise resolving to array of CommunityDto
 * @throws Error if the API call fails
 */
export const getUserCommunities = async (userId: number): Promise<CommunityDto[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user communities: ${response.status} ${response.statusText}`);
    }

    const userProfile: UserProfileDto = await response.json();
    return userProfile.communitiesJoined || [];
  } catch (error) {
    console.error('Error fetching user communities:', error);
    throw error;
  }
};

/**
 * Create Community Request DTO
 */
export interface CreateCommunityRequest {
  name: string;
  description: string;
  bannerUrl: string | null;
  type: CommunityType;
}

/**
 * Creates a new community
 * @param data - Community creation data
 * @param creatorUserId - The ID of the user creating the community
 * @returns Promise resolving to CommunityDto
 * @throws Error if the API call fails
 */
export const createCommunity = async (
  data: CreateCommunityRequest,
  creatorUserId: number
): Promise<CommunityDto> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communities?creatorUserId=${creatorUserId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create community: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const communityData: CommunityDto = await response.json();
    return communityData;
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
};

/**
 * Fetches a community by ID
 * @param id - The ID of the community
 * @returns Promise resolving to CommunityDto
 * @throws Error if the API call fails
 */
export const getCommunityById = async (id: number): Promise<CommunityDto> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communities/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch community: ${response.status} ${response.statusText}`);
    }

    const data: CommunityDto = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching community:', error);
    throw error;
  }
};

