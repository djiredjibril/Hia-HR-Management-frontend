import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Check } from 'lucide-react-native';

import BgIconLeft from '@/assets/svg/Bg icons/bg-icon-left.svg';
import BgIconRightMiddle from '@/assets/svg/Bg icons/bg-icon-right-middle.svg';

const CHECKED_IN_USER = {
  name: 'Mike Cooper',
  role: 'Marketing Officer',
  employeeId: 'DE3824-MO4',
  avatarUrl: 'https://i.pravatar.cc/150?u=mike.cooper@hia.com',
};

export default function AttendSuccessScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';
  const decorationColor = isDark ? '#FFFFFF' : '#17181C';

  return (
    <View className="flex-1 overflow-hidden bg-primary-50 dark:bg-primary-958">
      <View className="absolute inset-0" pointerEvents="none">
        <BgIconLeft
          width={338}
          height={208}
          color={decorationColor}
          style={{ position: 'absolute', top: -24, left: -70 }}
        />
        <BgIconRightMiddle
          width={314}
          height={414}
          color={decorationColor}
          style={{ position: 'absolute', top: '50%', right: -50 }}
        />
      </View>

      <SafeAreaView className="flex-1">
        <View className="px-4 pt-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
        </View>

        <View className="flex-1 px-6">
          <View className="flex-1 items-center justify-center gap-2">
            <View className="relative h-28 w-28 items-center justify-center">
              <View className="absolute -left-1 top-3 h-2 w-2 rounded-full bg-primary-300 dark:bg-primary-700" />
              <View className="absolute -right-1 top-6 h-1.5 w-1.5 rounded-full bg-primary-300 dark:bg-primary-700" />
              <View className="absolute bottom-2 -left-2 h-1.5 w-1.5 rounded-full bg-primary-300 dark:bg-primary-700" />
              <View className="absolute -right-2 bottom-4 h-2 w-2 rounded-full bg-primary-300 dark:bg-primary-700" />
              <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-928 dark:bg-white">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-success-500">
                  <Check size={22} color="#FFFFFF" strokeWidth={3} />
                </View>
              </View>
            </View>

            <Text className="mt-4 font-quicksand-bold text-2xl text-primary-900 dark:text-white">
              You&apos;re checked in!
            </Text>
            <Text className="font-quicksand-bold text-3xl text-success-500">07.58 AM</Text>

            <View className="mt-6 w-full flex-row items-center gap-3 rounded-3xl bg-white px-4 py-4 shadow-sm shadow-black/5 dark:bg-primary-846">
              <Image source={{ uri: CHECKED_IN_USER.avatarUrl }} className="h-14 w-14 rounded-2xl" />
              <View className="flex-1">
                <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                  {CHECKED_IN_USER.name}
                </Text>
                <Text className="font-quicksand text-sm text-primary-500">{CHECKED_IN_USER.role}</Text>
                <Text className="font-quicksand text-xs text-primary-400">
                  {CHECKED_IN_USER.employeeId}
                </Text>
              </View>
              <View className="h-8 w-8 items-center justify-center rounded-full bg-success-500">
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            </View>

            <Text className="mt-5 text-center font-quicksand text-sm leading-6 text-primary-500">
              Great job! Your attendance has been successfully logged. Hope you have a great day!
            </Text>
          </View>
        </View>

        <View className="px-6 pb-4">
          <Pressable
            onPress={() => router.replace('/')}
            className="items-center rounded-full py-4 active:opacity-90"
            style={{ backgroundColor: buttonBg }}
          >
            <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
              Back to Home
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
