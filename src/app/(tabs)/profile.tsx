import { Fragment } from 'react';
import { Image, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  Bell,
  Briefcase,
  Camera,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  KeyRound,
  LayoutGrid,
  LogOut,
  Moon,
  ScanFace,
  User,
} from 'lucide-react-native';

import Items from '@/assets/svg/Bg icons/Items.svg';
import ItemsOne from '@/assets/svg/Bg icons/Items-1.svg';
import ItemsTwo from '@/assets/svg/Bg icons/Items-2.svg';
import { clearSession } from '@/lib/auth';

const CURRENT_USER = {
  name: 'Alex Johnson',
  role: 'Marketing Officer',
  employeeId: 'DE3824-MO4',
  company: 'Hia',
  since: 2021,
  avatarUrl: 'https://i.pravatar.cc/150?u=alex.johnson@hia.com',
};

type ProfileRow = {
  label: string;
  Icon: typeof User;
  onPress?: () => void;
  danger?: boolean;
};

type ProfileSection = {
  title: string;
  rows: ProfileRow[];
};

export default function ProfileScreen() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const chevronColor = isDark ? '#5F6267' : '#BDC0C5';

  const sections: ProfileSection[] = [
    {
      title: 'General',
      rows: [
        { label: 'Account Setting', Icon: User },
        { label: 'Notification', Icon: Bell },
        { label: 'Face Verification', Icon: ScanFace },
        { label: 'Set up your PIN', Icon: KeyRound },
        { label: 'Language', Icon: Globe },
      ],
    },
    {
      title: 'Company',
      rows: [
        { label: 'My Company', Icon: Briefcase },
        { label: 'Structure', Icon: LayoutGrid },
      ],
    },
    {
      title: 'About',
      rows: [
        { label: 'Help Center', Icon: HelpCircle },
        { label: 'Privacy Policy', Icon: FileText },
        {
          label: 'Logout',
          Icon: LogOut,
          danger: true,
          onPress: () => {
            clearSession().then(() => router.replace('/login'));
          },
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden bg-primary-928 rounded-br-xl rounded-bl-xl" pointerEvents="box-none">
          <View className="absolute inset-0" pointerEvents="none">
            <Items width={203} height={262} color="#FFFFFF" style={{ position: 'absolute', top: -30, left: 200, opacity: 0.5 }} />
            <ItemsOne width={90} height={212} color="#FFFFFF" style={{ position: 'absolute', top: 5, right: -10, opacity: 0.35 }} />
            <ItemsTwo width={276} height={126} color="#FFFFFF" style={{ position: 'absolute', top: 10, right: 130, opacity: 0.6 }} />
          </View>

          <SafeAreaView edges={['top']}>
            <View className="items-center px-6 pb-6 pt-4">
              <View className="relative">
                <Image
                  source={{ uri: CURRENT_USER.avatarUrl }}
                  className="h-24 w-24 rounded-full border border-white/20"
                />
                <Pressable
                  hitSlop={8}
                  className="absolute -bottom-1 -right-1 h-9 w-9 items-center justify-center rounded-full bg-white active:opacity-80"
                >
                  <Camera size={16} color="#17181C" />
                </Pressable>
              </View>

              <Text className="mt-4 font-quicksand-bold text-lg text-white">{CURRENT_USER.name}</Text>
              <Text className="mt-1 font-quicksand text-sm text-primary-400">
                {CURRENT_USER.role} • {CURRENT_USER.employeeId}
              </Text>
              <Text className="mt-0.5 font-quicksand text-sm text-primary-400">
                At {CURRENT_USER.company}. since {CURRENT_USER.since}
              </Text>
            </View>
          </SafeAreaView>
        </View>

        <SafeAreaView edges={['bottom']} className="px-6 pb-4 pt-6">
          {sections.map((section) => (
            <View key={section.title} className="mb-6">
              <Text className="mb-2 px-1 font-quicksand-medium text-xs uppercase text-primary-500">
                {section.title}
              </Text>
              <View className="rounded-3xl bg-white shadow-sm shadow-black/5 dark:bg-primary-846">
                {section.rows.map((row, index) => (
                  <Fragment key={row.label}>
                    {index > 0 && (
                      <View className="ml-[52px] h-px bg-primary-100 dark:bg-primary-928" />
                    )}
                    <Pressable
                      onPress={row.onPress}
                      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-70"
                    >
                      <View
                        className={`h-9 w-9 items-center justify-center rounded-full ${
                          row.danger ? 'bg-error-50 dark:bg-error-900' : 'bg-[#F2F3F5] dark:bg-primary-928'
                        }`}
                      >
                        <row.Icon
                          size={18}
                          color={row.danger ? '#FF3B30' : isDark ? '#FFFFFF' : '#17181C'}
                        />
                      </View>
                      <Text
                        className={`flex-1 font-quicksand-medium text-sm ${
                          row.danger ? 'text-error-500' : 'text-primary-900 dark:text-white'
                        }`}
                      >
                        {row.label}
                      </Text>
                      <ChevronRight size={18} color={chevronColor} />
                    </Pressable>
                  </Fragment>
                ))}

                {section.title === 'General' && (
                  <>
                    <View className="ml-[52px] h-px bg-primary-100 dark:bg-primary-928" />
                    <View className="flex-row items-center gap-3 px-4 py-3.5">
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F2F3F5] dark:bg-primary-928">
                        <Moon size={18} color={isDark ? '#FFFFFF' : '#17181C'} />
                      </View>
                      <Text className="flex-1 font-quicksand-medium text-sm text-primary-900 dark:text-white">
                        Dark Mode
                      </Text>
                      <Switch
                        value={isDark}
                        onValueChange={toggleColorScheme}
                        trackColor={{ false: '#DBDCE0', true: '#34C759' }}
                        thumbColor="#FFFFFF"
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
