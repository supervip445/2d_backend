import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { twoDigitAPI } from '../services/api';

export default function BettingScreen({ route, navigation }) {
  const { type = '2D' } = route.params || {};
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState('100');
  const [selectedTime, setSelectedTime] = useState('12:00 PM');
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

  const handleSelectNumbers = () => {
    navigation.navigate('NumberSelection', {
      betAmount: parseFloat(betAmount) || 100,
      onSelectNumbers: (numbers) => {
        setSelectedNumbers(numbers);
      },
    });
  };

  const handlePlaceBet = () => {
    if (selectedNumbers.length === 0) {
      Alert.alert('No Selection', 'Please select at least one number');
      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bet amount');
      return;
    }

    const totalAmount = selectedNumbers.length * parseFloat(betAmount);
    const userBalance = parseFloat(user?.balance || 0);

    if (totalAmount > userBalance) {
      Alert.alert('Insufficient Balance', `You need $${totalAmount.toFixed(2)} but only have $${userBalance.toFixed(2)}`);
      return;
    }

    // Navigate to cart to review and confirm
    navigation.navigate('Cart', {
      bets: selectedNumbers.map(num => ({
        number: num,
        amount: parseFloat(betAmount),
        type: type,
        time: selectedTime,
      })),
    });
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>ပိတ်ရက်ချိန်</Text>
        <View style={styles.timePicker}>
          <Text style={styles.timeText}>{selectedTime}</Text>
          <Ionicons name="chevron-down" size={20} color="#6b7280" />
        </View>
      </View>

      {/* Bet Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>လောင်းကြေးထည့်ပါ။</Text>
        <TextInput
          style={styles.amountInput}
          value={betAmount}
          onChangeText={setBetAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          placeholderTextColor="#9ca3af"
        />

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAmountButton}
              onPress={() => setBetAmount(amount.toString())}
            >
              <Text style={styles.quickAmountText}>{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Number Selection Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Numbers</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectNumbers}
          >
            <Text style={styles.selectButtonText}>
              {selectedNumbers.length > 0
                ? `${selectedNumbers.length} Selected`
                : 'Select Numbers'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Numbers Preview */}
        {selectedNumbers.length > 0 && (
          <View style={styles.selectedPreview}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedNumbers.map((num, index) => (
                <View key={index} style={styles.selectedNumberBadge}>
                  <Text style={styles.selectedNumberText}>{num}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Selected Numbers:</Text>
          <Text style={styles.summaryValue}>{selectedNumbers.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Amount per Number:</Text>
          <Text style={styles.summaryValue}>${parseFloat(betAmount || 0).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
          <Text style={styles.summaryTotalValue}>
            ${(selectedNumbers.length * parseFloat(betAmount || 0)).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Place Bet Button */}
      <TouchableOpacity
        style={[
          styles.placeBetButton,
          (selectedNumbers.length === 0 || !betAmount) && styles.placeBetButtonDisabled,
        ]}
        onPress={handlePlaceBet}
        disabled={selectedNumbers.length === 0 || !betAmount}
      >
        <LinearGradient
          colors={['#f59e0b', '#d97706']}
          style={styles.placeBetGradient}
        >
          <Text style={styles.placeBetText}>ထိုးမည်</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#1f2937',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  amountInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 2,
    borderColor: '#fbbf24',
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  selectButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedPreview: {
    marginTop: 12,
  },
  selectedNumberBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedNumberText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  placeBetButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  placeBetButtonDisabled: {
    opacity: 0.5,
  },
  placeBetGradient: {
    padding: 18,
    alignItems: 'center',
  },
  placeBetText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

