// app/workflow/[id].tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { handleAPIError } from "../api/client";

export default function WorkflowDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const router = useRouter();
  const [comment, setComment] = useState("");

  const { data, isError, error } = useQuery({
    queryKey: ["workflow", id],
    queryFn: async () => {
      try {
        return (await api.get(`/workflows/${id}`)).data;
      } catch (err) {
        if (__DEV__) {
          return {
            id,
            workflowName: "Invoice Refund Approval",
            summary: "Refund for INV-10023",
            payload: { invoice: "INV-10023", amount: 120.5, customer: "ACME" },
            requester: "Billing Ops",
            createdAt: new Date().toISOString(),
            status: "pending",
          };
        }
        throw handleAPIError(err);
      }
    },
  });

  // Always call hooks at the top level
  const approve = useMutation({
    mutationFn: (payload: { comment: string }) =>
      api.post(`/workflows/${id}/approve`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingWorkflows"] });
      Alert.alert("Approved");
      router.back();
    },
  });

  const reject = useMutation({
    mutationFn: (payload: { comment: string }) =>
      api.post(`/workflows/${id}/reject`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingWorkflows"] });
      Alert.alert("Rejected");
      router.back();
    },
  });

  if (isError) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Error: {(error as Error).message}</Text>
      </View>
    );
  }

  if (!data)
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f7f8fa" }}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workflow</Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>{data.workflowName}</Text>
            <Text
              style={[
                styles.status,
                data.status === "pending"
                  ? styles.statusPending
                  : data.status === "approved"
                  ? styles.statusApproved
                  : styles.statusRejected,
              ]}
            >
              {data.status}
            </Text>
          </View>
          <Text style={styles.subtitle}>{data.summary}</Text>
          <Text style={styles.meta}>
            Requested by {data.requester} •{" "}
            {new Date(data.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payload</Text>
          <View style={styles.payloadBox}>
            <Text style={styles.payloadText}>
              {JSON.stringify(data.payload, null, 2)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Decision</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional comment"
            value={comment}
            onChangeText={setComment}
          />
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              disabled={approve.isPending}
              onPress={() => approve.mutate({ comment })}
            >
              <Text style={styles.actionText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              disabled={reject.isPending}
              onPress={() => reject.mutate({ comment })}
            >
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f7f8fa",
  },
  backText: { color: "#2563eb", fontWeight: "700", width: 48 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { marginTop: 6, color: "#4b5563" },
  meta: { marginTop: 8, color: "#9ca3af", fontSize: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  payloadBox: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 12 },
  payloadText: {
    fontFamily: Platform?.OS === "ios" ? "Menlo" : "monospace",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  approveButton: { backgroundColor: "#16a34a" },
  rejectButton: { backgroundColor: "#ef4444" },
  actionText: { color: "#fff", fontWeight: "700" },
  status: {
    textTransform: "capitalize",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPending: { backgroundColor: "#fff7ed", color: "#c2410c" },
  statusApproved: { backgroundColor: "#ecfdf5", color: "#047857" },
  statusRejected: { backgroundColor: "#fef2f2", color: "#b91c1c" },
});
