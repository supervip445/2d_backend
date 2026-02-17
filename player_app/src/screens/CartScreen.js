import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { betAPI } from '../services/api';

export default function CartScreen({ route, navigation }) {
  const { bets: initialBets } = route.params || {};
  const { user } = useAuth();
  const [bets, setBets] = useState(initialBets || []);
  const [loading, setLoading] = useState(false);

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  const handleEdit = (index) => {
    // Navigate back to betting screen with current bet
    navigation.navigate('Betting', {
      type: bets[index].type,
      betAmount: bets[index].amount.toString(),
    });
  };

  const handleDelete = (index) => {
    Alert.alert(
      'Delete Bet',
      'Are you sure you want to remove this bet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBets(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handleConfirm = async () => {
    if (bets.length === 0) {
      Alert.alert('Empty Cart', 'Please add bets before confirming');
      return;
    }

    const userBalance = parseFloat(user?.balance || 0);
    if (totalAmount > userBalance) {
      Alert.alert(
        'Insufficient Balance',
        `You need $${totalAmount.toFixed(2)} but only have $${userBalance.toFixed(2)}`
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement bet API endpoint in backend
      // For now, just show success message
      Alert.alert(
        'Success',
        `Bet placed successfully!\nTotal: $${totalAmount.toFixed(2)}\n${bets.length} numbers selected`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  if (bets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#9ca3af" />
        <Text style={styles.emptyText}>No bets in cart</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.addButtonText}>Add Bets</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Selected Numbers</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>

        {bets.map((bet, index) => (
          <View key={index} style={styles.betItem}>
            <View style={styles.betNumber}>
              <Text style={styles.betNumberText}>{bet.number}</Text>
              <Text style={styles.betCurrency}>ကျပ်</Text>
            </View>
            <View style={styles.betDetails}>
              <Text style={styles.betAmount}>${bet.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.betActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(index)}
              >
                <Text style={styles.editButtonText}>ပြင်ဆင်မည်</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index)}
              >
                <Text style={styles.deleteButtonText}>ဖျက်မည်</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>စုစုပေါင်း</Text>
          <Text style={styles.totalValue}>${totalAmount.toFixed(2)} ကျပ်</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.confirmButtonGradient}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Processing...' : 'အတည်ပြုမည်'}
            </Text>
          </LinearGradient>
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
  scrollView: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  betItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  betNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16,
  },
  betNumberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 4,
  },
  betCurrency: {
    fontSize: 12,
    color: '#6b7280',
  },
  betDetails: {
    flex: 1,
  },
  betAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  betActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

