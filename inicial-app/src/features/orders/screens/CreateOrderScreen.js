import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../../../hooks/useOrders';
import { wasteService } from '../../../services/wasteService';
import COLORS from '../../../constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../../ui/theme/spacing';
import { Button, Input, Screen, SectionHeader } from '../../../ui/components';
import { getErrorMessage } from '../../../utils/errors';
import {
  parseCoordinates,
  parsePositiveNumber,
} from '../../../utils/validators';

export default function CreateOrderScreen() {
  const navigation = useNavigation();
  const { createOrder } = useOrders({ autoFetch: false });
  const [wasteTypes, setWasteTypes] = useState([]);
  const [wasteTypeId, setWasteTypeId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('3.4516');
  const [longitude, setLongitude] = useState('-76.5320');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    wasteService.listTypes().then((types) => {
      setWasteTypes(types);
      if (types[0]) setWasteTypeId(types[0].id);
    });
  }, []);

  const handleSubmit = async () => {
    const qty = parsePositiveNumber(quantity);
    const coords = parseCoordinates(latitude, longitude);
    if (!wasteTypeId) {
      Alert.alert('Validación', 'Selecciona un tipo de residuo');
      return;
    }
    if (!qty) {
      Alert.alert('Validación', 'Ingresa una cantidad válida en kg');
      return;
    }
    if (!coords) {
      Alert.alert('Validación', 'Coordenadas inválidas');
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        waste_type_id: wasteTypeId,
        quantity_kg: qty,
        address: address.trim() || null,
        latitude: coords.latitude,
        longitude: coords.longitude,
        notes: notes.trim() || null,
      });
      Alert.alert('Pedido creado', 'Tu solicitud fue registrada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <SectionHeader
        title="Nuevo pedido"
        subtitle="Solicita la recolección de residuos en tu ubicación"
      />

      <Text style={styles.label}>Tipo de residuo</Text>
      <View style={styles.chips}>
        {wasteTypes.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => setWasteTypeId(type.id)}
            style={[
              styles.chip,
              wasteTypeId === type.id && styles.chipActive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                wasteTypeId === type.id && styles.chipTextActive,
              ]}
            >
              {type.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        label="Cantidad (kg)"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="decimal-pad"
        placeholder="Ej: 5.5"
      />
      <Input
        label="Dirección"
        value={address}
        onChangeText={setAddress}
        placeholder="Calle, barrio, referencia"
      />
      <Input
        label="Latitud"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="decimal-pad"
      />
      <Input
        label="Longitud"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="decimal-pad"
      />
      <Input
        label="Notas (opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notes}
        placeholder="Horario preferido, acceso, etc."
      />

      <Button title="Enviar solicitud" onPress={handleSubmit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBg,
  },
  chipActive: {
    borderColor: COLORS.green,
    backgroundColor: `${COLORS.green}18`,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.green,
    fontWeight: '600',
  },
  notes: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
