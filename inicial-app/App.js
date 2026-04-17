import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';

import Header from './src/components/Header';
import HeroSection from './src/components/HeroSection';
import HeroImage from './src/components/HeroImage';
import PilaresSection from './src/components/PilaresSection';
import ProcesoSection from './src/components/ProcesoSection';
import GestionResponsableSection from './src/components/GestionResponsableSection';
import Footer from './src/components/Footer';
import COLORS from './src/constants/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <HeroSection />
        <HeroImage />
        <PilaresSection />
        <ProcesoSection />
        <GestionResponsableSection />
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
