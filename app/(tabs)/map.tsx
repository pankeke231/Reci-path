import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

const CALI_REGION: Region = {
  latitude: 3.4516,
  longitude: -76.532,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type LocationStatus = "loading" | "granted" | "denied" | "error";

type NearbyVehicle = {
  vehiculo_id?: number | string;
  id?: number | string;
  placa_camion?: string | null;
  placa?: string | null;
  latitud?: number | string | null;
  latitude?: number | string | null;
  longitud?: number | string | null;
  longitude?: number | string | null;
  long?: number | string | null;
  distancia_metros?: number | string | null;
  distancia_meters?: number | string | null;
  distancia?: number | string | null;
};

type PendingOrder = {
  id: string;
  latitud: number | string | null;
  longitud: number | string | null;
  direccion?: string | null;
  address?: string | null;
};

function parseCoordinate(
  value: unknown,
): number | null {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    value === ""
  ) {
    return null;
  }

  const coordinate = Number.parseFloat(String(value));
  return Number.isFinite(coordinate) ? coordinate : null;
}

function getVehicleDistance(vehicle: NearbyVehicle): number {
  const distance = parseCoordinate(
    vehicle.distancia_metros ??
      vehicle.distancia_meters ??
      vehicle.distancia,
  );
  return distance !== null && distance >= 0 ? Math.round(distance) : 0;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [vehicles, setVehicles] = useState<NearbyVehicle[]>([]);
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState(false);
  const [ordersError, setOrdersError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const getCurrentLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!isActive) return;

        if (permission.status !== "granted") {
          setStatus("denied");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!isActive) return;

        setLocation(currentLocation.coords);
        setStatus("granted");
      } catch (error) {
        console.error("No se pudo obtener la ubicación actual:", error);
        if (isActive) setStatus("error");
      }
    };

    void getCurrentLocation();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!location) return;

    let isActive = true;

    const loadNearbyVehicles = async () => {
      setVehiclesLoading(true);
      setVehiclesError(false);
      setOrdersError(false);

      try {
        const [vehiclesResult, ordersResult] = await Promise.all([
          supabase.rpc("buscar_camiones_cercanos", {
            orden_lat: location.latitude,
            orden_long: location.longitude,
          }),
          supabase.rpc("buscar_solicitudes_pendientes"),
        ]);

        if (!isActive) return;

        console.log("Camiones recibidos de Supabase:", vehiclesResult.data);

        if (vehiclesResult.error) {
          console.error(
            "No se pudieron cargar los camiones cercanos:",
            vehiclesResult.error,
          );
          setVehiclesError(true);
        } else {
          setVehicles(vehiclesResult.data ?? []);
        }

        if (ordersResult.error) {
          console.error(
            "No se pudieron cargar las solicitudes pendientes:",
            ordersResult.error,
          );
          setOrdersError(true);
        } else {
          setOrders(ordersResult.data ?? []);
        }
      } catch (error) {
        console.error("No se pudieron cargar los datos del mapa:", error);
        if (isActive) {
          setVehiclesError(true);
          setOrdersError(true);
        }
      } finally {
        if (isActive) setVehiclesLoading(false);
      }
    };

    void loadNearbyVehicles();

    return () => {
      isActive = false;
    };
  }, [location]);

  const initialRegion: Region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: CALI_REGION.latitudeDelta,
        longitudeDelta: CALI_REGION.longitudeDelta,
      }
    : CALI_REGION;

  return (
    <View style={styles.container}>
      <MapView
        key={location ? "current-location" : "cali"}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={status === "granted"}
      >
        {vehicles?.map((vehicle, index) => {
          const lat =
            parseCoordinate(vehicle.latitud) ??
            parseCoordinate(vehicle.latitude);
          const lng =
            parseCoordinate(vehicle.longitud) ??
            parseCoordinate(vehicle.longitude) ??
            parseCoordinate(vehicle.long);

          if (
            lat === null ||
            lng === null ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
          ) {
            return null;
          }

          const plate = vehicle.placa_camion ?? vehicle.placa ?? "Sin placa";
          const distance = getVehicleDistance(vehicle);
          const markerKey =
            vehicle.vehiculo_id ?? vehicle.id ?? `${lat}-${lng}-${index}`;

          return (
            <Marker
              key={markerKey}
              coordinate={{ latitude: lat, longitude: lng }}
              title={`Camión: ${plate}`}
              description={`Distancia: ${distance} metros`}
              pinColor="#10B981"
            />
          );
        })}
        {orders?.map((order) => {
          const lat = parseCoordinate(order.latitud);
          const lng = parseCoordinate(order.longitud);

          if (
            lat === null ||
            lng === null ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
          ) {
            return null;
          }

          return (
            <Marker
              key={order.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title="Solicitud de Recolección"
              description={`Dirección: ${order.direccion || order.address || "Sin dirección"}`}
              pinColor="#3B82F6"
            />
          );
        })}
      </MapView>

      <View style={[styles.header, { top: insets.top + 12 }]}>
        <Text style={styles.title}>Mi ubicación</Text>
        <Text style={styles.subtitle}>
          {vehicles.length > 0
            ? `Camión más cercano: ${vehicles[0].placa_camion ?? vehicles[0].placa ?? "Sin placa"} a ${getVehicleDistance(vehicles[0])}m`
            : location
              ? "Ubicación actual"
              : "Mostrando Cali mientras encontramos tu ubicación"}
        </Text>
      </View>

      {status === "loading" ? (
        <View style={[styles.statusCard, { bottom: insets.bottom + 24 }]}>
          <ActivityIndicator color="#10B981" size="small" />
          <Text style={styles.statusText}>
            Obteniendo tu ubicación...
          </Text>
        </View>
      ) : null}

      {status === "denied" ? (
        <View style={[styles.statusCard, styles.messageCard, { bottom: insets.bottom + 24 }]}>
          <Text style={styles.statusText}>
            No tenemos permiso para acceder a tu ubicación. Puedes activarlo en
            los ajustes de tu dispositivo; mientras tanto, el mapa muestra Cali.
          </Text>
        </View>
      ) : null}

      {status === "error" ? (
        <View style={[styles.statusCard, styles.messageCard, { bottom: insets.bottom + 24 }]}>
          <Text style={styles.statusText}>
            No pudimos obtener tu ubicación. Revisa que el GPS esté activado e
            inténtalo de nuevo más tarde. El mapa muestra Cali.
          </Text>
        </View>
      ) : null}

      {status === "granted" && vehiclesLoading ? (
        <View style={[styles.statusCard, { bottom: insets.bottom + 24 }]}>
          <ActivityIndicator color="#10B981" size="small" />
          <Text style={styles.statusText}>Buscando camiones cercanos...</Text>
        </View>
      ) : null}

      {status === "granted" && vehiclesError ? (
        <View style={[styles.statusCard, styles.messageCard, { bottom: insets.bottom + 24 }]}>
          <Text style={styles.statusText}>
            No fue posible cargar los camiones cercanos. Inténtalo de nuevo más
            tarde.
          </Text>
        </View>
      ) : null}

      {status === "granted" && ordersError ? (
        <View
          style={[
            styles.statusCard,
            styles.messageCard,
            { bottom: insets.bottom + 24 },
          ]}
        >
          <Text style={styles.statusText}>
            No fue posible cargar las solicitudes pendientes en el mapa.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081425",
  },
  header: {
    position: "absolute",
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#111c2d",
    borderWidth: 1,
    borderColor: "#3d4a3e",
  },
  title: {
    color: "#d8e3fb",
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: "#bbcbbb",
    fontSize: 13,
    marginTop: 4,
  },
  statusCard: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#111c2d",
    borderWidth: 1,
    borderColor: "#3d4a3e",
  },
  messageCard: {
    justifyContent: "flex-start",
  },
  statusText: {
    flexShrink: 1,
    color: "#d8e3fb",
    fontSize: 14,
    lineHeight: 20,
  },
});
