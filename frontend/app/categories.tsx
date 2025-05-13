import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40) / 4; // 40 is total horizontal padding
const LABEL_MAX_WIDTH = ITEM_WIDTH - 8; // 8px padding for text

const MarqueeText: React.FC<{ text: string }> = ({ text }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<View>(null);
  const [textWidth, setTextWidth] = useState(0);
  const shouldAnimate = textWidth > LABEL_MAX_WIDTH;

  useEffect(() => {
    if (shouldAnimate) {
      const animateText = () => {
        scrollX.setValue(0);
        
        Animated.sequence([
          // Initial pause
          Animated.delay(1000),
          // Scroll to end - adjusted to ensure full visibility
          Animated.timing(scrollX, {
            toValue: -textWidth + (LABEL_MAX_WIDTH / 2), // Adjusted calculation
            duration: text.length * 200, // Slightly slower for better readability
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Pause at end
          Animated.delay(1500),
          // Quick reset
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ]).start(() => {
          animateText();
        });
      };

      animateText();
    }
    
    return () => {
      // Cleanup animation on unmount
      scrollX.stopAnimation();
    };
  }, [text, textWidth, shouldAnimate]);

  if (!shouldAnimate) {
    return (
      <Text className="text-xs font-medium text-center" numberOfLines={1}>
        {text}
      </Text>
    );
  }

  return (
    <View 
      ref={containerRef}
      style={{ width: LABEL_MAX_WIDTH, overflow: 'hidden' }}
      onLayout={() => {
        // Get the actual text width after layout
        const newTextWidth = text.length * 7; // Adjusted text width calculation
        setTextWidth(newTextWidth);
      }}
    >
      <Animated.Text
        className="text-xs font-medium"
        style={{
          transform: [{ translateX: scrollX }],
          width: textWidth + 20, // Add padding to ensure last character is visible
        }}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

// Rest of the Categories component remains the same
const Categories: React.FC = () => {
  return (
    <View>
      <Text>Categories Component</Text>
    </View>
  );
};

export default Categories;