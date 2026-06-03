import { useCallback, useEffect, useState } from "react";
import { ordersService } from "../services/ordersService";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "./useAuth";
import { ROLES } from "../constants/roles";

export function useOrders({ autoFetch = true } = {}) {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!profile?.id) return [];
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (profile.role === ROLES.CITIZEN) {
        data = await ordersService.listByCitizen(profile.id);
      } else if (profile.role === ROLES.COLLECTOR) {
        data = await ordersService.listForCollector(profile.id);
      } else if (profile.role === ROLES.ADMIN) {
        data = await ordersService.listAll();
      }
      setOrders(data);
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    if (autoFetch && profile?.id) {
      fetchOrders();
    }
  }, [autoFetch, profile?.id, fetchOrders]);

  const createOrder = useCallback(
    async (payload) => {
      if (!profile?.id) {
        throw new Error("Debes iniciar sesión para crear un pedido");
      }
      const created = await ordersService.createOrder({
        ...payload,
        citizen_id: profile.id,
      });
      setOrders((prev) => [created, ...prev]);
      return created;
    },
    [profile?.id],
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    setOrders,
  };
}
