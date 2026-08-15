import { Redirect, Tabs, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ChartPie, House, Hourglass, Scan, User } from 'lucide-react-native';

import { getHasSession } from '@/lib/auth';
import { getHasSeenOnboarding } from '@/lib/onboarding';

const BAR_HEIGHT = 58;
const SCAN_BUTTON_SIZE = 56;

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#FFFFFF' : '#17181C';
  const inactiveColor = '#9BA0A6';
  const barBackground = isDark ? '#17181C' : '#FFFFFF';
  const scanButtonBg = isDark ? '#FFFFFF' : '#17181C';
  const scanIconColor = isDark ? '#17181C' : '#FFFFFF';

  if (!getHasSeenOnboarding()) {
    return <Redirect href="/onboarding" />;
  }

  if (!getHasSession()) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarLabelStyle: { fontFamily: 'Quicksand_600SemiBold', fontSize: 11 },
          tabBarStyle: {
            backgroundColor: barBackground,
            borderTopWidth: 0,
            height: BAR_HEIGHT + insets.bottom,
            paddingTop: 10,
            paddingBottom: insets.bottom + 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: { width: 0, height: 0 },
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused, size }) => (
              <House color={color} size={size} fill={focused ? color : 'none'} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytic"
          options={{
            title: 'Analytic',
            tabBarIcon: ({ color, size }) => <ChartPie color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="attend"
          options={{
            title: 'Attend',
            // Kept as an empty, normally-sized placeholder so the tab bar's own
            // shape/shadow stays a plain rectangle. The real button is the
            // absolutely-positioned Pressable below, floating on top of it.
            tabBarIcon: () => <View style={{ width: 22, height: 22 }} />,
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, size }) => <Hourglass color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused, size }) => (
              <User color={color} size={size} fill={focused ? color : 'none'} />
            ),
          }}
        />
      </Tabs>

      <Pressable
        onPress={() => router.navigate('/attend')}
        hitSlop={8}
        className="items-center justify-center rounded-full active:opacity-90"
        style={{
          position: 'absolute',
          bottom: insets.bottom + BAR_HEIGHT - SCAN_BUTTON_SIZE / 2,
          left: '50%',
          marginLeft: -SCAN_BUTTON_SIZE / 2,
          width: SCAN_BUTTON_SIZE,
          height: SCAN_BUTTON_SIZE,
          borderRadius: SCAN_BUTTON_SIZE / 2,
          backgroundColor: scanButtonBg,
        }}
      >
        <Scan color={scanIconColor} size={22} />
      </Pressable>
    </View>
  );
}
