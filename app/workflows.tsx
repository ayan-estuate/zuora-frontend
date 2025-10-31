// app/workflows.tsx
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Workflow } from "../types/workflow";
import { useAuth } from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Spacing, Radius } from "../constants/theme";
import { Strings } from "../constants/strings";
import api, { handleAPIError } from "./api/client";

async function fetchPending() {
  try {
    const r = await api.get("/workflows/pending");
    return r.data;
  } catch (err) {
    if (__DEV__) {
      return [
        {
          id: "1",
          workflowName: "Invoice Refund Approval",
          summary: "Refund for INV-10023",
          payload: { invoice: "INV-10023", amount: 120.5, customer: "ACME" },
          requester: "Billing Ops",
          createdAt: new Date().toISOString(),
          status: "pending",
        },
      ];
    }
    throw handleAPIError(err);
  }
}

export default function WorkflowsList() {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery<Workflow[]>({
    queryKey: ["pendingWorkflows"],
    queryFn: fetchPending,
  });

  if (isLoading && !data.length) {
    return (
      <View style={styles.centered}>
        <Text>{Strings.workflows.loading}</Text>
      </View>
    );
  }

  const keyExtractor = useCallback((i: Workflow) => i.id, []);
  const renderItem = useCallback(
    ({ item }: { item: Workflow }) => (
      <TouchableOpacity onPress={() => router.push(`./workflow/${item.id}`)}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{item.workflowName}</Text>
            <Text
              style={
                [
                  styles.status,
                  item.status === "pending"
                    ? styles.statusPending
                    : item.status === "approved"
                    ? styles.statusApproved
                    : styles.statusRejected,
                ] as any
              }
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.subtitle}>{item.summary}</Text>
          <Text style={styles.meta}>
            {item.requester} • {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [router]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8fa" }} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{Strings.workflows.header}</Text>
        <TouchableOpacity onPress={async () => { await signOut(); router.replace("./login"); }}>
          <Text style={styles.logout}>{Strings.workflows.logout}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  logout: { color: "#ef4444", fontWeight: "700" },
  card: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: "#fff",
    borderRadius: Radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontWeight: "700", fontSize: 16 },
  subtitle: { marginTop: Spacing.sm, color: "#4b5563" },
  meta: { marginTop: Spacing.md, color: "#9ca3af", fontSize: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  status: { textTransform: "capitalize", fontSize: 12, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.pill },
  statusPending: { backgroundColor: "#fff7ed", color: "#c2410c" },
  statusApproved: { backgroundColor: "#ecfdf5", color: "#047857" },
  statusRejected: { backgroundColor: "#fef2f2", color: "#b91c1c" },
});
