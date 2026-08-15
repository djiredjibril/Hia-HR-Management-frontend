import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENT_USER = {
  name: 'Alex Johnson',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex.johnson@hia.com',
};

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-primary-958">
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Image source={{ uri: CURRENT_USER.avatarUrl }} className="h-20 w-20 rounded-full" />
        <Text className="font-quicksand-bold text-2xl text-primary-900 dark:text-white">
          {CURRENT_USER.name}
        </Text>
        <Text className="text-center font-quicksand text-sm text-primary-500">
          Your profile details will show up here soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}
