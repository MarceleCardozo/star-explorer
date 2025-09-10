import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import tw from '../utils/tailwind';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  animationDelay: number;
}

const { width, height } = Dimensions.get('window');

const StarField: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: new Animated.Value(Math.random()),
        animationDelay: Math.random() * 3000,
      });
    }
    setStars(newStars);

    const animations = newStars.map((star) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: 0.1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: 1,
            duration: 1000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animationsRef.current = animations;

    animations.forEach((animation, index) => {
      setTimeout(() => {
        animation.start();
      }, newStars[index].animationDelay);
    });

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);

  return (
    <View style={tw`absolute inset-0 bg-slate-900`}>
      {stars.map((star) => (
        <Animated.View
          key={star.id}
          style={[
            tw`absolute`,
            {
              left: star.x,
              top: star.y,
              opacity: star.opacity,
            },
          ]}
        >
          <View
            style={[
              tw`bg-white`,
              {
                width: star.size,
                height: star.size,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
          <View
            style={[
              tw`bg-white absolute`,
              {
                width: star.size * 0.3,
                height: star.size,
                left: (star.size - star.size * 0.3) / 2,
                top: 0,
              },
            ]}
          />
          <View
            style={[
              tw`bg-white absolute`,
              {
                width: star.size,
                height: star.size * 0.3,
                left: 0,
                top: (star.size - star.size * 0.3) / 2,
              },
            ]}
          />
        </Animated.View>
      ))}
      
      <View 
        style={[
          tw`absolute inset-0`,
          {
            backgroundColor: 'rgba(15, 23, 42, 0.2)',
          }
        ]} 
      />
    </View>
  );
};

export default StarField;