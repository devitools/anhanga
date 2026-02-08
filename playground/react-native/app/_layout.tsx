import "@anhanga/demo/settings/i18n";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { DialogProvider } from "../src/presentation/components";

export default function RootLayout() {
  return (
    <DialogProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </View>
    </DialogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
