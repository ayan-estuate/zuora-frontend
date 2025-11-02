// // app/signup.tsx
// import { useRouter } from "expo-router";
// import { Formik } from "formik";
// import React, { useState } from "react";
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Yup from "yup";
// import { useAuth } from "../hooks/useAuth";
// import api from "./api/client";

// export default function SignupScreen() {
//   const auth = useAuth();
//   const router = useRouter();
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const onSubmit = async (data: {
//     name: string;
//     email: string;
//     password: string;
//   }) => {
//     try {
//       const res = await api.post("/auth/signup", data);
//       await auth.signIn(res.data.user, res.data.token);
//       router.replace("./workflows");
//     } catch (err: any) {
//       // Allow frontend-only dev
//       if (!err?.response) {
//         await auth.signIn(
//           { id: "1", name: data.name || "New User", email: data.email },
//           "mock-token"
//         );
//         router.replace("./workflows");
//         return;
//       }
//       Alert.alert("Signup failed", err?.response?.data?.message ?? err.message);
//     }
//   };

//   const SignupSchema = Yup.object().shape({
//     name: Yup.string().min(2, "Name too short").required("Name is required"),
//     email: Yup.string()
//       .email("Enter a valid email")
//       .required("Email is required"),
//     password: Yup.string()
//       .min(6, "At least 6 characters")
//       .required("Password is required"),
//   });

//   return (
//     <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Create account</Text>
//           <Text style={styles.subtitle}>Join your company workspace</Text>
//           <Formik<{ name: string; email: string; password: string }>
//             initialValues={{ name: "", email: "", password: "" }}
//             validationSchema={SignupSchema}
//             onSubmit={onSubmit}
//             validateOnBlur
//           >
//             {(formik: any) => (
//               <>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Full name"
//                   value={formik.values.name}
//                   onChangeText={formik.handleChange("name")}
//                   onBlur={formik.handleBlur("name")}
//                   autoComplete="name"
//                   textContentType="name"
//                 />
//                 {formik.touched.name && formik.errors.name ? (
//                   <Text style={styles.errorText}>{formik.errors.name}</Text>
//                 ) : null}

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Email"
//                   value={formik.values.email}
//                   onChangeText={formik.handleChange("email")}
//                   onBlur={formik.handleBlur("email")}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                   autoComplete="email"
//                   textContentType="emailAddress"
//                 />
//                 {formik.touched.email && formik.errors.email ? (
//                   <Text style={styles.errorText}>{formik.errors.email}</Text>
//                 ) : null}

//                 <View style={styles.inputRow}>
//                   <TextInput
//                     style={[styles.input, { flex: 1, marginBottom: 0 }]}
//                     placeholder="Password"
//                     value={formik.values.password}
//                     onChangeText={formik.handleChange("password")}
//                     onBlur={formik.handleBlur("password")}
//                     secureTextEntry={!passwordVisible}
//                     autoComplete="password"
//                     textContentType="password"
//                   />
//                   <TouchableOpacity
//                     onPress={() => setPasswordVisible((v) => !v)}
//                     style={styles.toggle}
//                     accessibilityRole="button"
//                     accessibilityLabel={
//                       passwordVisible ? "Hide password" : "Show password"
//                     }
//                   >
//                     <Text style={styles.toggleText}>
//                       {passwordVisible ? "Hide" : "Show"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 {formik.touched.password && formik.errors.password ? (
//                   <Text style={styles.errorText}>{formik.errors.password}</Text>
//                 ) : null}

//                 <TouchableOpacity
//                   style={styles.primaryButton}
//                   onPress={() => formik.handleSubmit()}
//                 >
//                   <Text style={styles.primaryButtonText}>Sign up</Text>
//                 </TouchableOpacity>
//               </>
//             )}
//           </Formik>
//           <TouchableOpacity
//             onPress={() => router.replace("./login")}
//             style={styles.linkWrap}
//           >
//             <Text style={styles.link}>Have an account? Sign in</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f7f8fa" },
//   container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 3,
//   },
//   title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
//   subtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//     marginTop: 6,
//     marginBottom: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     padding: 14,
//     marginBottom: 12,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingRight: 8,
//     marginBottom: 12,
//   },
//   toggle: { paddingHorizontal: 8, paddingVertical: 8 },
//   toggleText: { color: "#2563eb", fontWeight: "600" },
//   primaryButton: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 4,
//   },
//   primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
//   linkWrap: { alignItems: "center", marginTop: 14 },
//   link: { color: "#2563eb", fontWeight: "600" },
//   errorText: { color: "#b91c1c", marginTop: -6, marginBottom: 8 },
// });
// app/signup.tsx
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import api from './api/client';

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', data);
      console.log('Signup response:', res.data);

      Alert.alert(
        'Signup successful',
        'Your account has been created. Please log in to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('./login'),
          },
        ],
      );
    } catch (err: any) {
      console.error('Signup failed:', err);
      Alert.alert(
        'Signup failed',
        err?.response?.data?.message ?? err.message ?? 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name too short').required('Name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join your company workspace</Text>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={onSubmit}
          >
            {(formik: any) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  value={formik.values.name}
                  onChangeText={formik.handleChange('name')}
                />
                {formik.touched.name && formik.errors.name && (
                  <Text style={styles.errorText}>{formik.errors.name}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formik.values.email}
                  onChangeText={formik.handleChange('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {formik.touched.email && formik.errors.email && (
                  <Text style={styles.errorText}>{formik.errors.email}</Text>
                )}

                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Password"
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible((v) => !v)}
                    style={styles.toggle}
                  >
                    <Text style={styles.toggleText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
                {formik.touched.password && formik.errors.password && (
                  <Text style={styles.errorText}>{formik.errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => formik.handleSubmit()}
                  disabled={loading}
                >
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Creating...' : 'Sign up'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <TouchableOpacity onPress={() => router.replace('./login')} style={styles.linkWrap}>
            <Text style={styles.link}>Have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingRight: 8,
    marginBottom: 12,
  },
  toggle: { paddingHorizontal: 8, paddingVertical: 8 },
  toggleText: { color: '#2563eb', fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkWrap: { alignItems: 'center', marginTop: 14 },
  link: { color: '#2563eb', fontWeight: '600' },
  errorText: { color: '#b91c1c', marginTop: -6, marginBottom: 8 },
});
