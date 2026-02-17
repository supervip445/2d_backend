import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { twoDigitAPI } from '../services/api';

export default function NumberSelectionScreen({ route, navigation }) {
  const { betAmount, onSelectNumbers } = route.params || {};
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [activeDigits, setActiveDigits] = useState([]);

  useEffect(() => {
    fetchActiveDigits();
  }, []);

  const fetchActiveDigits = async () => {
    try {
      const response = await twoDigitAPI.getActive();
      const digits = response.data || [];
      setActiveDigits(digits.map(d => d.two_digit));
    } catch (error) {
      console.error('Error fetching active digits:', error);
    }
  };

  const toggleNumber = (number) => {
    const numStr = number.toString().padStart(2, '0');
    
    // Check if digit is active
    if (!activeDigits.includes(numStr)) {
      Alert.alert('Inactive', `Digit ${numStr} is currently inactive`);
      return;
    }

    setSelectedNumbers(prev => {
      if (prev.includes(numStr)) {
        return prev.filter(n => n !== numStr);
      } else {
        return [...prev, numStr];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedNumbers.length === 0) {
      Alert.alert('No Selection', 'Please select at least one number');
      return;
    }

    if (onSelectNumbers) {
      onSelectNumbers(selectedNumbers);
    }
    navigation.goBack();
  };

  // Generate numbers 00-99
  const numbers = Array.from({ length: 100 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Numbers (00-99)</Text>
        <Text style={styles.selectedCount}>
          Selected: {selectedNumbers.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {numbers.map((num) => {
            const numStr = num.toString().padStart(2, '0');
            const isSelected = selectedNumbers.includes(numStr);
            const isActive = activeDigits.includes(numStr);

            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberCard,
                  isSelected && styles.numberCardSelected,
                  !isActive && styles.numberCardInactive,
                ]}
                onPress={() => toggleNumber(num)}
                disabled={!isActive}
              >
                <Text
                  style={[
                    styles.numberText,
                    isSelected && styles.numberTextSelected,
                    !isActive && styles.numberTextInactive,
                  ]}
                >
                  {numStr}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Total: {selectedNumbers.length} numbers
          </Text>
          <Text style={styles.footerText}>
            Amount: ${((selectedNumbers.length * (betAmount || 100)).toFixed(2))}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, selectedNumbers.length === 0 && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={selectedNumbers.length === 0}
        >
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  selectedCount: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  numberCard: {
    width: '9%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  numberCardSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  numberCardInactive: {
    backgroundColor: '#f3f4f6',
    opacity: 0.5,
  },
  numberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  numberTextSelected: {
    color: '#3b82f6',
  },
  numberTextInactive: {
    color: '#9ca3af',
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerInfo: {
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

