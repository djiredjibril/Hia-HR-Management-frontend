import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  AlarmClock,
  Bell,
  CalendarDays,
  ClipboardList,
  Ellipsis,
  HandCoins,
  LogIn,
  LogOut,
  MessagesSquare,
  NotebookPen,
  Power,
} from 'lucide-react-native';

import Items from '@/assets/svg/Bg icons/Items.svg';
import ItemsOne from '@/assets/svg/Bg icons/Items-1.svg';
import ItemsTwo from '@/assets/svg/Bg icons/Items-2.svg';

const CURRENT_USER = {
  name: 'Alex Johnson',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex.johnson@hia.com',
};

const TODAY_LABEL = new Date().toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const QUICK_ACTIONS: { label: string; Icon: typeof ClipboardList; color: string | null; href?: Href }[] = [
  { label: 'Payroll', Icon: ClipboardList, color: '#34C759' },
  { label: 'Payslip', Icon: HandCoins, color: '#F4715C', href: '/payslip_pin' },
  { label: 'Counseling', Icon: MessagesSquare, color: '#FF9F43' },
  { label: 'Time Off', Icon: NotebookPen, color: '#2FB551' },
  { label: 'Calendar', Icon: CalendarDays, color: '#FF3B30' },
  { label: 'Overtime', Icon: AlarmClock, color: '#14B8A6' },
  { label: 'Resign', Icon: Power, color: '#FF6259' },
  { label: 'Other', Icon: Ellipsis, color: null },
];

const ATTENDANCE = [
  {
    name: 'Brigette Whopper',
    role: 'Marketing Officer',
    time: '05:13 PM',
    type: 'out' as const,
    status: 'ontime' as const,
    avatarUrl: 'https://i.pravatar.cc/100?u=brigette-out',
  },
  {
    name: 'Johnny Deep',
    role: 'Lead Marketing',
    time: '08:23 AM',
    type: 'in' as const,
    status: 'late' as const,
    avatarUrl: 'https://i.pravatar.cc/100?u=johnny-deep',
  },
  {
    name: 'Brigette Whopper',
    role: 'Marketing Officer',
    time: '07:34 AM',
    type: 'in' as const,
    status: 'ontime' as const,
    avatarUrl: 'https://i.pravatar.cc/100?u=brigette-in',
  },
  {
    name: 'Van Der Sar',
    role: 'Quality Assurance',
    time: '07:19 AM',
    type: 'in' as const,
    status: 'ontime' as const,
    avatarUrl: 'https://i.pravatar.cc/100?u=van-der-sar',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const strongIconColor = colorScheme === 'dark' ? '#FFFFFF' : '#17181C';

  
  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View className="relative">
          <View className="overflow-hidden bg-primary-958 h-60 rounded-br-xl rounded-bl-xl" pointerEvents="box-none">
            <View className="absolute inset-0" pointerEvents="none">
              <Items width={203} height={262} color="#FFFFFF" style={{ position: 'absolute', top: -30, left: 200, opacity: 0.5 }} />
              <ItemsOne width={90} height={212} color="#FFFFFF" style={{ position: 'absolute', top: 5, right: -10, opacity: 0.35 }} />
              <ItemsTwo width={276} height={126} color="#FFFFFF" style={{ position: 'absolute', top: 10, right: 130, opacity: 0.6 }} />
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

          <View className="absolute inset-x-3" style={{ top: 120 }}>
            <View className="rounded-3xl bg-white px-5 pb-5 pt-5 dark:bg-primary-846">
              <View className="flex-row items-center justify-between">
                <Text className="font-quicksand text-sm text-primary-500 dark:text-primary-400">
                  Today&apos;s Overview
                </Text>
                <Pressable hitSlop={8}>
                  <Ellipsis size={18} color="#9BA0A6" />
                </Pressable>
              </View>
              <Text className="mt-1 font-quicksand-bold text-xl text-primary-900 dark:text-white">
                {TODAY_LABEL}
              </Text>

              <View className="mt-4 flex-row items-center rounded-2xl bg-[#F2F3F5] py-4">
                <View className="flex-1 items-center gap-1.5">
                  <Text className="font-quicksand text-xs text-primary-600">Clock In</Text>
                  <Text className="font-quicksand-bold text-lg text-primary-900">08.00 AM</Text>
                  <View className="rounded-full bg-white px-3 py-1">
                    <Text className="font-quicksand-medium text-[11px] text-success-700">
                      Done at 07.58 AM
                    </Text>
                  </View>
                </View>
                <View className="h-14 w-px bg-primary-300" />
                <View className="flex-1 items-center gap-1.5">
                  <Text className="font-quicksand text-xs text-primary-600">Clock Out</Text>
                  <Text className="font-quicksand-bold text-lg text-primary-900">05.00 PM</Text>
                  <View className="rounded-full bg-primary-928 px-3 py-1 dark:bg-white">
                    <Text className="font-quicksand-medium text-[11px] text-white dark:text-primary-928">
                      Not yet
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 70 }} />

        <View className="pt-10">
          <View className="mt-4 flex-row flex-wrap">
            {QUICK_ACTIONS.map(({ label, Icon, color, href }) => (
              <Pressable
                key={label}
                onPress={href ? () => router.push(href) : undefined}
                className="w-1/4 items-center gap-2 pb-6 active:opacity-80"
              >
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-primary-846">
                  <Icon size={24} strokeWidth={1.8} color={color ?? strongIconColor} />
                </View>
                <Text className="text-center font-quicksand-medium text-xs text-primary-900 dark:text-white">
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="px-6 pb-10">
          <View className="rounded-3xl bg-white px-5 py-5 shadow-sm shadow-black/5 dark:bg-primary-928">
            <View className="flex-row items-center justify-between">
              <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                Attendance Tracking
              </Text>
              <Pressable hitSlop={8}>
                <Text className="font-quicksand-medium text-sm text-primary-500">View all</Text>
              </Pressable>
            </View>

            <View className="mt-3">
              {ATTENDANCE.map((entry, index) => (
                <View
                  key={`${entry.name}-${entry.time}`}
                  className={`flex-row items-center justify-between py-3.5 ${
                    index < ATTENDANCE.length - 1 ? 'border-b border-primary-100 dark:border-primary-846' : ''
                  }`}
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <View>
                      <Image source={{ uri: entry.avatarUrl }} className="h-11 w-11 rounded-full" />
                      <View
                        className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-primary-928 ${
                          entry.type === 'in' ? 'bg-success-500' : 'bg-error-400'
                        }`}
                      >
                        {entry.type === 'in' ? (
                          <LogIn size={9} color="#FFFFFF" strokeWidth={2.5} />
                        ) : (
                          <LogOut size={9} color="#FFFFFF" strokeWidth={2.5} />
                        )}
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text
                        numberOfLines={1}
                        className="font-quicksand-semibold text-sm text-primary-900 dark:text-white"
                      >
                        {entry.name}
                      </Text>
                      <Text numberOfLines={1} className="font-quicksand text-xs text-primary-500">
                        {entry.role}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1.5 ${
                      entry.status === 'late' ? 'bg-error-50' : 'bg-success-50'
                    }`}
                  >
                    <Text
                      className={`font-quicksand-semibold text-xs ${
                        entry.status === 'late' ? 'text-error-600' : 'text-success-700'
                      }`}
                    >
                      {entry.time}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
