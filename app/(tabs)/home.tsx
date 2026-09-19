import { useAuth } from '@/hooks/useAuth';
import AdminNavigator from '@/navigation/AdminNavigator';
import CitizenNavigator from '@/navigation/CitizenNavigator';
import CollectorNavigator from '@/navigation/CollectorNavigator';

export default function RoleRoute() {
  const { profile } = useAuth();
  if (profile?.role === 'admin') return <AdminNavigator />;
  if (profile?.role === 'collector') return <CollectorNavigator />;
  return <CitizenNavigator />;
}
