import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../../constants/colors';
import { RADIUS, SPACING, TYPOGRAPHY } from '../../../ui/theme/spacing';
import { Screen } from '../../../ui/components';
import { adminService } from '../../../services/adminService';
import { getErrorMessage } from '../../../utils/errors';
import {
  isValidCellPhone,
  isValidDocumentId,
  isValidEmail,
  isValidPassword,
} from '../../../utils/validators';

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function RegisterCollectorScreen() {
  const navigation = useNavigation();
  const [documentId, setDocumentId] = useState('');
  const [firstNames, setFirstNames] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!isValidDocumentId(documentId)) {
      Alert.alert('Validación', 'Nº de identidad inválido');
      return;
    }
    if (!firstNames.trim() || !lastNames.trim()) {
      Alert.alert('Validación', 'Nombres y apellidos son obligatorios');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Validación', 'La dirección es obligatoria');
      return;
    }
    if (!isValidCellPhone(phone)) {
      Alert.alert('Validación', 'Celular inválido');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Validación', 'Correo inválido');
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('Validación', 'Contraseña mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await adminService.registerCollector({
        documentId,
        firstNames,
        lastNames,
        address,
        phone,
        email,
        password,
      });
      Alert.alert('Recolector registrado', 'El usuario fue creado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll padded={false}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => setShowPassword((v) => !v)}
          style={styles.iconBtn}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={COLORS.textPrimary}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registrar reciclador</Text>
        <Text style={styles.subtitle}>
          Ingresa los datos para dar de alta a un nuevo recolector en el sistema.
        </Text>

        <Field label="Nº IDENTIDAD">
          <TextInput
            style={styles.input}
            value={documentId}
            onChangeText={setDocumentId}
            keyboardType="number-pad"
            placeholder="1000000000"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="NOMBRES COMPLETOS">
          <TextInput
            style={styles.input}
            value={firstNames}
            onChangeText={setFirstNames}
            placeholder="Juan Carlos"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="APELLIDOS COMPLETOS">
          <TextInput
            style={styles.input}
            value={lastNames}
            onChangeText={setLastNames}
            placeholder="Pérez Rodríguez"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="DIRECCIÓN DE RESIDENCIA">
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle 45 # 12-34, Cali"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="Nº DE CELULAR">
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+57 300 000 0000"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="CORREO ELECTRÓNICO">
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="nombre@eco.com"
            placeholderTextColor={COLORS.textMuted}
          />
        </Field>
        <Field label="CONTRASEÑA">
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </Pressable>
          </View>
        </Field>

        <Pressable onPress={handleRegister} disabled={loading}>
          <LinearGradient
            colors={[COLORS.green, COLORS.greenDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            <Ionicons name="person-add-outline" size={20} color={COLORS.bg} />
            <Text style={styles.submitText}>
              {loading ? 'Registrando…' : 'Registrar'}
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.green,
    fontSize: 28,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  passwordInput: {
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  submitText: {
    ...TYPOGRAPHY.label,
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '700',
  },
});
