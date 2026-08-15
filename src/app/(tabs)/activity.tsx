import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ArrowRight, ClipboardCheck, HeartCrack, ListFilter, Search, Smile } from 'lucide-react-native';

import Items from '@/assets/svg/Bg icons/Items.svg';
import ItemsOne from '@/assets/svg/Bg icons/Items-1.svg';
import ItemsTwo from '@/assets/svg/Bg icons/Items-2.svg';

type ActivityEntry =
  | {
      type: 'attendance';
      id: string;
      clockIn: string;
      clockOut: string | null;
    }
  | {
      type: 'payroll';
      id: string;
      period: string;
    }
  | {
      type: 'timeoff';
      id: string;
      reason: string;
    };

type ActivityGroup = {
  label: string;
  entries: ActivityEntry[];
};

const ACTIVITY_GROUPS: ActivityGroup[] = [
  {
    label: 'Today',
    entries: [{ type: 'attendance', id: 'today-attend', clockIn: '07.58 AM', clockOut: null }],
  },
  {
    label: 'Yesterday',
    entries: [
      { type: 'attendance', id: 'yesterday-attend', clockIn: '07.23 AM', clockOut: '05.12 PM' },
      { type: 'payroll', id: 'yesterday-payroll', period: 'September 2023' },
    ],
  },
  {
    label: 'Tuesday',
    entries: [{ type: 'timeoff', id: 'tuesday-timeoff', reason: 'Grandfather has passed away' }],
  },
  {
    label: 'Wednesday',
    entries: [{ type: 'attendance', id: 'wednesday-attend', clockIn: '08.14 AM', clockOut: '05.01 PM' }],
  },
  {
    label: '19 September 2023',
    entries: [{ type: 'attendance', id: 'sep19-attend', clockIn: '08.14 AM', clockOut: '05.01 PM' }],
  },
];

export default function ActivityScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <View className="overflow-hidden bg-primary-928 rounded-br-xl rounded-bl-xl pb-6" pointerEvents="box-none">
        <View className="absolute inset-0" pointerEvents="none">
          <Items width={203} height={262} color="#FFFFFF" style={{ position: 'absolute', top: -30, left: 200, opacity: 0.5 }} />
          <ItemsOne width={90} height={212} color="#FFFFFF" style={{ position: 'absolute', top: 5, right: -10, opacity: 0.35 }} />
          <ItemsTwo width={276} height={126} color="#FFFFFF" style={{ position: 'absolute', top: 10, right: 130, opacity: 0.6 }} />
        </View>

        <SafeAreaView edges={['top']}>
          <Text className="mt-4 text-center font-quicksand-semibold text-lg text-white">Activity</Text>

          <View className="mt-4 flex-row items-center gap-3 px-6">
            <View className="flex-1 flex-row items-center gap-2 rounded-2xl bg-white/10 px-4 py-3">
              <Search size={18} color="#9BA0A6" />
              <TextInput
                placeholder="Search your payslip, attendence..."
                placeholderTextColor="#9BA0A6"
                className="flex-1 font-quicksand text-sm text-white"
              />
            </View>
            <Pressable
              hitSlop={8}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10 active:opacity-80"
            >
              <ListFilter size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pb-10 pt-5"
      >
        {ACTIVITY_GROUPS.map((group) => (
          <View key={group.label} className="mb-5">
            <Text className="mb-2 px-1 font-quicksand text-xs text-primary-500">{group.label}</Text>
            <View className="gap-3">
              {group.entries.map((entry) => (
                <ActivityRow key={entry.id} entry={entry} isDark={isDark} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ActivityRow({ entry, isDark }: { entry: ActivityEntry; isDark: boolean }) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm shadow-black/5 dark:bg-primary-846">
      <ActivityIcon entry={entry} />
      <View className="flex-1">
        <Text className="font-quicksand-semibold text-sm text-primary-900 dark:text-white">
          {entry.type === 'attendance' && 'Attendance Check'}
          {entry.type === 'payroll' && 'Payroll'}
          {entry.type === 'timeoff' && 'Time Off'}
        </Text>

        {entry.type === 'attendance' && (
          <View className="mt-1 flex-row items-center gap-1.5">
            <Text className="font-quicksand text-xs text-primary-500">{entry.clockIn}</Text>
            <ArrowRight size={12} color={isDark ? '#5F6267' : '#BDC0C5'} />
            <Text className="font-quicksand text-xs text-primary-500">{entry.clockOut ?? 'not yet'}</Text>
          </View>
        )}
        {entry.type === 'payroll' && (
          <Text className="mt-1 font-quicksand text-xs text-primary-500">{entry.period}</Text>
        )}
        {entry.type === 'timeoff' && (
          <Text numberOfLines={1} className="mt-1 font-quicksand text-xs text-primary-500">
            {entry.reason}
          </Text>
        )}
      </View>
    </View>
  );
}

function ActivityIcon({ entry }: { entry: ActivityEntry }) {
  if (entry.type === 'attendance') {
    return (
      <View className="h-11 w-11 items-center justify-center rounded-2xl border border-success-200 bg-success-50">
        <Smile size={20} color="#2FB551" />
      </View>
    );
  }

  if (entry.type === 'payroll') {
    return (
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#3B82F6]">
        <ClipboardCheck size={20} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-error-500">
      <HeartCrack size={20} color="#FFFFFF" />
    </View>
  );
}
