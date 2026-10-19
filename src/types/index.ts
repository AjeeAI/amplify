export type CategoryType = 'All' | 'Climate' | 'Tech & Society' | 'Education' | 'Civic Tech' | 'Clean Energy';

export interface Campaign {
  id: string;
  title: string;
  category: CategoryType;
  creator: {
    name: string;
    avatar: string;
    organization: string;
    verificationBadge: string; // e.g. 'Verified 501(c)(3)' | 'Tier 1 Grant Match'
    rating: string;
  };
  summary: string;
  fullStory: string;
  coverImage: string;
  targetAmount: number;
  currentAmount: number;
  backersCount: number;
  daysRemaining: number;
  totalImpressionsDelivered: number;
  targetImpressions: number;
  location: string;
  distanceMiles: number;
  tags: string[];
  reviewStages: {
    stage: string;
    title: string;
    status: 'completed' | 'in_progress' | 'pending';
    note: string;
  }[];
  useOfFunds: {
    category: string;
    percentage: number;
    amount: number;
    color: string;
  }[];
  adPreview: {
    headline: string;
    body: string;
    callToAction: string;
    mediaUrl: string;
    network: 'Meta & Instagram' | 'Digital Billboards' | 'Local Groups';
  };
}

export interface ActivityEvent {
  id: string;
  type: 'amplification' | 'match_bonus' | 'field_update' | 'streak_badge';
  title: string;
  subtitle: string;
  timestamp: string;
  avatar?: string;
  campaignTitle?: string;
  reachCount?: number;
  matchMultiplier?: string;
  icon: string;
  iconBg: string;
  badgeText?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  handle: string;
  avatar: string;
  role: 'Alex Morgan' | 'Maya Lin';
  roleTitle: string;
  location: string;
  bio: string;
  streakDays: number;
  totalDonated: number;
  totalImpressionsAchieved: number;
  campaignsAmplifiedCount: number;
  activeRipplesCount: number;
  badges: {
    name: string;
    icon: string;
    description: string;
  }[];
}

export interface CampaignDraft {
  title: string;
  category: CategoryType;
  targetAmount: number;
  summary: string;
  story: string;
  location: string;
  radiusMiles: number;
  affinityTags: string[];
  selectedNetworks: string[];
  coverImageUrl: string;
}
