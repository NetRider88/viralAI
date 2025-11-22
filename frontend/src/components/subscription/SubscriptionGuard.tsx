'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Crown, ArrowRight } from 'lucide-react';

interface SubscriptionGuardProps {
    children: ReactNode;
    requiredTier?: string;
    feature?: keyof import('@/hooks/useSubscription').TierLimits;
    currentUsage?: number;
    fallback?: ReactNode;
    showUpgradeModal?: boolean;
}

export function SubscriptionGuard({
    children,
    requiredTier,
    feature,
    currentUsage,
    fallback,
    showUpgradeModal = true,
}: SubscriptionGuardProps) {
    const router = useRouter();
    const { requiresTierUpgrade, canUseFeature, hasFeatureAccess, currentTier } = useSubscription();

    let hasAccess = true;
    let reason = '';

    // Check tier requirement
    if (requiredTier && requiresTierUpgrade(requiredTier)) {
        hasAccess = false;
        reason = `This feature requires the ${requiredTier} plan or higher`;
    }

    // Check feature access
    if (feature) {
        const featureCheck = canUseFeature(feature, currentUsage);
        if (!featureCheck.allowed) {
            hasAccess = false;
            reason = featureCheck.reason || 'Feature not available';
        }
    }

    if (!hasAccess) {
        if (fallback) {
            return <>{fallback}</>;
        }

        if (showUpgradeModal) {
            return (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg">
                    <Crown className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Upgrade Required</h3>
                    <p className="text-muted-foreground text-center mb-4 max-w-md">
                        {reason}
                    </p>
                    <Button onClick={() => router.push('/pricing')}>
                        View Upgrade Options
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return null;
    }

    return <>{children}</>;
}

// Hook version for programmatic checks
export function useSubscriptionGuard() {
    const router = useRouter();
    const subscription = useSubscription();

    const checkAndRedirect = (
        requiredTier?: string,
        feature?: keyof import('@/hooks/useSubscription').TierLimits,
        currentUsage?: number
    ): boolean => {
        if (requiredTier && subscription.requiresTierUpgrade(requiredTier)) {
            router.push('/pricing');
            return false;
        }

        if (feature) {
            const { allowed } = subscription.canUseFeature(feature, currentUsage);
            if (!allowed) {
                router.push('/pricing');
                return false;
            }
        }

        return true;
    };

    return {
        ...subscription,
        checkAndRedirect,
    };
}
