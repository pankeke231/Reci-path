import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker, type Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import {
  subscribeToMapChanges,
  type RealtimeStatus,
} from "@/services/realtimeService";

const CALI_REGION: Region = {
  latitude: 3.4516,
  longitude: -76.532,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const REALTIME_DEBOUNCE_MS = 400;

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

function getLiveLabel(status: RealtimeStatus): string {
  switch (status) {
    case "connected":
      return "En vivo";
    case "connecting":
      return "Conectando...";
    case "error":
      return "Sin conexión en vivo";
    default:
      return "En vivo pausado";
  }
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const locationRef = useRef<Location.LocationObjectCoords | null>(null);
  const hasCenteredOnLocation = useRef(false);
  const reloadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [vehicles, setVehicles] = useState<NearbyVehicle[]>([]);
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState(false);
  const [ordersError, setOrdersError] = useState(false);
  const [liveStatus, setLiveStatus] = useState<RealtimeStatus>("connecting");

  const loadMapData = useCallback(async () => {
    const coords = locationRef.current;
    if (!coords) return;

    setVehiclesLoading(true);
    setVehiclesError(false);
    setOrdersError(false);

    try {
      const [vehiclesResult, ordersResult] = await Promise.all([
        supabase.rpc("buscar_camiones_cercanos", {
          orden_lat: coords.latitude,
          orden_long: coords.longitude,
        }),
        supabase.rpc("buscar_solicitudes_pendientes"),
      ]);

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
      setVehiclesError(true);
      setOrdersError(true);
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

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

    locationRef.current = location;
    void loadMapData();

    if (!hasCenteredOnLocation.current) {
      hasCenteredOnLocation.current = true;
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: CALI_REGION.latitudeDelta,
          longitudeDelta: CALI_REGION.longitudeDelta,
        },
        600,
      );
    }
  }, [location, loadMapData]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      // Recupera eventos perdidos mientras la pestaña estuvo sin foco.
      if (locationRef.current) void loadMapData();

      // Realtime como señal: cualquier cambio en pedidos o vehículos
      // dispara un refetch con debounce de las RPC del mapa.
      const unsubscribe = subscribeToMapChanges(
        () => {
          if (reloadTimeout.current) clearTimeout(reloadTimeout.current);

          reloadTimeout.current = setTimeout(() => {
            reloadTimeout.current = null;
            if (isActive) void loadMapData();
          }, REALTIME_DEBOUNCE_MS);
        },
        setLiveStatus,
      );

      return () => {
        isActive = false;
        if (reloadTimeout.current) {
          clearTimeout(reloadTimeout.current);
          reloadTimeout.current = null;
        }
        unsubscribe();
        setLiveStatus("disconnected");
      };
    }, [loadMapData]),
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={CALI_REGION}
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
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mi ubicación</Text>
          <View
            style={[
              styles.liveBadge,
              liveStatus === "connected"
                ? styles.liveBadgeActive
                : styles.liveBadgeInactive,
            ]}
          >
            <View
              style={[
                styles.liveDot,
                liveStatus === "connected"
                  ? styles.liveDotActive
                  : styles.liveDotInactive,
              ]}
            />
            <Text style={styles.liveText}>{getLiveLabel(liveStatus)}</Text>
          </View>
        </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    color: "#d8e3fb",
    fontSize: 18,
    fontWeight: "700",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  liveBadgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  liveBadgeInactive: {
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    borderColor: "rgba(148, 163, 184, 0.4)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  liveDotActive: {
    backgroundColor: "#10B981",
  },
  liveDotInactive: {
    backgroundColor: "#94A3B8",
  },
  liveText: {
    color: "#d8e3fb",
    fontSize: 11,
    fontWeight: "600",
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
