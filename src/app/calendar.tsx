import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { AlarmClock, ArrowLeft, ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react-native';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const HOLIDAYS: Record<string, string> = {
  '2023-09-16': 'Birthday of the Islamic Prophet Muhammad',
};

type CalendarEvent = {
  id: string;
  title: string;
  startHour: number;
  endHour: number;
  description: string;
  color: 'blue' | 'green';
};

const EVENTS: Record<string, CalendarEvent[]> = {
  '2023-09-29': [
    {
      id: 'clock-in',
      title: 'Clock In Time',
      startHour: 7,
      endHour: 10,
      description: 'you need to presence throught this app',
      color: 'blue',
    },
    {
      id: 'briefing',
      title: 'Breafing Team',
      startHour: 10,
      endHour: 11,
      description: 'To discuss what we should do on this week.',
      color: 'green',
    },
  ],
};

const EVENT_STYLES = {
  blue: { border: '#3B82F6', chipBg: '#EAF1FF', chipText: '#2F6FED' },
  green: { border: '#2FB551', chipBg: '#EBF9EE', chipText: '#258D5F' },
} as const;

const TIMELINE_START_HOUR = 7;
const TIMELINE_END_HOUR = 23;
const HOUR_WIDTH = 64;
const CARD_WIDTH = 188;
const ROW_HEIGHT = 118;

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatHourLabel(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  return `${String(normalized).padStart(2, '0')}.00`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function CalendarScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#17181C';
  const buttonBg = isDark ? '#FFFFFF' : '#17181C';
  const buttonTextColor = isDark ? '#17181C' : '#FFFFFF';

  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2023, 8, 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(2023, 8, 29));

  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekdaySunday = new Date(year, month, 1).getDay();
    const firstWeekday = (firstWeekdaySunday + 6) % 7; // convert Sun=0 to Mon=0 based week
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const cells: { date: Date; inCurrentMonth: boolean }[] = [];
    for (let i = firstWeekday - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
    }
    let nextMonthDay = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ date: new Date(year, month + 1, nextMonthDay), inCurrentMonth: false });
      nextMonthDay += 1;
    }
    return cells;
  }, [visibleMonth]);

  const monthHolidays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    return Object.entries(HOLIDAYS)
      .filter(([key]) => {
        const [holidayYear, holidayMonth] = key.split('-').map(Number);
        return holidayYear === year && holidayMonth - 1 === month;
      })
      .map(([key, label]) => ({ day: Number(key.split('-')[2]), label }));
  }, [visibleMonth]);

  const selectedDateKey = toDateKey(selectedDate);
  const dayEvents = EVENTS[selectedDateKey] ?? [];

  const hours = useMemo(() => {
    const list: number[] = [];
    for (let hour = TIMELINE_START_HOUR; hour <= TIMELINE_END_HOUR; hour++) list.push(hour);
    return list;
  }, []);

  const timelineWidth = (hours.length - 1) * HOUR_WIDTH + CARD_WIDTH;
  const timelineHeight = Math.max(dayEvents.length, 1) * ROW_HEIGHT;

  return (
    <View className="flex-1 bg-[#F2F3F5] dark:bg-primary-958">
      <SafeAreaView edges={['top']} className="bg-[#F2F3F5] dark:bg-primary-958">
        <View className="flex-row items-center px-4 pb-2 pt-2">
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color={iconColor} />
          </Pressable>
          <Text className="flex-1 text-center font-quicksand-semibold text-lg text-primary-900 dark:text-white">
            Calendar
          </Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-10">
        <View className="rounded-3xl bg-white px-5 py-5 shadow-sm shadow-black/5 dark:bg-primary-846">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full px-4 py-2.5" style={{ backgroundColor: buttonBg }}>
              <Text className="font-quicksand-semibold text-sm" style={{ color: buttonTextColor }}>
                {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                hitSlop={8}
                onPress={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronLeft size={18} color={iconColor} />
              </Pressable>
              <Pressable
                hitSlop={8}
                onPress={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronRight size={18} color={iconColor} />
              </Pressable>
            </View>
          </View>

          <View className="mt-5 flex-row">
            {WEEKDAY_LABELS.map((label) => (
              <View key={label} className="flex-1 items-center">
                <Text className="font-quicksand-medium text-xs text-primary-500">{label}</Text>
              </View>
            ))}
          </View>

          <View className="mt-2 flex-row flex-wrap">
            {calendarCells.map(({ date, inCurrentMonth }, index) => {
              const dateKey = toDateKey(date);
              const isWeekend = index % 7 === 5 || index % 7 === 6;
              const isHoliday = Boolean(HOLIDAYS[dateKey]);
              const isSelected = dateKey === selectedDateKey;

              let textColor = isDark ? '#FFFFFF' : '#202125';
              if (!inCurrentMonth) textColor = isDark ? '#4B4F54' : '#C4C7CB';
              else if (isHoliday || isWeekend) textColor = '#FF3B30';

              return (
                <View key={dateKey + index} style={{ width: `${100 / 7}%` }} className="items-center py-1">
                  <Pressable
                    onPress={() => inCurrentMonth && setSelectedDate(date)}
                    disabled={!inCurrentMonth}
                    className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                    style={{ backgroundColor: isSelected ? buttonBg : 'transparent' }}
                  >
                    <Text
                      className="font-quicksand-medium text-sm"
                      style={{ color: isSelected ? buttonTextColor : textColor }}
                    >
                      {date.getDate()}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          {monthHolidays.length > 0 && (
            <View className="mt-3 gap-1.5 border-t border-primary-100 pt-3 dark:border-primary-800">
              {monthHolidays.map((holiday) => (
                <View key={holiday.day} className="flex-row items-center gap-2">
                  <Text className="font-quicksand-semibold text-sm text-error-500">{holiday.day}</Text>
                  <Text className="flex-1 font-quicksand text-sm text-primary-500">{holiday.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text className="mb-3 mt-6 font-quicksand-semibold text-base text-primary-900 dark:text-white">
          {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>

        <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
          <View style={{ width: timelineWidth }}>
            <View className="flex-row">
              {hours.map((hour) => (
                <View key={hour} style={{ width: HOUR_WIDTH }} className="items-start">
                  <Text className="font-quicksand text-xs text-primary-500">{formatHourLabel(hour)}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: timelineHeight }} className="relative mt-3">
              <View className="absolute inset-0 flex-row">
                {hours.map((hour) => (
                  <View key={hour} style={{ width: HOUR_WIDTH }}>
                    <View className="h-full w-px bg-primary-200 dark:bg-primary-800" />
                  </View>
                ))}
              </View>

              {dayEvents.length === 0 ? (
                <Text className="mt-2 font-quicksand text-sm text-primary-500">No events scheduled for this day.</Text>
              ) : (
                dayEvents.map((event, index) => {
                  const style = EVENT_STYLES[event.color];
                  const left = (event.startHour - TIMELINE_START_HOUR) * HOUR_WIDTH;
                  return (
                    <View
                      key={event.id}
                      className="absolute overflow-hidden rounded-2xl border border-primary-100 bg-white p-3.5 dark:border-primary-800 dark:bg-primary-846"
                      style={{ left, top: index * ROW_HEIGHT, width: CARD_WIDTH, borderLeftWidth: 3, borderLeftColor: style.border }}
                    >
                      <View className="flex-row items-start justify-between">
                        <Text className="flex-1 font-quicksand-semibold text-sm text-primary-900 dark:text-white">
                          {event.title}
                        </Text>
                        <AlarmClock size={16} color="#FF3B30" />
                      </View>
                      <View className="mt-2 self-start rounded-full px-2.5 py-1" style={{ backgroundColor: style.chipBg }}>
                        <Text className="font-quicksand-semibold text-xs" style={{ color: style.chipText }}>
                          {formatHourLabel(event.startHour)} - {formatHourLabel(event.endHour)}
                        </Text>
                      </View>
                      <Text className="mt-2 font-quicksand text-xs leading-4 text-primary-500" numberOfLines={2}>
                        {event.description}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      <View className="bg-[#F2F3F5] px-6 pb-6 pt-2 dark:bg-primary-958">
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: buttonBg }}
        >
          <CirclePlus size={18} color={buttonTextColor} />
          <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
            Add event
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
