import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Banner {
  _id: string;
  image_url: string;
}

interface Props {
  banners: Banner[];
  height?: number;
  interval?: number;
  onPress?: (item: Banner) => void;
}

export default function BannerSlider({
  banners,
  height = 180,
  interval = 3000,
  onPress,
}: Props) {
  const [index, setIndex] = useState(0);

  const translateCurrent = useRef(new Animated.Value(0)).current;
  const translateNext = useRef(new Animated.Value(width)).current;

  const timer = useRef<any>(1000);

  const animateTo = (nextIndex: number, direction = "next") => {
    translateCurrent.setValue(0);
    translateNext.setValue(
      direction === "next" ? width : -width
    );

    Animated.parallel([
      Animated.timing(translateCurrent, {
        toValue: direction === "next" ? -width : width,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.timing(translateNext, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(nextIndex);
      translateCurrent.setValue(0);
      translateNext.setValue(width);
    });
  };


  const nextSlide = () => {
    const next =
      index === banners.length - 1 ? 0 : index + 1;

    animateTo(next, "next");
  };


  const prevSlide = () => {
    const prev =
      index === 0 ? banners.length - 1 : index - 1;

    animateTo(prev, "prev");
  };


  useEffect(() => {
    if (banners.length < 2) return;

    timer.current = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer.current);

  }, [index, banners]);


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 20,

      onPanResponderRelease: (_, g) => {

        clearInterval(timer.current);

        if (g.dx < -50) {
          nextSlide();
        } else if (g.dx > 50) {
          prevSlide();
        }

      },
    })
  ).current;


  if (!banners.length) return null;


  const nextIndex =
    index === banners.length - 1 ? 0 : index + 1;


  return (
    <View
      {...panResponder.panHandlers}
      style={{
        overflow: "hidden",
      }}
    >

      <Animated.View
        style={{
          transform: [
            { translateX: translateCurrent }
          ],
        }}
      >
        <Pressable
          onPress={() => onPress?.(banners[index])}
        >
          <Image
            source={{
              uri: banners[index].image_url,
            }}
            style={{
              width: width * 0.92,
              height,
              alignSelf: "center",
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        </Pressable>
      </Animated.View>


      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: [
            { translateX: translateNext }
          ],
        }}
      >
        <Image
          source={{
            uri: banners[nextIndex].image_url,
          }}
          style={{
            width: width * 0.92,
            height,
            alignSelf: "center",
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
      </Animated.View>


      {/* dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {banners.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === index ? 18 : 6,
              height: 6,
              borderRadius: 3,
              marginHorizontal: 4,
              backgroundColor:
                i === index
                  ? "#FF0000"
                  : "#D1D5DB",
            }}
          />
        ))}
      </View>

    </View>
  );
}