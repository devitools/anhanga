import "../src/settings/i18n";
import { withProviders } from "@anhanga/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { theme } from "../src/settings/theme";

function RootLayout () {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </View>
  );
}

export default withProviders(RootLayout, { theme });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
