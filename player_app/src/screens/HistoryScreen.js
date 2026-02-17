import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { betAPI } from '../services/api';

export default function HistoryScreen() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      setLoading(true);
      // TODO: Implement bet history API
      // const response = await betAPI.getBetHistory();
      // setBets(response.data || []);
      
      // Mock data for now
      setBets([
        {
          id: '000001-mk-2d-2026-02-15-02:15:02',
          player: 'PLAYER0101',
          amount: 400.00,
          status: 'Pending',
          date: '2026-02-15',
          time: '02:15:02',
        },
      ]);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBets();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerCard}>
            <Ionicons name="document-text" size={24} color="#3b82f6" />
            <View style={styles.headerCardText}>
              <Text style={styles.headerCardLabel}>မှတ်တမ်း</Text>
              <Text style={styles.headerCardValue}>M</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerCard}>
            <Ionicons name="trophy" size={24} color="#3b82f6" />
            <View style={styles.headerCardText}>
              <Text style={styles.headerCardLabel}>ကံထူးရှင်များ</Text>
              <Text style={styles.headerCardValue}>78</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          style={styles.titleBar}
        >
          <Text style={styles.titleText}>မနက်ပိုင်း စလစ်စာရင်း</Text>
        </LinearGradient>

        <View style={styles.updateInfo}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.updateText}>Updated: 2026-02-15 ---</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : bets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyText}>No transaction history</Text>
            </View>
          ) : (
            bets.map((bet) => (
              <View key={bet.id} style={styles.betCard}>
                <View style={styles.betHeader}>
                  <View>
                    <Text style={styles.betLabel}>စလစ်နံပါတ်:</Text>
                    <Text style={styles.betId}>{bet.id}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{bet.status}</Text>
                  </View>
                </View>
                <View style={styles.betDetails}>
                  <View style={styles.betRow}>
                    <Text style={styles.betLabel}>ကစားသမား:</Text>
                    <Text style={styles.betValue}>{bet.player}</Text>
                  </View>
                  <View style={styles.betRow}>
                    <Text style={styles.betLabel}>ငွေပမာဏ:</Text>
                    <Text style={styles.betValue}>${bet.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.betRow}>
                    <Text style={styles.betLabel}>Date:</Text>
                    <Text style={styles.betValue}>{bet.date}</Text>
                  </View>
                  <View style={styles.betRow}>
                    <Text style={styles.betLabel}>Time:</Text>
                    <Text style={styles.betValue}>{bet.time}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  headerCardText: {
    marginLeft: 8,
  },
  headerCardLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  headerCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  titleBar: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  betCard: {
    backgroundColor: '#2c3e50',
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
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  betLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  betId: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  betDetails: {
    marginTop: 8,
  },
  betRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  betValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

