import { Image } from "expo-image";
import { Link } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View>
        <Image
          source={require("../../assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>Welcome!</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Step 1: Try it</Text>
        <Text>
          Edit <Text style={{ fontWeight: "600" }}>app/(tabs)/index.tsx</Text>{" "}
          to see changes. Press{" "}
          <Text style={{ fontWeight: "600" }}>
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </Text>{" "}
          to open developer tools.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Link href="/modal">
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Step 2: Explore
          </Text>
        </Link>
        <Text>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Step 3: Get a fresh start
        </Text>
        <Text>
          {`When you're ready, run `}
          <Text style={{ fontWeight: "600" }}>npm run reset-project</Text> to
          get a fresh <Text style={{ fontWeight: "600" }}>app</Text> directory.
          This will move the current{" "}
          <Text style={{ fontWeight: "600" }}>app</Text> to{" "}
          <Text style={{ fontWeight: "600" }}>app-example</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
