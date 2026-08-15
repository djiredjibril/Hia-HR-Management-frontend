import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { ClipPath, Defs, Ellipse, Rect } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const GUIDE_WIDTH = 230;
const GUIDE_HEIGHT = 290;
const SCAN_DURATION_MS = 3000;

type ScanState = 'idle' | 'scanning' | 'success';

export default function LiveAttendanceScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanState, setScanState] = useState<ScanState>('idle');

  const [sweepAnim] = useState(() => new Animated.Value(0));
  const [progressAnim] = useState(() => new Animated.Value(0));
  const sweepLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {
      sweepLoopRef.current?.stop();
    };
  }, []);

  const startScan = () => {
    setScanState('scanning');
    progressAnim.setValue(0);
    sweepAnim.setValue(0);

    sweepLoopRef.current = Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    sweepLoopRef.current.start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: SCAN_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      sweepLoopRef.current?.stop();
      setScanState('success');
      setTimeout(() => router.back(), 700);
    });
  };

  const sweepY = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-GUIDE_HEIGHT * 0.45, GUIDE_HEIGHT],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-primary-958">
      {permission?.granted && (
        <CameraView style={{ flex: 1, position: 'absolute', inset: 0 }} facing="front" />
      )}

      <View className="absolute inset-x-0 top-0 h-32 bg-black/30" pointerEvents="none" />
      <View className="absolute inset-x-0 bottom-0 h-56 bg-black/30" pointerEvents="none" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="flex-1 text-center font-quicksand-semibold text-lg text-white">
            Live Attendence
          </Text>
          <View className="h-10 w-10" />
        </View>

        {!permission ? null : !permission.granted ? (
          <View className="flex-1 items-center justify-center gap-4 px-10">
            <Text className="text-center font-quicksand-semibold text-base text-white">
              Camera access is required
            </Text>
            <Text className="text-center font-quicksand text-sm leading-6 text-primary-400">
              Enable camera access so we can verify your attendance with face recognition.
            </Text>
            <Pressable
              onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
              className="mt-2 rounded-full bg-white px-6 py-3 active:opacity-90"
            >
              <Text className="font-quicksand-semibold text-sm text-primary-928">
                {permission.canAskAgain ? 'Grant Camera Access' : 'Open Settings'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="flex-1 items-center justify-center">
              {scanState !== 'idle' && (
                <View style={{ width: GUIDE_WIDTH, height: GUIDE_HEIGHT }}>
                  <Svg width={GUIDE_WIDTH} height={GUIDE_HEIGHT}>
                    <Defs>
                      <ClipPath id="faceClip">
                        <Ellipse
                          cx={GUIDE_WIDTH / 2}
                          cy={GUIDE_HEIGHT / 2}
                          rx={GUIDE_WIDTH / 2 - 2}
                          ry={GUIDE_HEIGHT / 2 - 2}
                        />
                      </ClipPath>
                    </Defs>
                    <AnimatedRect
                      x={0}
                      y={sweepY}
                      width={GUIDE_WIDTH}
                      height={GUIDE_HEIGHT * 0.45}
                      fill="#34C759"
                      fillOpacity={0.35}
                      clipPath="url(#faceClip)"
                    />
                    <Ellipse
                      cx={GUIDE_WIDTH / 2}
                      cy={GUIDE_HEIGHT / 2}
                      rx={GUIDE_WIDTH / 2 - 2}
                      ry={GUIDE_HEIGHT / 2 - 2}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeDasharray="10,8"
                    />
                  </Svg>
                </View>
              )}
            </View>

            <View className="px-6 pb-6">
              <View className="items-center rounded-2xl bg-black/55 px-5 py-4">
                {scanState === 'idle' ? (
                  <Text className="text-center font-quicksand text-sm leading-6 text-white">
                    <Text className="font-quicksand-semibold">Click this button</Text> to start, and
                    ensure your camera is set up and ready
                  </Text>
                ) : scanState === 'scanning' ? (
                  <>
                    <Text className="font-quicksand-semibold text-base text-white">Hold still</Text>
                    <Text className="mt-1 text-center font-quicksand text-sm leading-6 text-primary-300">
                      Look directly into the camera while we verifying your face
                    </Text>
                  </>
                ) : (
                  <Text className="font-quicksand-semibold text-base text-success-400">
                    Face verified
                  </Text>
                )}
              </View>

              {scanState === 'idle' ? (
                <Pressable
                  onPress={startScan}
                  hitSlop={8}
                  className="mt-6 h-16 w-16 items-center self-center justify-center rounded-full border-4 border-white/40 active:opacity-80"
                >
                  <View className="h-12 w-12 rounded-full bg-white" />
                </Pressable>
              ) : (
                <View className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
                  <Animated.View
                    className="h-full rounded-full bg-success-500"
                    style={{ width: progressWidth }}
                  />
                </View>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
