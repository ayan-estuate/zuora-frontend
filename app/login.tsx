// app/login.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import api from "./api/client";

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const auth = useAuth();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/auth/login", data);
      await auth.signIn(res.data.user, res.data.token);
      router.replace("./workflows");
    } catch (err: any) {
      // Mock login for frontend development
      if (!err?.response) {
        await auth.signIn(
          { id: "1", name: "Dev User", email: data.email },
          "mock-token"
        );
        router.replace("./workflows");
        return;
      }
      Alert.alert("Login failed", err?.response?.data?.message ?? err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={field.value}
                onChangeText={field.onChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Password"
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible((v) => !v)}
                  style={styles.toggle}
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  <Text style={styles.toggleText}>
                    {passwordVisible ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("./signup")}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>New here? Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f8fa" },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingRight: 8,
    marginBottom: 12,
  },
  toggle: { paddingHorizontal: 8, paddingVertical: 8 },
  toggleText: { color: "#2563eb", fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkWrap: { alignItems: "center", marginTop: 14 },
  link: { color: "#2563eb", fontWeight: "600" },
});
