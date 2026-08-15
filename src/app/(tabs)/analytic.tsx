import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartPie } from 'lucide-react-native';

export default function AnalyticScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary-958">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ChartPie size={32} color="#9BA0A6" />
        <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">
          Analytics
        </Text>
        <Text className="text-center font-quicksand text-sm text-primary-500">
          Your performance insights will show up here soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
