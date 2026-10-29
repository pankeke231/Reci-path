import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, {
  Marker,
  Polyline,
  type LatLng,
  type Region,
} from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../hooks/useAuth";
import { ORDER_STATUS } from "../../../constants/orderStatus";
import { supabase } from "../../../lib/supabase";
import { getErrorMessage } from "../../../utils/errors";
import { distanceInMeters } from "../../../utils/geo";
import { subscribeToOrders } from "../../../services/realtimeService";
import { vehiclesService } from "../../../services/vehiclesService";

const CALI_REGION: Region = {
  latitude: 3.4516,
  longitude: -76.532,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

type RouteOrder = {
  id: string;
  latitud: number | string | null;
  longitud: number | string | null;
  direccion?: string | null;
  address?: string | null;
  status: string;
};

type RawRouteOrder = {
  id: string;
  latitud: number | string | null;
  longitud: number | string | null;
  direccion?: string | null;
  estado?: string | null;
  address?: string | null;
  status?: string | null;
};

function normalizeRouteOrder(order: RawRouteOrder): RouteOrder {
  return {
    id: order.id,
    latitud: order.latitud,
    longitud: order.longitud,
    direccion: order.direccion ?? order.address ?? null,
    address: order.address ?? order.direccion ?? null,
    status: order.estado ?? order.status ?? "",
  };
}

const PUBLISH_INTERVAL_MS = 12000;
const PUBLISH_DISTANCE_METERS = 40;

function coordinateValue(value: number | string | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidCoordinate({ latitude, longitude }: LatLng): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function orderRouteByProximity(
  orders: RouteOrder[],
  origin: LatLng,
): RouteOrder[] {
  const pending = [...orders];
  const sorted: RouteOrder[] = [];
  let current = origin;

  while (pending.length) {
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    pending.forEach((order, index) => {
      const latitude = coordinateValue(order.latitud);
      const longitude = coordinateValue(order.longitud);
      if (latitude === null || longitude === null) return;

      const distance =
        (latitude - current.latitude) ** 2 +
        (longitude - current.longitude) ** 2;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const [nearest] = pending.splice(nearestIndex, 1);
    sorted.push(nearest);
    const latitude = coordinateValue(nearest.latitud);
    const longitude = coordinateValue(nearest.longitud);
    if (latitude !== null && longitude !== null) {
      current = { latitude, longitude };
    }
  }

  return sorted;
}

export default function CollectorViewRouteScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const hasFittedRoute = useRef(false);
  const isRouteActiveRef = useRef(false);
  const lastPublishedRef = useRef<
    { latitude: number; longitude: number; at: number } | null
  >(null);
  const routeReloadTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location, setLocation] = useState<LatLng | null>(null);
  const [orders, setOrders] = useState<RouteOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isRouteActive, setIsRouteActive] = useState(false);

  const validOrders = useMemo(
    () =>
      orders.filter((order) => {
        const latitude = coordinateValue(order.latitud);
        const longitude = coordinateValue(order.longitud);
        return (
          latitude !== null &&
          longitude !== null &&
          isValidCoordinate({ latitude, longitude })
        );
      }),
    [orders],
  );

  const orderedOrders = useMemo(
    () =>
      orderRouteByProximity(
        validOrders,
        location ?? {
          latitude: CALI_REGION.latitude,
          longitude: CALI_REGION.longitude,
        },
      ),
    [validOrders, location],
  );

  const lineCoordinates = useMemo<LatLng[]>(() => {
    if (!location) return [];
    return [
      location,
      ...orderedOrders.flatMap((order) => {
        const latitude = coordinateValue(order.latitud);
        const longitude = coordinateValue(order.longitud);
        return latitude === null || longitude === null
          ? []
          : [{ latitude, longitude }];
      }),
    ];
  }, [location, orderedOrders]);

  const loadRoute = useCallback(async () => {
    if (!user?.id) {
      setRouteError("No se encontró la sesión del recolector.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setRouteError(null);

    try {
      const [routeResult, activeOrderResult] = await Promise.all([
        supabase.rpc("buscar_ruta_recolector", {
          id_conductor: user.id,
        }),
        supabase
          .from("orders")
          .select("id")
          .eq("collector_id", user.id)
          .eq("status", ORDER_STATUS.IN_ROUTE)
          .limit(1),
      ]);

      if (routeResult.error) throw routeResult.error;
      if (activeOrderResult.error) throw activeOrderResult.error;

      const routeOrders = ((routeResult.data ?? []) as RawRouteOrder[]).map(
        normalizeRouteOrder,
      );
      setOrders(routeOrders);
      setIsRouteActive(
        routeOrders.some((order) => order.status === ORDER_STATUS.IN_ROUTE) ||
          (activeOrderResult.data?.length ?? 0) > 0,
      );
    } catch (error) {
      console.error("No se pudo cargar la ruta del recolector:", error);
      setRouteError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      void loadRoute();

      if (!user?.id) return;

      const unsubscribe = subscribeToOrders(
        "collector_id",
        user.id,
        () => {
          if (routeReloadTimeout.current) clearTimeout(routeReloadTimeout.current);
          routeReloadTimeout.current = setTimeout(() => {
            routeReloadTimeout.current = null;
            void loadRoute();
          }, 500);
        },
      );

      return () => {
        if (routeReloadTimeout.current) {
          clearTimeout(routeReloadTimeout.current);
          routeReloadTimeout.current = null;
        }
        unsubscribe();
      };
    }, [loadRoute, user?.id]),
  );

  useEffect(() => {
    let active = true;
    let subscription: Location.LocationSubscription | null = null;

    const watchLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!active) return;

        if (permission.status !== "granted") {
          setLocationDenied(true);
          return;
        }

        const initial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!active) return;

        setLocation({
          latitude: initial.coords.latitude,
          longitude: initial.coords.longitude,
        });

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10,
            timeInterval: 5000,
          },
          (nextLocation) => {
            setLocation({
              latitude: nextLocation.coords.latitude,
              longitude: nextLocation.coords.longitude,
            });
          },
        );

        if (!active) subscription.remove();
      } catch (error) {
        console.error("No se pudo seguir la ubicación del recolector:", error);
        if (active) {
          Alert.alert(
            "Ubicación no disponible",
            "No fue posible activar el seguimiento GPS del recorrido.",
          );
        }
      }
    };

    void watchLocation();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    isRouteActiveRef.current = isRouteActive;
  }, [isRouteActive]);

  const publishLocation = useCallback(async (nextLocation: LatLng) => {
    if (!isRouteActiveRef.current) return;

    const now = Date.now();
    const last = lastPublishedRef.current;

    if (last) {
      const elapsed = now - last.at;
      const moved = distanceInMeters(last, nextLocation);
      if (elapsed < PUBLISH_INTERVAL_MS && moved < PUBLISH_DISTANCE_METERS) {
        return;
      }
    }

    lastPublishedRef.current = { ...nextLocation, at: now };

    try {
      await vehiclesService.updateMyLocation(
        nextLocation.latitude,
        nextLocation.longitude,
      );
    } catch (error) {
      lastPublishedRef.current = last;
      console.error(
        "No se pudo publicar la ubicación del vehículo:",
        error,
      );
    }
  }, []);

  useEffect(() => {
    if (!location) return;
    void publishLocation(location);
  }, [location, publishLocation]);

  useEffect(() => {
    if (
      !mapReady ||
      !location ||
      !orderedOrders.length ||
      hasFittedRoute.current
    ) {
      return;
    }

    const coordinates: LatLng[] = [
      location,
      ...orderedOrders.flatMap((order) => {
        const latitude = coordinateValue(order.latitud);
        const longitude = coordinateValue(order.longitud);
        return latitude === null || longitude === null
          ? []
          : [{ latitude, longitude }];
      }),
    ];

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: { top: 150, right: 50, bottom: 170, left: 50 },
      animated: true,
    });
    hasFittedRoute.current = true;
  }, [location, mapReady, orderedOrders]);

  const initialRegion: Region = location
    ? {
        ...location,
        latitudeDelta: CALI_REGION.latitudeDelta,
        longitudeDelta: CALI_REGION.longitudeDelta,
      }
    : CALI_REGION;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={Boolean(location)}
        onMapReady={() => setMapReady(true)}
      >
        {orderedOrders.map((order, index) => {
          const latitude = coordinateValue(order.latitud);
          const longitude = coordinateValue(order.longitud);
          if (latitude === null || longitude === null) return null;

          return (
            <Marker
              key={order.id}
              coordinate={{ latitude, longitude }}
              title={`Parada ${index + 1}`}
              description={
                order.direccion || order.address || "Punto de recolección"
              }
              pinColor="#F97316"
            />
          );
        })}
        {isRouteActive && lineCoordinates.length > 1 ? (
          <Polyline
            coordinates={lineCoordinates}
            strokeColor="#10B981"
            strokeWidth={4}
          />
        ) : null}
      </MapView>

      <View style={[styles.header, { top: insets.top + 12 }]}>
        <Text style={styles.title}>Recorrido completo</Text>
        <Text style={styles.subtitle}>
          {loading
            ? "Cargando órdenes asignadas..."
            : `${orderedOrders.length} parada(s) · ${isRouteActive ? "En curso" : "Sin iniciar"}`}
        </Text>
      </View>

      {loading ? (
        <View style={[styles.notice, { top: insets.top + 100 }]}>
          <ActivityIndicator color="#34D399" />
          <Text style={styles.noticeText}>Cargando ruta...</Text>
        </View>
      ) : null}

      {routeError ? (
        <View style={[styles.notice, styles.errorNotice, { top: insets.top + 100 }]}>
          <Text style={styles.noticeText}>{routeError}</Text>
          <Text style={styles.retry} onPress={() => void loadRoute()}>
            Reintentar
          </Text>
        </View>
      ) : null}

      {locationDenied ? (
        <View style={[styles.notice, { top: insets.top + 100 }]}>
          <Text style={styles.noticeText}>
            Sin permiso GPS: la ruta se muestra, pero no podrá seguir tu
            ubicación en tiempo real.
          </Text>
        </View>
      ) : null}

      {!loading && !routeError && !orderedOrders.length ? (
        <View style={[styles.notice, { top: insets.top + 100 }]}>
          <Text style={styles.noticeText}>
            No tienes órdenes asignadas con coordenadas para mostrar.
          </Text>
        </View>
      ) : null}

      <View style={[styles.bottomAction, { bottom: insets.bottom + 20 }]}>
        <Text style={styles.stopCount}>
          {orderedOrders.length} parada(s) ·{" "}
          {isRouteActive ? "Recorrido en curso" : "Marca una orden en ruta para iniciar"}
        </Text>
      </View>
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
  notice: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#111c2d",
    borderWidth: 1,
    borderColor: "#3d4a3e",
  },
  errorNotice: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  noticeText: {
    flexShrink: 1,
    color: "#d8e3fb",
    fontSize: 14,
    lineHeight: 20,
  },
  retry: {
    color: "#54e98a",
    fontWeight: "700",
  },
  bottomAction: {
    position: "absolute",
    left: 16,
    right: 16,
    gap: 10,
  },
  stopCount: {
    alignSelf: "center",
    color: "#d8e3fb",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#111c2d",
  },
});
