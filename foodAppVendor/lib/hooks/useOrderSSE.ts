import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventSource from "react-native-sse";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface UseOrderSSEOptions {
    onNewOrder: (order: any) => void;
}

export const useOrderSSE = ({ onNewOrder }: UseOrderSSEOptions) => {
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const areaIdRef = useRef<string | null>(null);

    const connect = useCallback(async () => {

        if (!areaIdRef.current) {
            const stored = await AsyncStorage.getItem("vendor_area_code");
            if (!stored) return;
            areaIdRef.current = stored;
        }

        // close existing connection before opening a new one
        eventSourceRef.current?.close();

        const es = new EventSource(`${API_BASE_URL}/stream/orders/${areaIdRef.current}`,
            {
                headers: {
                    Accept: "text/event-stream",
                    "Cache-Control": "no-cache",
                },
                pollingInterval: 0,
            });

        eventSourceRef.current = es;

        es.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data ?? "");

                if (data.type === "new_order") onNewOrder(data.order);
            } catch (err) {
                console.error("SSE parse error:", err);
            }
        });

        es.addEventListener("error", (err) => {
            es.close();
            // auto-reconnect after 5s
            reconnectTimerRef.current = setTimeout(() => connect(), 5000);
        });
    }, [onNewOrder]);

    // pause/resume on app background/foreground
    useEffect(() => {
        const handleAppState = (state: AppStateStatus) => {
            if (state === "active") {
                if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
                connect();
            } else if (state === "background") {
                eventSourceRef.current?.close();
                if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            }
        };

        const sub = AppState.addEventListener("change", handleAppState);
        return () => sub.remove();
    }, [connect]);

    // initial connect + cleanup on unmount
    useEffect(() => {
        connect();
        return () => {
            eventSourceRef.current?.close();
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
    }, [connect]);
};