// app/workflows.tsx
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading workflows...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8fa" }} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Workflows</Text>
        <TouchableOpacity onPress={async () => { await signOut(); router.replace("./login"); }}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i: Workflow) => i.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }: { item: Workflow }) => (
          <TouchableOpacity
            onPress={() => router.push(`./workflow/${item.id}`)}
          >
            <View style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.title}>{item.workflowName}</Text>
                <Text style={[styles.status, item.status === "pending" ? styles.statusPending : item.status === "approved" ? styles.statusApproved : styles.statusRejected]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.subtitle}>{item.summary}</Text>
              <Text style={styles.meta}>
                {item.requester} • {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  logout: { color: "#ef4444", fontWeight: "700" },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontWeight: "700", fontSize: 16 },
  subtitle: { marginTop: 6, color: "#4b5563" },
  meta: { marginTop: 8, color: "#9ca3af", fontSize: 12 },
  status: { textTransform: "capitalize", fontSize: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  statusPending: { backgroundColor: "#fff7ed", color: "#c2410c" },
  statusApproved: { backgroundColor: "#ecfdf5", color: "#047857" },
  statusRejected: { backgroundColor: "#fef2f2", color: "#b91c1c" },
});
