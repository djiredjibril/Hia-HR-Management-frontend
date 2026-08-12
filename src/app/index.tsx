import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary-958">
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text className="font-quicksand-bold text-3xl text-primary-900 dark:text-white">
          Hia HR Management
        </Text>
        <Text className="text-center font-quicksand text-base text-primary-600 dark:text-primary-400">
          Frontend scaffold ready. Start building in src/app/index.tsx
        </Text>
      </View>
    </SafeAreaView>
  );
}
