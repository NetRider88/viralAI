import { useAuthStore } from '@/store/authStore';

export interface TierLimits {
    contentGenerations: number;
    imageGenerations: number;
    trackedLinks: number;
    teamMembers: number;
    apiAccess: boolean;
    whiteLabel: boolean;
}

const tierLimits: Record<string, TierLimits> = {
    free: {
        contentGenerations: 10,
        imageGenerations: 5,
        trackedLinks: 3,
        teamMembers: 1,
        apiAccess: false,
        whiteLabel: false,
    },
    creator: {
        contentGenerations: 150,
        imageGenerations: 50,
        trackedLinks: 50,
        teamMembers: 1,
        apiAccess: false,
        whiteLabel: false,
    },
    pro: {
        contentGenerations: 750,
        imageGenerations: 200,
        trackedLinks: 300,
        teamMembers: 3,
        apiAccess: true,
        whiteLabel: false,
    },
    business: {
        contentGenerations: 2500,
        imageGenerations: 600,
        trackedLinks: -1, // unlimited
        teamMembers: 10,
        apiAccess: true,
        whiteLabel: true,
    },
    agency: {
        contentGenerations: 2500,
        imageGenerations: 600,
        trackedLinks: -1, // unlimited
        teamMembers: 10,
        apiAccess: true,
        whiteLabel: true,
    },
};

export function useSubscription() {
    const { user, isAuthenticated } = useAuthStore();

    const currentTier = user?.subscription_tier?.toLowerCase() || 'free';
    const limits = tierLimits[currentTier] || tierLimits.free;

    const getTierLevel = (tier: string): number => {
        const levels: Record<string, number> = {
            free: 0,
            creator: 1,
            pro: 2,
            business: 3,
            agency: 3,
        };
        return levels[tier.toLowerCase()] || 0;
    };

    const hasFeatureAccess = (feature: keyof TierLimits): boolean => {
        if (!isAuthenticated) return false;
        const value = limits[feature];
        if (typeof value === 'boolean') return value;
        return value > 0 || value === -1; // -1 means unlimited
    };

    const canUseFeature = (
        feature: keyof TierLimits,
        currentUsage?: number
    ): { allowed: boolean; reason?: string } => {
        if (!isAuthenticated) {
            return { allowed: false, reason: 'Please log in to use this feature' };
        }

        const limit = limits[feature];

        if (typeof limit === 'boolean') {
            return limit
                ? { allowed: true }
                : { allowed: false, reason: `This feature requires a higher tier plan` };
        }

        if (limit === -1) {
            return { allowed: true }; // unlimited
        }

        if (currentUsage !== undefined && currentUsage >= limit) {
            return {
                allowed: false,
                reason: `You've reached your ${feature} limit (${limit}). Upgrade to continue.`,
            };
        }

        return { allowed: true };
    };

    const requiresTierUpgrade = (requiredTier: string): boolean => {
        const currentLevel = getTierLevel(currentTier);
        const requiredLevel = getTierLevel(requiredTier);
        return currentLevel < requiredLevel;
    };

    return {
        currentTier,
        limits,
        hasFeatureAccess,
        canUseFeature,
        requiresTierUpgrade,
        getTierLevel,
        isAuthenticated,
    };
}
