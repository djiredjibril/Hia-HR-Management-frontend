import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, ScanFace } from 'lucide-react-native';

import BgIconLeft from '@/assets/svg/Bg icons/bg-icon-left.svg';
import BgIconRightMiddle from '@/assets/svg/Bg icons/bg-icon-right-middle.svg';

export default function AttendScreen() {
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
        <View className="flex-row items-center px-4 pt-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <Text className="flex-1 text-center font-quicksand-semibold text-lg text-primary-900 dark:text-white">
            Attendance Check
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="font-quicksand text-base text-primary-600 dark:text-primary-400">
            Clock In
          </Text>
          <Text className="font-quicksand-bold text-3xl text-success-500">08.00 AM</Text>

          <View className="mt-6 h-28 w-28 items-center justify-center rounded-full bg-primary-928 dark:bg-white">
            <ScanFace size={48} color={isDark ? '#17181C' : '#FFFFFF'} strokeWidth={1.6} />
          </View>

          <Text className="mt-6 font-quicksand-bold text-2xl text-primary-900 dark:text-white">
            Face Recognition
          </Text>
          <Text className="text-center font-quicksand text-sm leading-6 text-primary-500">
            Ensure you are currently at the office and in well-lit surroundings for optimal face
            recognition.
          </Text>
        </View>

        <View className="px-6 pb-4">
          <Pressable
            onPress={() => router.push('/live-attendance')}
            className="items-center rounded-full py-4 active:opacity-90"
            style={{ backgroundColor: buttonBg }}
          >
            <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
              Start Live Attendence
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
