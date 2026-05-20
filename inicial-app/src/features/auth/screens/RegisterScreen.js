import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../../hooks/useAuth';
import { REGISTERABLE_ROLES, ROLE_LABELS, ROLES } from '../../../constants/roles';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../../ui/theme/spacing';
import { Button, Input, Screen } from '../../../ui/components';
import { getErrorMessage } from '../../../utils/errors';
import {
  isValidCellPhone,
  isValidDocumentId,
  isValidEmail,
  isValidPassword,
} from '../../../utils/validators';

export default function RegisterScreen({ navigation }) {
  const { signUp, loading } = useAuth();
  const [documentId, setDocumentId] = useState('');
  const [firstNames, setFirstNames] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.CITIZEN);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!isValidDocumentId(documentId)) {
      next.documentId = 'Ingresa un Nº de identidad válido (6–12 dígitos)';
    }
    if (!firstNames.trim()) next.firstNames = 'Los nombres son obligatorios';
    if (!lastNames.trim()) next.lastNames = 'Los apellidos son obligatorios';
    if (!address.trim()) next.address = 'La dirección de residencia es obligatoria';
    if (!isValidCellPhone(phone)) {
      next.phone = 'Ingresa un celular válido (mín. 10 dígitos)';
    }
    if (!isValidEmail(email)) next.email = 'Correo electrónico inválido';
    if (!isValidPassword(password)) {
      next.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      await signUp({
        documentId,
        firstNames,
        lastNames,
        address,
        phone,
        email,
        password,
        role,
      });
      Alert.alert(
        'Cuenta creada',
        'Revisa tu correo si se requiere confirmación en Supabase.',
      );
    } catch (error) {
      Alert.alert('Error al registrarse', getErrorMessage(error));
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>
        Completa tus datos para unirte a la red colaborativa S.E.A
      </Text>

      <Input
        label="Nº de identidad"
        value={documentId}
        onChangeText={setDocumentId}
        keyboardType="number-pad"
        error={errors.documentId}
        placeholder="Ej: 1234567890"
      />
      <Input
        label="Nombres completos"
        value={firstNames}
        onChangeText={setFirstNames}
        autoCapitalize="words"
        error={errors.firstNames}
        placeholder="Ej: María Fernanda"
      />
      <Input
        label="Apellidos completos"
        value={lastNames}
        onChangeText={setLastNames}
        autoCapitalize="words"
        error={errors.lastNames}
        placeholder="Ej: López García"
      />
      <Input
        label="Dirección de residencia"
        value={address}
        onChangeText={setAddress}
        error={errors.address}
        placeholder="Calle, barrio, ciudad"
      />
      <Input
        label="Número de celular"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        error={errors.phone}
        placeholder="+57 300 000 0000"
      />
      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={errors.email}
        placeholder="tu@correo.com"
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
        placeholder="Mínimo 6 caracteres"
      />

      <Text style={styles.roleLabel}>Tipo de cuenta</Text>
      <View style={styles.roleRow}>
        {REGISTERABLE_ROLES.map((r) => (
          <Pressable
            key={r}
            onPress={() => setRole(r)}
            style={[styles.roleChip, role === r && styles.roleChipActive]}
          >
            <Text
              style={[styles.roleText, role === r && styles.roleTextActive]}
            >
              {ROLE_LABELS[r]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button title="Registrarme" onPress={handleRegister} loading={loading} />
      <Button
        title="Ya tengo cuenta"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  roleLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  roleChip: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
  },
  roleChipActive: {
    borderColor: COLORS.green,
    backgroundColor: `${COLORS.green}18`,
  },
  roleText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  roleTextActive: {
    color: COLORS.green,
  },
  backBtn: {
    marginTop: SPACING.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
