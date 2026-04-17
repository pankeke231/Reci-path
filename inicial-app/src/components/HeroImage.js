import { StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';

export default function HeroImage() {
  return (
    <View style={styles.heroImageWrapper}>
      <Image
        source={require('../../assets/hero_cityscape.png')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', COLORS.bg]}
        style={styles.heroImageOverlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroImageWrapper: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
    marginBottom: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});
