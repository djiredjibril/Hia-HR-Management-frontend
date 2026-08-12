import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="text-3xl font-semibold text-neutral-900 dark:text-white">
          Hia HR Management
        </Text>
        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          Frontend scaffold ready. Start building in src/app/index.tsx
        </Text>
      </View>
    </SafeAreaView>
  );
}
