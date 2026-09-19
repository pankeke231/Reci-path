import { useAuth } from '@/hooks/useAuth';
import {
  AdminActivityNavigator,
  CitizenActivityNavigator,
  CollectorActivityNavigator,
} from '@/navigation/ActivityNavigators';

export default function ActivityTab() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminActivityNavigator />;
  }

  if (profile?.role === 'collector') {
    return <CollectorActivityNavigator />;
  }

  return <CitizenActivityNavigator />;
}
