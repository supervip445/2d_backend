import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { twoDigitAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [activeDigits, setActiveDigits] = useState(0);
  const [inactiveDigits, setInactiveDigits] = useState(0);

  useEffect(() => {
    fetchDigitStats();
  }, []);

  const fetchDigitStats = async () => {
    try {
      const [activeRes, inactiveRes] = await Promise.all([
        twoDigitAPI.getActive(),
        twoDigitAPI.getInactive(),
      ]);
      setActiveDigits(activeRes.data?.length || 0);
      setInactiveDigits(inactiveRes.data?.length || 0);
    } catch (error) {
      console.error('Error fetching digits:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || user?.user_name || 'Player'}</Text>
              <Text style={styles.userBalance}>
                Balance: ${parseFloat(user?.balance || 0).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="flag" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Banner/Advertisement Section */}
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={['#3b82f6', '#2563eb', '#1e40af']}
          style={styles.banner}
        >
          <Text style={styles.bannerText}>Official App</Text>
          <Text style={styles.bannerSubtext}>24 hours deposit/withdrawal</Text>
        </LinearGradient>
      </View>

      {/* 2D/3D Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('Betting', { type: '2D' })}
        >
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.optionGradient}
          >
            <Text style={styles.optionTitle}>2D ထိုးမည်</Text>
            <Text style={styles.optionSubtitle}>2D</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate('Betting', { type: '3D' })}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.optionGradient}
          >
            <Text style={styles.optionTitle}>3D ထိုးမည်</Text>
            <Text style={styles.optionSubtitle}>3D</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active Digits</Text>
          <Text style={styles.statValue}>{activeDigits}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Inactive Digits</Text>
          <Text style={styles.statValue}>{inactiveDigits}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Betting', { type: '2D' })}
        >
          <Ionicons name="flash" size={24} color="#3b82f6" />
          <Text style={styles.quickActionText}>Quick Bet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="refresh" size={24} color="#3b82f6" />
          <Text style={styles.quickActionText}>Dream Number</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="reload" size={24} color="#3b82f6" />
          <Text style={styles.quickActionText}>Around</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userBalance: {
    fontSize: 14,
    color: '#9ca3af',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    padding: 20,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  optionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
});

