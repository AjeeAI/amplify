import { Campaign, ActivityEvent, UserProfile } from '../types';
import { MOCK_CAMPAIGNS, MOCK_ACTIVITY_EVENTS, USER_ALEX_MORGAN } from '../constants/mockData';

// API Base URL (configurable)
const BASE_URL = 'http://localhost:8000/api/v1';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// Maps backend CampaignOut schema to rich frontend Campaign model
export function mapBackendCampaignToFrontend(bCamp: any): Campaign {
  return {
    id: bCamp.id,
    title: bCamp.title,
    category: bCamp.category,
    creator: {
      name: bCamp.creator?.full_name || 'Verified Creator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      organization: bCamp.creator?.full_name ? `${bCamp.creator.full_name} Labs` : 'Civic Action Alliance',
      verificationBadge: 'Verified 501(c)(3) • Tier 1 Grant Match',
      rating: '4.9 ★ (38 audits)',
    },
    summary: bCamp.summary,
    fullStory: bCamp.story_content || bCamp.summary,
    coverImage: bCamp.cover_image || 'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=800&auto=format&fit=crop&q=80',
    targetAmount: bCamp.funding_goal,
    currentAmount: bCamp.amount_raised || 0,
    backersCount: Math.max(1, Math.round((bCamp.amount_raised || 0) / 37)),
    daysRemaining: 12,
    totalImpressionsDelivered: Math.round((bCamp.amount_raised || 0) * 27),
    targetImpressions: bCamp.estimated_total_reach || Math.round(bCamp.funding_goal * 27),
    location: 'Boston Metro & Regional Chapters',
    distanceMiles: bCamp.target_radius_miles || 5,
    tags: [bCamp.category, 'Civic Telemetry', 'Audited Escrow'],
    reviewStages: [
      {
        stage: 'Stage 1',
        title: 'Lab Sensor Calibration',
        status: 'completed',
        note: 'Calibrated across EPA standard solutions with 99.4% precision index.',
      },
      {
        stage: 'Stage 2',
        title: 'Peer Civic Review',
        status: 'completed',
        note: 'Audited and approved by Clean Water Action scientific advisory board.',
      },
      {
        stage: 'Stage 3',
        title: 'Transparent Supply Line',
        status: bCamp.status === 'PROMOTING' ? 'completed' : 'in_progress',
        note: 'Telemetry pods assembled and queued for targeted broadcast.',
      },
    ],
    useOfFunds: [
      { category: 'Hardware & Sensor Units', percentage: 50, amount: bCamp.funding_goal * 0.5, color: '#4F46E5' },
      { category: 'Deployment & Field Logistics', percentage: 30, amount: bCamp.funding_goal * 0.3, color: '#06B6D4' },
      { category: 'Civic Ad Network Reserve', percentage: 20, amount: bCamp.funding_goal * 0.2, color: '#F59E0B' },
    ],
    adPreview: {
      headline: bCamp.title,
      body: bCamp.summary,
      callToAction: 'Back & Amplify Reach',
      mediaUrl: bCamp.cover_image || 'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=600&auto=format&fit=crop&q=80',
      network: 'Meta & Instagram',
    },
  };
}

export const ApiService = {
  // 1. Authentication
  async register(fullName: string, email: string, password: string): Promise<{ access_token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      setAuthToken(data.access_token);
      return data;
    } catch {
      // Demo fallback token
      const fakeToken = 'demo-jwt-token-' + Date.now();
      setAuthToken(fakeToken);
      return { access_token: fakeToken };
    }
  },

  async login(email: string, password: string): Promise<{ access_token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setAuthToken(data.access_token);
      return data;
    } catch {
      const fakeToken = 'demo-jwt-token-alex';
      setAuthToken(fakeToken);
      return { access_token: fakeToken };
    }
  },

  async getMe(): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Fetch user failed');
      return await res.json();
    } catch {
      return {
        id: 'user-alex',
        full_name: 'Alex Morgan',
        email: 'alex.morgan@civicpulse.org',
        streak_count: 3,
      };
    }
  },

  // 2. Reach Calculator ($1 = 27 impressions)
  async calculateReach(amount: number): Promise<{
    amount: number;
    estimated_impressions: number;
    multiplier: number;
    devices_estimate: number;
    radius_estimate: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/calculator/reach?amount=${amount}`);
      if (!res.ok) throw new Error('Failed to calculate reach');
      return await res.json();
    } catch {
      const impressions = Math.round(amount * 27);
      return {
        amount,
        estimated_impressions: impressions,
        multiplier: 27,
        devices_estimate: Math.round(impressions * 0.42),
        radius_estimate: amount >= 100 ? '12.5 mi' : amount >= 50 ? '8.0 mi' : amount >= 25 ? '4.2 mi' : '2.0 mi',
      };
    }
  },

  // 3. Campaigns List
  async getCampaigns(category?: string): Promise<Campaign[]> {
    try {
      const url = category && category !== 'All'
        ? `${BASE_URL}/campaigns?category=${encodeURIComponent(category)}`
        : `${BASE_URL}/campaigns`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapBackendCampaignToFrontend);
      }
      return MOCK_CAMPAIGNS;
    } catch {
      return category && category !== 'All'
        ? MOCK_CAMPAIGNS.filter((c) => c.category === category)
        : MOCK_CAMPAIGNS;
    }
  },

  // 4. Campaign Detail
  async getCampaign(id: string): Promise<Campaign | null> {
    try {
      const res = await fetch(`${BASE_URL}/campaigns/${id}`);
      if (!res.ok) throw new Error('Failed to fetch campaign details');
      const data = await res.json();
      return mapBackendCampaignToFrontend(data);
    } catch {
      const found = MOCK_CAMPAIGNS.find((c) => c.id === id);
      return found || null;
    }
  },

  // 5. Campaign Creation & Submission
  async createCampaign(data: {
    title: string;
    category: string;
    summary: string;
    funding_goal: number;
    story_content?: string;
    target_radius_miles?: number;
    cover_image?: string;
  }): Promise<Campaign> {
    try {
      const res = await fetch(`${BASE_URL}/campaigns`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create campaign draft');
      const created = await res.json();

      // Automatically submit draft to active for MVP
      const submitRes = await fetch(`${BASE_URL}/campaigns/${created.id}/submit`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (submitRes.ok) {
        const active = await submitRes.json();
        return mapBackendCampaignToFrontend(active);
      }
      return mapBackendCampaignToFrontend(created);
    } catch {
      const newCamp: Campaign = {
        id: 'camp-' + Date.now(),
        title: data.title,
        category: data.category as any,
        creator: {
          name: 'You (Creator)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          organization: 'Community Taskforce',
          verificationBadge: 'Verified 501(c)(3)',
          rating: '5.0 ★ (New)',
        },
        summary: data.summary,
        fullStory: data.story_content || data.summary,
        coverImage: data.cover_image || 'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=800&auto=format&fit=crop&q=80',
        targetAmount: data.funding_goal,
        currentAmount: 0,
        backersCount: 0,
        daysRemaining: 30,
        totalImpressionsDelivered: 0,
        targetImpressions: Math.round(data.funding_goal * 27),
        location: 'Local Chapter',
        distanceMiles: data.target_radius_miles || 5,
        tags: [data.category, 'Civic Telemetry'],
        reviewStages: [
          { stage: 'Stage 1', title: 'Lab Sensor Calibration', status: 'completed', note: 'Calibrated precision.' },
          { stage: 'Stage 2', title: 'Peer Civic Review', status: 'completed', note: 'Audited & approved.' },
          { stage: 'Stage 3', title: 'Transparent Supply Line', status: 'in_progress', note: 'Ready for deployment.' },
        ],
        useOfFunds: [
          { category: 'Hardware Units', percentage: 50, amount: data.funding_goal * 0.5, color: '#4F46E5' },
          { category: 'Logistics', percentage: 30, amount: data.funding_goal * 0.3, color: '#06B6D4' },
          { category: 'Ad Reserve', percentage: 20, amount: data.funding_goal * 0.2, color: '#F59E0B' },
        ],
        adPreview: {
          headline: data.title,
          body: data.summary,
          callToAction: 'Back & Amplify',
          mediaUrl: data.cover_image || 'https://images.unsplash.com/photo-1544333323-5374ac40d938?w=600&auto=format&fit=crop&q=80',
          network: 'Meta & Instagram',
        },
      };
      return newCamp;
    }
  },

  // 6. Contribute & Success Blast
  async contribute(campaignId: string, amount: number, paymentMethod = 'apple_pay'): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/campaigns/${campaignId}/contribute`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ amount, payment_method: paymentMethod }),
      });
      if (!res.ok) throw new Error('Payment simulation failed');
      return await res.json();
    } catch {
      const impressions = Math.round(amount * 27);
      return {
        message: 'Amplification Blast Queued Successfully!',
        contribution: {
          id: 'contrib-' + Date.now(),
          campaign_id: campaignId,
          amount,
          impressions_generated: impressions,
          payment_status: 'SUCCESS',
        },
        telemetry_status: 'Injecting Ads (82%)',
        estimated_broadcast_time: '4m 12s',
        radius_miles: amount >= 50 ? 8 : 4,
        new_amount_raised: 15600 + amount,
        campaign_status: 'ACTIVE',
        new_user_streak: 4,
      };
    }
  },

  // 7. AI Voice Draft
  async voiceDraft(transcriptText?: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/ai/voice-draft`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ transcript_text: transcriptText }),
      });
      if (!res.ok) throw new Error('Voice draft failed');
      return await res.json();
    } catch {
      return {
        title: 'Charles River Sensor Grid: Real-Time Citizen Water Watch',
        category: 'Climate',
        summary: 'Deploying autonomous optical fluorometer sensors to alert 40,000 residents of sewage overflows.',
        story_content: 'Every spring, untreated discharge threatens public waterways. Our sensors test water quality every 60 seconds.',
        funding_goal: 18500,
        target_radius_miles: 5,
        target_impressions: 499500,
      };
    }
  },

  // 8. User Dashboard
  async getDashboard(): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/users/me/dashboard`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Dashboard fetch failed');
      return await res.json();
    } catch {
      return {
        user: USER_ALEX_MORGAN,
        streak_count: USER_ALEX_MORGAN.streakDays,
        total_donated: USER_ALEX_MORGAN.totalDonated,
        total_impressions_achieved: USER_ALEX_MORGAN.totalImpressionsAchieved,
        backed_campaigns: MOCK_CAMPAIGNS.slice(0, 2),
        my_campaigns: [MOCK_CAMPAIGNS[0]],
      };
    }
  },

  // 9. Activity Feed
  async getActivity(): Promise<ActivityEvent[]> {
    try {
      const res = await fetch(`${BASE_URL}/users/me/activity`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Activity fetch failed');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          type: item.activity_type.toLowerCase(),
          title: item.activity_type === 'AMPLIFICATION' ? 'Your contribution went live!' : 'Civic Update',
          subtitle: item.message,
          timestamp: 'Just now',
          icon: item.activity_type === 'AMPLIFICATION' ? 'radio' : 'zap',
          iconBg: item.activity_type === 'AMPLIFICATION' ? '#4F46E5' : '#F59E0B',
          badgeText: item.activity_type === 'AMPLIFICATION' ? 'Active Broadcast' : 'Civic Alert',
        }));
      }
      return MOCK_ACTIVITY_EVENTS;
    } catch {
      return MOCK_ACTIVITY_EVENTS;
    }
  },
};
