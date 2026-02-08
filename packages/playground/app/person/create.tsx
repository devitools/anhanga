import { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Scope } from "@anhanga/core";
import { PersonSchema } from "../../src/domain/person/schema";
import { personEvents } from "../../src/domain/person/events";
import { personHandlers } from "../../src/domain/person/handlers";
import { createComponent } from "../../src/presentation/contracts/component";
import { SchemaForm } from "../../src/presentation/components/SchemaForm";

export default function PersonCreatePage() {
  const component = useMemo(
    () => createComponent(Scope.add, () => console.log("[reload]")),
    [],
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Person / Create</Text>

        <SchemaForm
          debug={false}
          schema={PersonSchema.provide()}
          scope={Scope.add}
          services={PersonSchema.getServices()}
          events={personEvents}
          handlers={personHandlers}
          component={component}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  container: {
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },
});
