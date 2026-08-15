import { Redirect, Tabs, usePathname, useRouter } from 'expo-router';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Path, Svg } from 'react-native-svg';
import { ChartPie, House, Hourglass, Scan, User } from 'lucide-react-native';

import { getHasSession } from '@/lib/auth';
import { getHasSeenOnboarding } from '@/lib/onboarding';

const BAR_HEIGHT = 58;
const BAR_CORNER_RADIUS = 45;
const SCAN_BUTTON_SIZE = 56;
const SCAN_BUTTON_RADIUS = SCAN_BUTTON_SIZE / 2;
const NOTCH_GAP = 10;
const NOTCH_RADIUS = SCAN_BUTTON_RADIUS + NOTCH_GAP;
const NOTCH_FILLET = 16;
const NOTCH_DEPTH = NOTCH_RADIUS + 6;

function TabBarBackground({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: string;
}) {
  const notchCenterX = width / 2;
  const left = notchCenterX - NOTCH_RADIUS - NOTCH_FILLET;
  const right = notchCenterX + NOTCH_RADIUS + NOTCH_FILLET;

  const path = `
    M0,${BAR_CORNER_RADIUS}
    Q0,0 ${BAR_CORNER_RADIUS},0
    L${left},0
    C${left + NOTCH_FILLET},0 ${notchCenterX - NOTCH_RADIUS},${NOTCH_DEPTH} ${notchCenterX},${NOTCH_DEPTH}
    C${notchCenterX + NOTCH_RADIUS},${NOTCH_DEPTH} ${right - NOTCH_FILLET},0 ${right},0
    L${width - BAR_CORNER_RADIUS},0
    Q${width},0 ${width},${BAR_CORNER_RADIUS}
    L${width},${height}
    L0,${height}
    Z
  `;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      <Path d={path} fill={color} />
    </Svg>
  );
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isAttendScreen = pathname === '/attend';
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#FFFFFF' : '#17181C';
  const inactiveColor = '#9BA0A6';
  const barBackground = isDark ? '#17181C' : '#FFFFFF';
  const scanButtonBg = isDark ? '#FFFFFF' : '#17181C';
  const scanIconColor = isDark ? '#17181C' : '#FFFFFF';
  const barHeight = BAR_HEIGHT + insets.bottom;

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
          tabBarBackground: () => (
            <TabBarBackground width={width} height={barHeight} color={barBackground} />
          ),
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            height: barHeight,
            paddingTop: 10,
            paddingBottom: insets.bottom + 8,
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
            // Kept as an empty, normally-sized placeholder so the tab item's
            // layout/label position stays standard. The real button is the
            // absolutely-positioned Pressable below, floating over the notch.
            tabBarIcon: () => <View style={{ width: 22, height: 22 }} />,
            // The screen itself is a full-screen flow, not a tabbed view — hide the bar when it's focused.
            tabBarStyle: { display: 'none' },
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

      {!isAttendScreen && (
        <Pressable
          onPress={() => router.navigate('/attend')}
          hitSlop={8}
          className="items-center justify-center rounded-full active:opacity-90"
          style={{
            position: 'absolute',
            bottom: barHeight - SCAN_BUTTON_RADIUS,
            left: '50%',
            marginLeft: -SCAN_BUTTON_RADIUS,
            width: SCAN_BUTTON_SIZE,
            height: SCAN_BUTTON_SIZE,
            borderRadius: SCAN_BUTTON_RADIUS,
            backgroundColor: scanButtonBg,
          }}
        >
          <Scan color={scanIconColor} size={22} />
        </Pressable>
      )}
    </View>
  );
}
