import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image,
  FlatList
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Darker blue color scheme
const DARK_BLUE = '#041c33ff';  // Much darker blue
const LIGHT_TEXT = '#f0f4f8';  // Softer light text color
const ICON_COLOR = '#d9dde4ff';  // Light blue for icons

const slides = [
  {
    title: "Welcome to AllergyGuard",
    subtitle: "Your personal allergy protection companion",
    image: require('../assets/logo2.png'),
    showLogo: true
  },
  {
    title: "Scan Products Easily",
    subtitle: "Quickly scan food, cosmetics, or medicine to check for allergens.",
    icon: <MaterialIcons name="qr-code-scanner" size={120} color={ICON_COLOR} />,
  },
  {
    title: "Personalized Allergy Alerts",
    subtitle: "Get instant warnings if a product contains allergens that affect you.",
    icon: <MaterialCommunityIcons name="bell-alert" size={120} color={ICON_COLOR} />,
  },
  {
    title: "Chat with Experts",
    subtitle: "Connect with certified doctors or pharmacists for advice.",
    icon: <FontAwesome name="user-md" size={120} color={ICON_COLOR} />,
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BLUE,
  },
  slide: {
    width,
    height: height - 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_BLUE,
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 30,
    tintColor: LIGHT_TEXT,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: LIGHT_TEXT,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  iconContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: LIGHT_TEXT,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(240,244,248,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  bottomNav: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: DARK_BLUE,
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,196,255,0.1)',
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: 'rgba(240,244,248,0.7)',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(240,244,248,0.4)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(167,196,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167,196,255,0.3)',
  },
  buttonText: {
    color: LIGHT_TEXT,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Inter_600SemiBold',
  },
});

const AllergyGuardOnboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Signup');
    }
  };

  const skipToEnd = () => {
    navigation.navigate('Signup');
  };

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slideContent}>
          {index === 0 ? (
            <View style={styles.logoContainer}>
              <Image 
                source={item.image} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.welcomeText}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          ) : (
            <>
              <View style={styles.iconContainer}>
                {item.icon}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        ref={slidesRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
          }
        }}
        renderItem={renderSlide}
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.bottomNav}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={skipToEnd}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                { 
                  backgroundColor: index === currentIndex ? ICON_COLOR : 'rgba(240,244,248,0.2)',
                  width: index === currentIndex ? 12 : 8,
                }
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={scrollTo}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Feather 
            name={currentIndex === slides.length - 1 ? 'check' : 'arrow-right'} 
            size={20} 
            color={ICON_COLOR} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AllergyGuardOnboarding;