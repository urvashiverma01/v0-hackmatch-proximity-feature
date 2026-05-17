'use client';

import { useAuth } from '@/contexts/auth-context';
import { AppShell } from '@/components/app-shell';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { DashboardContent } from '@/components/dashboard-content';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  // Show onboarding if not complete
  if (!user.onboardingComplete) {
    return (
      <OnboardingWizard 
        onComplete={() => {
          router.refresh();
        }} 
      />
    );
  }

  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
