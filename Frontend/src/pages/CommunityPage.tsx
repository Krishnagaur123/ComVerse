import { useState, useEffect } from 'react';
import { UserSpaceBackground } from '../components/UserSpaceBackground';
import { CommunitySidebar } from '../components/CommunitySidebar';
import { StackedRoomCards } from '../components/StackedRoomCards';
import { CommunityDetail } from './CommunityDetail';
import { RoomPage } from './RoomPage';
import { GeneralChat } from './GeneralChat';
import { AnnouncementChat } from './AnnouncementChat';
import { DMChat } from './DMChat';
import { VoiceCallRoom } from './VoiceCallRoom';
import { MemesPostsPage } from './MemesPostsPage';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { getCommunityById } from '../api/communityApi';
import { getCommunityRooms, RoomDto, RoomType } from '../api/roomApi';
import { useAuth } from '../contexts/AuthContext';
import { CommunityType } from '../api/communityApi';

interface CommunityPageProps {
  communityId: number;
  userRole?: 'Owner' | 'Admin' | 'Member';
  onBack: () => void;
  onGoToHome?: () => void;
  onGoToUserSpace?: () => void;
}

// Helper to map CommunityType to category string
const mapTypeToCategory = (type: CommunityType): string => {
  const typeMap: Record<CommunityType, string> = {
    [CommunityType.GAMING]: 'Gaming',
    [CommunityType.ART]: 'Art & Design',
    [CommunityType.MUSIC]: 'Music',
    [CommunityType.TECHNOLOGY]: 'Technology',
    [CommunityType.SPORTS]: 'Sports',
    [CommunityType.FINANCE]: 'Finance',
    [CommunityType.LIFESTYLE]: 'Lifestyle',
    [CommunityType.TRAVEL]: 'Travel',
    [CommunityType.EDUCATION]: 'Education',
    [CommunityType.OTHER]: 'Other',
  };
  return typeMap[type] || 'Other';
};

// Helper to map RoomType to frontend room type
const mapRoomTypeToFrontend = (type: RoomType): 'voice' | 'memes' | 'general' | 'announcements' => {
  switch (type) {
    case RoomType.VOICE_CHAT:
      return 'voice';
    case RoomType.POSTS:
      return 'memes';
    case RoomType.CHAT:
      return 'general';
    default:
      return 'general';
  }
};

export function CommunityPage({ communityId, userRole = 'Member', onBack, onGoToHome, onGoToUserSpace }: CommunityPageProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'main' | 'manage' | 'room' | 'generalChat' | 'announcementChat' | 'dmChat' | 'voiceCall' | 'memesPosts'>('main');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [dmTarget, setDmTarget] = useState<{ name: string; avatar: string; role: 'Owner' | 'Admin' | 'Member' } | null>(null);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  // State for fetched data
  const [community, setCommunity] = useState<{
    id: number;
    name: string;
    description: string;
    bannerUrl: string | null;
    type: CommunityType;
  } | null>(null);
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch community and rooms on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [communityData, roomsData] = await Promise.all([
          getCommunityById(communityId),
          getCommunityRooms(communityId),
        ]);

        setCommunity(communityData);
        setRooms(roomsData);
      } catch (err) {
        console.error('Failed to fetch community data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load community');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [communityId]);

  // Refresh rooms after creation
  const handleRoomCreated = async () => {
    try {
      const roomsData = await getCommunityRooms(communityId);
      setRooms(roomsData);
    } catch (err) {
      console.error('Failed to refresh rooms:', err);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'manage' && userRole === 'Owner') {
      setCurrentPage('manage');
    } else if (page === 'home') {
      setCurrentPage('main');
    }
  };

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room);
    
    // Route to appropriate page based on room type
    const frontendType = room.frontendType || mapRoomTypeToFrontend(room.type);
    if (frontendType === 'general') {
      setCurrentPage('generalChat');
    } else if (frontendType === 'announcements') {
      setCurrentPage('announcementChat');
    } else if (frontendType === 'voice') {
      setCurrentPage('voiceCall');
    } else if (frontendType === 'memes') {
      setCurrentPage('memesPosts');
    } else {
      setCurrentPage('room');
    }
  };

  const handleOpenDM = (username: string, avatar: string) => {
    setDmTarget({
      name: username,
      avatar: avatar,
      role: 'Member',
    });
    setCurrentPage('dmChat');
  };

  const handleBackToMain = () => {
    setCurrentPage('main');
    setSelectedRoom(null);
    setDmTarget(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <UserSpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#28f5cc] mb-4"></div>
            <p className="text-[#747c88]">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !community) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <UserSpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-4">
            <p className="text-red-400 mb-2">Failed to load community</p>
            <p className="text-[#747c88] text-sm">{error || 'Community not found'}</p>
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 rounded-lg bg-[#28f5cc] text-black hover:bg-[#04ad7b] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = user ? {
    name: user.username,
    avatar: user.avatar,
  } : {
    name: 'Guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
  };

  // Render Community Detail (Owner Dashboard)
  if (currentPage === 'manage' && userRole === 'Owner') {
    return (
      <CommunityDetail
        community={{
          name: community.name,
          category: mapTypeToCategory(community.type),
          members: 0, // TODO: Get from backend when available
          description: community.description,
          color: '#28f5cc',
          avatar: community.bannerUrl || undefined,
        }}
        onBack={() => setCurrentPage('main')}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
      />
    );
  }

  // Render General Chat
  if (currentPage === 'generalChat' && selectedRoom) {
    return (
      <GeneralChat
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        roomName={selectedRoom.name}
        userRole={userRole}
        currentUser={currentUser}
        onBack={handleBackToMain}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
        onOpenDM={handleOpenDM}
      />
    );
  }

  // Render Announcement Chat
  if (currentPage === 'announcementChat' && selectedRoom) {
    return (
      <AnnouncementChat
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        roomName={selectedRoom.name}
        userRole={userRole}
        currentUser={currentUser}
        onBack={handleBackToMain}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
        onOpenDM={handleOpenDM}
      />
    );
  }

  // Render DM Chat
  if (currentPage === 'dmChat' && dmTarget) {
    return (
      <DMChat
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        targetUser={dmTarget}
        userRole={userRole}
        currentUser={currentUser}
        onBack={handleBackToMain}
        onClose={handleBackToMain}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
      />
    );
  }

  // Render Voice Call Room
  if (currentPage === 'voiceCall' && selectedRoom) {
    return (
      <VoiceCallRoom
        roomName={selectedRoom.name}
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        userRole={userRole}
        onBack={() => {
          setCurrentPage('main');
          setSelectedRoom(null);
        }}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
      />
    );
  }

  // Render Memes/Posts Page
  if (currentPage === 'memesPosts' && selectedRoom) {
    return (
      <MemesPostsPage
        roomName={selectedRoom.name}
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        userRole={userRole}
        onBack={handleBackToMain}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
      />
    );
  }

  // Render Room Page (for other types)
  if (currentPage === 'room' && selectedRoom) {
    return (
      <RoomPage
        room={selectedRoom}
        communityName={community.name}
        onBack={() => {
          setCurrentPage('main');
          setSelectedRoom(null);
        }}
      />
    );
  }

  // Map rooms to frontend format for StackedRoomCards
  const mappedRooms = rooms.map(room => ({
    id: room.id.toString(),
    name: room.name,
    description: room.config || '',
    activeUsers: 0, // TODO: Get from backend when available
    type: mapRoomTypeToFrontend(room.type),
    frontendType: mapRoomTypeToFrontend(room.type),
    ...room, // Include original room data
  }));

  // Main Community Page
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <UserSpaceBackground />

      {/* Sidebar */}
      <CommunitySidebar
        communityName={community.name}
        communityAvatar={community.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'}
        userRole={userRole}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLeave={onBack}
        onGoToHome={onGoToHome}
        onGoToUserSpace={onGoToUserSpace}
      />

      {/* Main Content Area */}
      <div className="relative ml-16 lg:ml-20 min-h-screen">
        {/* Community Overview Section - Compact Design */}
        <div
          className="relative h-20 w-full flex items-center justify-center"
          style={{
            background: 'rgba(4, 55, 47, 0.25)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(40, 245, 204, 0.2)',
          }}
        >
          {/* Centered Community Info */}
          <div className="flex items-center gap-6">
            {/* Community Name & Stats */}
            <div className="flex flex-col items-start">
              <h2 className="text-white text-center mb-2">{community.name}</h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full bg-[#28f5cc]" 
                    style={{ boxShadow: '0 0 8px rgba(40, 245, 204, 0.6)' }}
                  />
                  <span className="text-[#747c88]" style={{ fontSize: '0.675rem' }}>
                    {mapTypeToCategory(community.type)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stacked Room Cards - Expanded Space */}
        <div className="relative" style={{ height: 'calc(100vh - 5rem)' }}>
          <StackedRoomCards 
            onRoomSelect={handleRoomSelect}
            rooms={mappedRooms}
            onCreateRoom={() => setIsCreateRoomModalOpen(true)}
            canCreateRoom={userRole === 'Owner' || userRole === 'Admin'}
          />
        </div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onCreateRoom={async () => {
          await handleRoomCreated();
        }}
        communityId={communityId}
      />
    </div>
  );
}
