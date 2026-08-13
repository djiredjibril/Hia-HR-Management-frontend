import { Redirect } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  LogIn,
  Users,
  Wallet,
} from 'lucide-react-native';

import { getHasSession } from '@/lib/auth';
import { getHasSeenOnboarding } from '@/lib/onboarding';

import Items from '@/assets/svg/Bg icons/Items.svg';
import ItemsOne from '@/assets/svg/Bg icons/Items-1.svg';
import ItemsTwo from '@/assets/svg/Bg icons/Items-2.svg';

const CURRENT_USER = {
  name: 'Alex Johnson',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex.johnson@hia.com',
};

const QUICK_ACTIONS = [
  { label: 'Attendance', Icon: Clock },
  { label: 'Time Off', Icon: CalendarDays },
  { label: 'Payslip', Icon: Wallet },
  { label: 'Team', Icon: Users },
];

const UPCOMING = [
  { title: 'Team Standup', time: 'Today, 10:00 AM' },
  { title: 'Payday', time: 'Aug 28, 2026' },
];

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const mutedIconColor = colorScheme === 'dark' ? '#9BA0A6' : '#5F6267';

  if (!getHasSeenOnboarding()) {
    return <Redirect href="/onboarding" />;
  }

  if (!getHasSession()) {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-primary-958">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden bg-primary-958 pb-16" pointerEvents="box-none">
          <View className="absolute inset-0" pointerEvents="none">
            <Items width={203} height={262} color="#FFFFFF" style={{ position: 'absolute', top: -30, left: 200, opacity: 0.5 }} />
            <ItemsOne width={90} height={212} color="#FFFFFF" style={{ position: 'absolute', top: 5, right: -10, opacity: 0.35 }} />
            <ItemsTwo width={276} height={126} color="#FFFFFF" style={{ position: 'absolute', bottom: -30, right: 180, opacity: 0.6 }} />
          </View>

          <SafeAreaView edges={['top']}>
            <View className="flex-row items-center justify-between px-6 pt-4">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: CURRENT_USER.avatarUrl }}
                  className="h-12 w-12 rounded-full border border-white/20"
                />
                <View>
                  <Text className="font-quicksand text-[13px] text-primary-400">Good morning</Text>
                  <Text className="font-quicksand-bold text-lg text-white">{CURRENT_USER.name}</Text>
                </View>
              </View>
              <Pressable
                hitSlop={8}
                className="h-11 w-11 items-center justify-center rounded-full bg-white/10 active:opacity-80"
              >
                <Bell size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="-mt-10 px-6">
          <View className="flex-row items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-lg shadow-black/10 dark:bg-primary-928">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-846">
                <Clock size={20} color={mutedIconColor} />
              </View>
              <View>
                <Text className="font-quicksand text-xs text-primary-500">You&apos;re clocked out</Text>
                <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                  Ready to start your day?
                </Text>
              </View>
            </View>
            <Pressable className="flex-row items-center gap-1.5 rounded-full bg-primary-928 px-4 py-2.5 active:opacity-90 dark:bg-white">
              <LogIn size={16} color={colorScheme === 'dark' ? '#17181C' : '#FFFFFF'} />
              <Text className="font-quicksand-semibold text-sm text-white dark:text-primary-928">
                Clock In
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="px-6 pt-8">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Quick actions
          </Text>
          <View className="mt-4 flex-row justify-between">
            {QUICK_ACTIONS.map(({ label, Icon }) => (
              <Pressable key={label} className="items-center gap-2 active:opacity-80">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-846">
                  <Icon size={22} color={mutedIconColor} />
                </View>
                <Text className="font-quicksand text-xs text-primary-600 dark:text-primary-400">
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="px-6 pb-10 pt-8">
          <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
            Upcoming
          </Text>
          <View className="mt-4 gap-3">
            {UPCOMING.map(({ title, time }) => (
              <View
                key={title}
                className="flex-row items-center justify-between rounded-2xl border border-primary-200 px-4 py-3.5 dark:border-primary-800"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-846">
                    <FileText size={18} color={mutedIconColor} />
                  </View>
                  <View>
                    <Text className="font-quicksand-medium text-sm text-primary-900 dark:text-white">
                      {title}
                    </Text>
                    <Text className="font-quicksand text-xs text-primary-500">{time}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={mutedIconColor} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
