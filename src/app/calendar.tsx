import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  AlarmClock,
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
} from 'lucide-react-native';

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

const INITIAL_EVENTS: Record<string, CalendarEvent[]> = {
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

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildTimeOptions() {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      options.push(`${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`);
    }
  }
  return options;
}

const TIME_OPTIONS = buildTimeOptions();

function parseTimeLabelToHour(label: string) {
  const match = label.match(/(\d{2}):(\d{2}) (AM|PM)/);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10) / 60;
  const period = match[3];
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minute;
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
  const [events, setEvents] = useState(INITIAL_EVENTS);

  const [isAddEventOpen, setAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date(2023, 8, 29));
  const [eventStartTime, setEventStartTime] = useState('12:00 PM');
  const [eventEndTime, setEventEndTime] = useState('01:00 PM');

  const [isEventDatePickerOpen, setEventDatePickerOpen] = useState(false);
  const [eventCalendarMonth, setEventCalendarMonth] = useState(() => new Date(2023, 8, 1));
  const [eventTimeField, setEventTimeField] = useState<'start' | 'end' | null>(null);

  const eventCalendarDays = useMemo(() => {
    const year = eventCalendarMonth.getFullYear();
    const month = eventCalendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDays = getDaysInMonth(year, month);
    const cells: (number | null)[] = Array.from({ length: firstWeekday }, () => null);
    for (let day = 1; day <= totalDays; day++) cells.push(day);
    return cells;
  }, [eventCalendarMonth]);

  const openAddEvent = () => {
    setEventTitle('');
    setEventDate(selectedDate);
    setEventCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setEventStartTime('12:00 PM');
    setEventEndTime('01:00 PM');
    setAddEventOpen(true);
  };

  const canCreateEvent = eventTitle.trim().length > 0;

  const handleCreateEvent = () => {
    if (!canCreateEvent) return;
    const dateKey = toDateKey(eventDate);
    const newEvent: CalendarEvent = {
      id: `${dateKey}-${Date.now()}`,
      title: eventTitle.trim(),
      startHour: parseTimeLabelToHour(eventStartTime),
      endHour: parseTimeLabelToHour(eventEndTime),
      description: '',
      color: 'blue',
    };
    setEvents((prev) => ({ ...prev, [dateKey]: [...(prev[dateKey] ?? []), newEvent] }));
    setSelectedDate(eventDate);
    setVisibleMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1));
    setAddEventOpen(false);
  };

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
  const dayEvents = events[selectedDateKey] ?? [];

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
                      {event.description.length > 0 && (
                        <Text className="mt-2 font-quicksand text-xs leading-4 text-primary-500" numberOfLines={2}>
                          {event.description}
                        </Text>
                      )}
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
          onPress={openAddEvent}
          className="flex-row items-center justify-center gap-2 rounded-full py-4 active:opacity-90"
          style={{ backgroundColor: buttonBg }}
        >
          <CirclePlus size={18} color={buttonTextColor} />
          <Text className="font-quicksand-semibold text-base" style={{ color: buttonTextColor }}>
            Add event
          </Text>
        </Pressable>
      </View>

      <Modal visible={isAddEventOpen} transparent animationType="slide" onRequestClose={() => setAddEventOpen(false)}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setAddEventOpen(false)}>
          <Pressable
            className="rounded-t-3xl bg-white px-6 pb-6 pt-6 dark:bg-primary-928"
            onPress={(event) => event.stopPropagation()}
          >
            <Text className="text-center font-quicksand-semibold text-lg text-primary-900 dark:text-white">
              Add New Event
            </Text>

            <Text className="mt-5 font-quicksand-semibold text-sm text-primary-900 dark:text-white">Title</Text>
            <TextInput
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="e.g. Brainstorming with Lead"
              placeholderTextColor="#9BA0A6"
              className="mt-2 rounded-2xl border border-primary-300 px-4 py-3.5 font-quicksand text-sm text-primary-900 dark:border-primary-800 dark:text-white"
            />

            <Text className="mt-4 font-quicksand-semibold text-sm text-primary-900 dark:text-white">
              Activity Date
            </Text>
            <Pressable
              onPress={() => {
                setEventCalendarMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1));
                setEventDatePickerOpen(true);
              }}
              className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
            >
              <Text className="font-quicksand text-sm text-primary-900 dark:text-white">{formatDate(eventDate)}</Text>
              <Calendar size={18} color="#9BA0A6" />
            </Pressable>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Text className="font-quicksand-semibold text-sm text-primary-900 dark:text-white">Start Time</Text>
                <Pressable
                  onPress={() => setEventTimeField('start')}
                  className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
                >
                  <Text className="font-quicksand text-sm text-primary-900 dark:text-white">{eventStartTime}</Text>
                  <ChevronDown size={18} color="#9BA0A6" />
                </Pressable>
              </View>
              <View className="flex-1">
                <Text className="font-quicksand-semibold text-sm text-primary-900 dark:text-white">End Time</Text>
                <Pressable
                  onPress={() => setEventTimeField('end')}
                  className="mt-2 flex-row items-center justify-between rounded-2xl border border-primary-300 px-4 py-3.5 active:opacity-80 dark:border-primary-800"
                >
                  <Text className="font-quicksand text-sm text-primary-900 dark:text-white">{eventEndTime}</Text>
                  <ChevronDown size={18} color="#9BA0A6" />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleCreateEvent}
              disabled={!canCreateEvent}
              className="mt-6 items-center rounded-full py-4 active:opacity-90"
              style={{ backgroundColor: canCreateEvent ? buttonBg : '#DBDCE0' }}
            >
              <Text
                className="font-quicksand-semibold text-base"
                style={{ color: canCreateEvent ? buttonTextColor : '#81868C' }}
              >
                Create Event
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={isEventDatePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEventDatePickerOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/40 px-6"
          onPress={() => setEventDatePickerOpen(false)}
        >
          <Pressable className="w-full rounded-3xl bg-white p-5 dark:bg-primary-928" onPress={(event) => event.stopPropagation()}>
            <View className="flex-row items-center justify-between">
              <Pressable
                hitSlop={8}
                onPress={() => setEventCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronLeft size={18} color={iconColor} />
              </Pressable>
              <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
                {eventCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() => setEventCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
              >
                <ChevronRight size={18} color={iconColor} />
              </Pressable>
            </View>

            <View className="mt-4 flex-row">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
                <View key={`${label}-${index}`} className="flex-1 items-center">
                  <Text className="font-quicksand-medium text-xs text-primary-500">{label}</Text>
                </View>
              ))}
            </View>

            <View className="mt-2 flex-row flex-wrap">
              {eventCalendarDays.map((day, index) => {
                const isSelected =
                  day !== null &&
                  eventDate.getFullYear() === eventCalendarMonth.getFullYear() &&
                  eventDate.getMonth() === eventCalendarMonth.getMonth() &&
                  eventDate.getDate() === day;
                return (
                  <View key={index} style={{ width: `${100 / 7}%` }} className="items-center py-1">
                    {day !== null ? (
                      <Pressable
                        onPress={() => {
                          setEventDate(new Date(eventCalendarMonth.getFullYear(), eventCalendarMonth.getMonth(), day));
                          setEventDatePickerOpen(false);
                        }}
                        className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
                        style={{ backgroundColor: isSelected ? buttonBg : 'transparent' }}
                      >
                        <Text
                          className="font-quicksand-medium text-sm"
                          style={{ color: isSelected ? buttonTextColor : isDark ? '#FFFFFF' : '#202125' }}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ) : (
                      <View className="h-9 w-9" />
                    )}
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={eventTimeField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEventTimeField(null)}
      >
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={() => setEventTimeField(null)}>
          <Pressable
            className="max-h-[70%] w-full rounded-3xl bg-white p-5 dark:bg-primary-928"
            onPress={(event) => event.stopPropagation()}
          >
            <Text className="font-quicksand-semibold text-base text-primary-900 dark:text-white">
              Select {eventTimeField === 'start' ? 'start' : 'end'} time
            </Text>
            <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
              {TIME_OPTIONS.map((option) => {
                const selected = eventTimeField === 'start' ? option === eventStartTime : option === eventEndTime;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      if (eventTimeField === 'start') setEventStartTime(option);
                      else setEventEndTime(option);
                      setEventTimeField(null);
                    }}
                    className="rounded-xl px-3 py-3 active:opacity-70"
                    style={{ backgroundColor: selected ? (isDark ? '#3C4043' : '#F2F3F5') : 'transparent' }}
                  >
                    <Text
                      className="font-quicksand-medium text-sm"
                      style={{ color: selected ? (isDark ? '#FFFFFF' : '#17181C') : isDark ? '#BDC0C5' : '#5F6267' }}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
