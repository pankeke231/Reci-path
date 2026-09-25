import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Onboarding, { DoneButtonProps, DotProps, NextButtonProps } from 'react-native-onboarding-swiper';
import { completeOnboarding } from '@/lib/onboardingStorage';

const background = '#081425';
const green = '#54e98a';
const pages = [
  ['Ciudadano', 'account-heart-outline', 'Separa y recicla fácil', 'Entrega tus materiales reciclables a recolectores de tu barrio y aporta al planeta desde casa.'],
  ['Reciclador', 'truck-outline', 'Rutas óptimas y más ingresos', 'Conecta con hogares cercanos, recibe alertas al instante y aprovecha al máximo cada recorrido.'],
  ['Operador Oficial', 'handshake-outline', 'Juntos por una Cali Circular', 'Conectamos ciudadanos, recicladores de base y empresas oficiales de aseo para transformar nuestra ciudad de forma sostenible.'],
] as const;
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function Dot({ selected }: DotProps) {
  return <View style={[styles.dot, selected ? styles.activeDot : styles.inactiveDot]} />;
}

function Action({ label, onPress }: (NextButtonProps | DoneButtonProps) & { label: string }) {
  return <Pressable onPress={onPress} style={styles.action}><Text style={styles.actionText}>{label}</Text><MaterialCommunityIcons name={label === 'Comenzar ahora' ? 'rocket-launch' : 'arrow-right'} size={21} color="#003919" /></Pressable>;
}

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const finish = () => {
    completeOnboarding();
    router.replace('/(auth)/auth');
  };
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.brand}><MaterialCommunityIcons name="recycle" size={20} color={green} /><Text style={styles.brandText}>ReciPath <Text style={styles.brandAccent}>| Cali-circular</Text></Text></View>
        <Pressable onPress={finish}><Text style={styles.skip}>OMITIR</Text></Pressable>
      </View>
      <Onboarding
        pages={pages.map(([role, icon, title, subtitle]) => ({
          backgroundColor: background,
          image: <View style={styles.illustration}><MaterialCommunityIcons name={icon as IconName} size={82} color={green} /></View>,
          title: <View style={styles.titleBlock}><View style={styles.badge}><MaterialCommunityIcons name={icon as IconName} size={15} color={green} /><Text style={styles.badgeText}>ROL: {role.toUpperCase()}</Text></View><Text style={styles.title}>{title}</Text></View>,
          subtitle,
        }))}
        currentPage={page}
        pageIndexCallback={setPage}
        onSkip={finish}
        onDone={finish}
        showSkip={false}
        bottomBarHighlight={false}
        bottomBarColor={background}
        containerStyles={styles.container}
        imageContainerStyles={styles.imageContainer}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        DotComponent={Dot}
        NextButtonComponent={(props) => <Action {...props} label="Siguiente" />}
        DoneButtonComponent={(props) => <Action {...props} label="Comenzar ahora" />}
        nextLabel="Siguiente"
        doneLabel="Comenzar ahora"
      />
      <Text style={styles.counter}>PASO {page + 1} DE {pages.length}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: background },
  header: { height: 64, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#152031' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { color: '#d8e3fb', fontSize: 17, fontWeight: '800' },
  brandAccent: { color: green, fontSize: 11, fontWeight: '500' },
  skip: { color: '#bbcbbb', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  container: { flex: 1, paddingHorizontal: 24 },
  imageContainer: { paddingBottom: 4 },
  illustration: { width: 176, height: 176, borderRadius: 88, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2a3c', borderWidth: 1, borderColor: '#3d4a3e' },
  titleBlock: { alignItems: 'center' },
  badge: { marginBottom: 16, paddingHorizontal: 12, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 12, backgroundColor: '#2a3548', borderWidth: 1, borderColor: '#54e98a4d' },
  badgeText: { color: green, fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#d8e3fb', fontSize: 27, lineHeight: 34, fontWeight: '800', textAlign: 'center' },
  subtitle: { maxWidth: 350, color: '#bbcbbb', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  dot: { height: 6, marginHorizontal: 3, borderRadius: 3 },
  activeDot: { width: 30, backgroundColor: green },
  inactiveDot: { width: 10, backgroundColor: '#2a3548' },
  action: { width: '100%', height: 54, marginRight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: '#2ecc71' },
  actionText: { color: '#003919', fontSize: 15, fontWeight: '800' },
  counter: { position: 'absolute', bottom: 30, left: 0, right: 0, color: '#bbcbbb', textAlign: 'center', fontSize: 11, fontWeight: '600', letterSpacing: 1.2 },
});
