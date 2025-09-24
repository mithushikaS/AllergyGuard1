import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const FOOD_ALLERGY_CATEGORIES = [
  { id: '1', name: 'Nuts', icon: 'tree', color: '#F59E0B', iconFamily: 'FontAwesome' },
  { id: '2', name: 'Dairy', icon: 'glass', color: '#38B2AC', iconFamily: 'FontAwesome' },
  { id: '3', name: 'Seafood', icon: 'fish', color: '#4F46E5', iconFamily: 'MaterialCommunityIcons' },
  { id: '4', name: 'Gluten', icon: 'grain', color: '#D97706', iconFamily: 'MaterialCommunityIcons' },
  { id: '5', name: 'Eggs', icon: 'egg', color: '#10B981', iconFamily: 'MaterialCommunityIcons' },
  { id: '6', name: 'Soy', icon: 'grain', color: '#7C3AED', iconFamily: 'MaterialCommunityIcons' },
  { id: '7', name: 'Seeds', icon: 'grain', color: '#DC2626', iconFamily: 'MaterialCommunityIcons' },
];

const QUESTIONS = [
  {
    id: 1,
    question: "Which foods are you allergic to?",
    type: "selection",
    categories: FOOD_ALLERGY_CATEGORIES,
    required: true
  },
  {
    id: 2,
    question: "Do you have any specific nut allergies?",
    type: "text",
    placeholder: "e.g., Peanuts, Almonds, Walnuts, Cashews",
    required: true
  },
  {
    id: 3,
    question: "Are you allergic to any specific fruits or vegetables?",
    type: "text",
    placeholder: "e.g., Strawberries, Tomatoes, Kiwi, Avocado",
    required: true
  },
  {
    id: 4,
    question: "Do you have any grain or cereal allergies beyond gluten?",
    type: "text",
    placeholder: "e.g., Wheat, Barley, Oats, Corn, Rice",
    required: true
  },
  {
    id: 5,
    question: "Have you experienced severe food allergic reactions before?",
    type: "boolean",
    required: true
  },
  {
    id: 6,
    question: "Any other food allergies or food sensitivities?",
    type: "text",
    placeholder: "Please specify any additional food allergies or intolerances",
    required: true
  }
];

const AllergyQAScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();
  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleCategorySelection = (category) => {
    const exists = selectedAllergies.find(item => item.id === category.id);
    if (exists) {
      setSelectedAllergies(selectedAllergies.filter(item => item.id !== category.id));
    } else {
      setSelectedAllergies([...selectedAllergies, { ...category, severity: 'Moderate' }]);
    }
  };

  const updateAllergySeverity = (categoryId, severity) => {
    setSelectedAllergies(
      selectedAllergies.map(allergy =>
        allergy.id === categoryId ? { ...allergy, severity } : allergy
      )
    );
  };

  const validateCurrentAnswer = () => {
    if (!currentQuestion.required) return true;

    if (currentQuestion.type === 'selection') {
      return selectedAllergies.length > 0;
    } else if (currentQuestion.type === 'text') {
      return textInput.trim().length > 0;
    }
    return true; // Boolean questions are handled by buttons
  };

  const handleNext = () => {
    // Validate required fields
    if (currentQuestion.required && !validateCurrentAnswer()) {
      Toast.show({
        type: 'error',
        text1: 'Required Field',
        text2: 'Please answer this question before proceeding.'
      });
      return;
    }

    // Save current answer
    let currentAnswer = '';
    
    if (currentQuestion.type === 'selection') {
      currentAnswer = selectedAllergies;
    } else if (currentQuestion.type === 'text') {
      currentAnswer = textInput.trim();
    } else if (currentQuestion.type === 'boolean') {
      // Boolean answer will be handled by the Yes/No buttons
      return;
    }

    setAnswers({ ...answers, [currentQuestion.id]: currentAnswer });

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextInput('');
      setSelectedAllergies([]);
    } else {
      handleFinish();
    }
  };

  const handleBooleanAnswer = (answer) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextInput('');
      setSelectedAllergies([]);
    } else {
      handleFinish(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTextInput('');
      setSelectedAllergies([]);
    }
  };

  const handleFinish = async (finalAnswers = answers) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Process all answers to create food allergies array
      let userAllergies = [];
      let allergyIdCounter = 1;

      // Process main food allergies (question 1)
      if (finalAnswers[1] && Array.isArray(finalAnswers[1])) {
        finalAnswers[1].forEach(allergy => {
          userAllergies.push({
            id: allergyIdCounter++,
            name: allergy.name,
            severity: allergy.severity,
            category: 'Food',
            source: 'Q&A Setup'
          });
        });
      }

      // Process specific nut allergies (question 2)
      if (finalAnswers[2] && finalAnswers[2].trim()) {
        const nuts = finalAnswers[2].split(',').map(nut => nut.trim()).filter(nut => nut);
        nuts.forEach(nut => {
          userAllergies.push({
            id: allergyIdCounter++,
            name: nut,
            severity: 'Moderate',
            category: 'Food',
            subcategory: 'Nuts',
            source: 'Q&A Setup'
          });
        });
      }

      // Process fruit/vegetable allergies (question 3)
      if (finalAnswers[3] && finalAnswers[3].trim()) {
        const fruits = finalAnswers[3].split(',').map(fruit => fruit.trim()).filter(fruit => fruit);
        fruits.forEach(fruit => {
          userAllergies.push({
            id: allergyIdCounter++,
            name: fruit,
            severity: 'Mild',
            category: 'Food',
            subcategory: 'Fruits & Vegetables',
            source: 'Q&A Setup'
          });
        });
      }

      // Process grain/cereal allergies (question 4)
      if (finalAnswers[4] && finalAnswers[4].trim()) {
        const grains = finalAnswers[4].split(',').map(grain => grain.trim()).filter(grain => grain);
        grains.forEach(grain => {
          userAllergies.push({
            id: allergyIdCounter++,
            name: grain,
            severity: 'Moderate',
            category: 'Food',
            subcategory: 'Grains & Cereals',
            source: 'Q&A Setup'
          });
        });
      }

      // Process other food allergies (question 6)
      if (finalAnswers[6] && finalAnswers[6].trim()) {
        const others = finalAnswers[6].split(',').map(other => other.trim()).filter(other => other);
        others.forEach(otherAllergy => {
          userAllergies.push({
            id: allergyIdCounter++,
            name: otherAllergy,
            severity: 'Moderate',
            category: 'Food',
            subcategory: 'Other',
            source: 'Q&A Setup'
          });
        });
      }

      // Save to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        foodAllergies: userAllergies,
        hasSevereFoodReactions: finalAnswers[5] || false,
        allergyQACompleted: true,
        allergyQADate: new Date(),
        appType: 'food-allergy-tracker'
      });

      Toast.show({
        type: 'success',
        text1: 'Setup Complete!',
        text2: 'Your food allergy information has been saved successfully'
      });

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

    } catch (error) {
      console.error('Error saving food allergy data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save food allergy information. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSeverityButton = (allergy, severity, color, label) => {
    const isSelected = allergy.severity === severity;
    return (
      <TouchableOpacity
        style={[
          styles.severityButton,
          { 
            backgroundColor: isSelected ? color : '#f1f5f9',
            borderColor: isSelected ? color : '#e5e7eb'
          }
        ]}
        onPress={() => updateAllergySeverity(allergy.id, severity)}
      >
        <Text style={{
          color: isSelected ? '#fff' : '#041c33ff',
          fontWeight: isSelected ? '600' : '500',
          fontSize: 12
        }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'selection':
        return (
          <View>
            <View style={styles.categoryContainer}>
              {currentQuestion.categories.map(category => {
                const isSelected = selectedAllergies.find(item => item.id === category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.selectedCategoryItem
                    ]}
                    onPress={() => handleCategorySelection(category)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: `${category.color}20` }
                      ]}
                    >
                      {category.iconFamily === 'FontAwesome' ? (
                        <FontAwesome name={category.icon} size={20} color={category.color} />
                      ) : (
                        <MaterialCommunityIcons name={category.icon} size={20} color={category.color} />
                      )}
                    </View>
                    <Text style={[
                      styles.categoryName,
                      isSelected && styles.selectedCategoryName
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedAllergies.length > 0 && (
              <View style={styles.selectedAllergiesContainer}>
                <Text style={styles.selectedAllergiesTitle}>Selected Food Allergies - Set Severity:</Text>
                {selectedAllergies.map(allergy => (
                  <View key={allergy.id} style={styles.selectedAllergyItem}>
                    <Text style={styles.selectedAllergyName}>{allergy.name}</Text>
                    <View style={styles.severityContainer}>
                      {renderSeverityButton(allergy, 'Mild', '#10B981', 'Mild')}
                      {renderSeverityButton(allergy, 'Moderate', '#F59E0B', 'Moderate')}
                      {renderSeverityButton(allergy, 'Severe', '#DC2626', 'Severe')}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'text':
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={currentQuestion.placeholder}
              placeholderTextColor="#8e8e93"
              value={textInput}
              onChangeText={setTextInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {currentQuestion.required && (
              <Text style={styles.requiredNote}>
                * This question is required. Enter "None" if you don't have any.
              </Text>
            )}
          </View>
        );

      case 'boolean':
        return (
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={styles.booleanButton}
              onPress={() => handleBooleanAnswer(true)}
            >
              <FontAwesome name="check-circle" size={24} color="#10B981" />
              <Text style={styles.booleanButtonText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.booleanButton}
              onPress={() => handleBooleanAnswer(false)}
            >
              <FontAwesome name="times-circle" size={24} color="#DC2626" />
              <Text style={styles.booleanButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    if (currentQuestion.type === 'boolean') return false;
    if (currentQuestion.required) {
      return !validateCurrentAnswer();
    }
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Allergy Setup</Text>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }
          ]} 
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.required && (
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredBadgeText}>Required</Text>
              </View>
            )}
          </View>
          
          {renderQuestionContent()}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <View style={styles.navigationButtons}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}
            >
              <FontAwesome name="arrow-left" size={16} color="#041c33ff" />
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
        </View>

        {currentQuestion.type !== 'boolean' && (
          <TouchableOpacity
            style={[
              styles.nextButton, 
              (isLoading || isNextButtonDisabled()) && styles.buttonDisabled
            ]}
            onPress={handleNext}
            disabled={isLoading || isNextButtonDisabled()}
          >
            <Text style={styles.nextButtonText}>
              {isLoading 
                ? 'Saving...' 
                : currentQuestionIndex === QUESTIONS.length - 1 
                  ? 'Finish Setup' 
                  : 'Next'
              }
            </Text>
            {!isLoading && !isNextButtonDisabled() && (
              <FontAwesome 
                name={currentQuestionIndex === QUESTIONS.length - 1 ? "check" : "arrow-right"} 
                size={16} 
                color="#fff" 
                style={styles.nextButtonIcon} 
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#041c33ff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  questionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#041c33ff',
    lineHeight: 26,
  },
  requiredBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  requiredBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryItem: {
    borderColor: '#041c33ff',
    backgroundColor: '#f8f9ff',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#041c33ff',
    textAlign: 'center',
  },
  selectedCategoryName: {
    fontWeight: '600',
  },
  selectedAllergiesContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  selectedAllergiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginBottom: 16,
  },
  selectedAllergyItem: {
    marginBottom: 16,
  },
  selectedAllergyName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#041c33ff',
    marginBottom: 8,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textInputContainer: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#041c33ff',
    backgroundColor: '#fafafa',
    minHeight: 100,
  },
  requiredNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#DC2626',
    fontStyle: 'italic',
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  booleanButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#fafafa',
    minWidth: 120,
  },
  booleanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#041c33ff',
    marginTop: 8,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#041c33ff',
  },
  previousButtonText: {
    color: '#041c33ff',
    fontWeight: '500',
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#041c33ff',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#AAA',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
});

export default AllergyQAScreen;