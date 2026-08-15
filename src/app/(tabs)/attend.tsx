import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scan } from 'lucide-react-native';

export default function AttendScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary-958">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Scan size={32} color="#9BA0A6" />
        <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">
          Attendance Scan
        </Text>
        <Text className="text-center font-quicksand text-sm text-primary-500">
          Clock in or out by scanning your badge here soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
