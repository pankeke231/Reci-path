import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const { width } = Dimensions.get('window');

export default function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerLogoRow}>
        <Ionicons name="leaf" size={16} color={COLORS.green} />
        <Text style={styles.footerLogoText}>S.E.A</Text>
      </View>

      <Image
        source={require('../../assets/phone_mockups.png')}
        style={styles.footerPhoneImage}
        resizeMode="contain"
      />

      <Text style={styles.footerTagline}>
        Gestión Responsable en tus manos. Conectando comunidades por un futuro
        más limpio.
      </Text>

      <View style={styles.footerDivider} />

      <Text style={styles.footerCopyright}>
        © 2026 S.E.A. Todos los derechos reservados.
      </Text>

      <View style={styles.footerLinks}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Términos</Text>
        </TouchableOpacity>
        <Text style={styles.footerLinkSep}>·</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacidad</Text>
        </TouchableOpacity>
        <Text style={styles.footerLinkSep}>·</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Contacto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  footerLogoText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerPhoneImage: {
    width: width - 48,
    height: 260,
    borderRadius: 16,
    marginBottom: 24,
  },
  footerTagline: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  footerCopyright: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footerLinkSep: {
    color: COLORS.textMuted,
    marginHorizontal: 8,
    fontSize: 12,
  },
});
