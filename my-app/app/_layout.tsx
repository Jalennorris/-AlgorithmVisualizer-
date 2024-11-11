import { Stack } from "expo-router";
import AlgorithmVisualizer from './algorithmVisualizer'; // Corrected import path

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="algorithmVisualizer" options={{ title: "Algorithm Visualizer" }} />
    </Stack>
  );
}
