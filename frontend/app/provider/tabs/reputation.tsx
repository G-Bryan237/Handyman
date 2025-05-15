import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Avatar, Divider, Badge, Chip, ProgressBar } from 'react-native-paper';

// Define interfaces for type safety
interface Customer {
  name: string;
  avatar: string;
}

interface Review {
  id: string;
  customer: Customer;
  feedback: 'positive' | 'neutral' | 'negative';
  date: string;
  comment: string;
  serviceType: string;
  responded: boolean;
  response?: string;
  isPinned?: boolean; // New property to track pinned status
}

interface Metrics {
  totalTransactions: number;
  successRate: number;
  positiveReviews: number;
  neutralReviews: number;
  negativeReviews: number;
  completionRate: number;
  responseTime: number; // in minutes
}

// Mock data - replace with real API calls
const mockReviews: Review[] = [
  {
    id: '1',
    customer: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    feedback: 'positive',
    date: '2023-05-15',
    comment: 'Excellent work! Very professional and finished the job quickly.',
    serviceType: 'Plumbing',
    responded: false
  },
  {
    id: '2',
    customer: {
      name: 'Mary Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    feedback: 'neutral',
    date: '2023-05-10',
    comment: 'Did a good job fixing my sink but left some mess after. Otherwise happy with the service.',
    serviceType: 'Plumbing',
    responded: true,
    response: 'Thank you for your feedback! I apologize for the mess and will ensure a cleaner finish next time.'
  },
  {
    id: '3',
    customer: {
      name: 'Robert Davis',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    feedback: 'negative',
    date: '2023-05-01',
    comment: 'Service was disappointing, took much longer than expected with poor results.',
    serviceType: 'Electrical',
    responded: false
  },
];

// Mock metrics data - replace with real API data
const mockMetrics: Metrics = {
  totalTransactions: 183,
  successRate: 97.8,
  positiveReviews: 152,
  neutralReviews: 24,
  negativeReviews: 7,
  completionRate: 98.5,
  responseTime: 18,
};

const ReputationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [filterBy, setFilterBy] = useState('all'); // all, positive, neutral, negative, unresponded, pinned
  
  const theme = useTheme();
  const colors = theme.colors;
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setReviews(mockReviews);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  
  const filteredReviews = (): Review[] => {
    // First sort by pinned status (pinned ones first)
    const sortedReviews = [...reviews].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    
    // Then filter by selected filter
    switch(filterBy) {
      case 'positive':
        return sortedReviews.filter(review => review.feedback === 'positive');
      case 'neutral':
        return sortedReviews.filter(review => review.feedback === 'neutral');
      case 'negative':
        return sortedReviews.filter(review => review.feedback === 'negative');
      case 'unresponded':
        return sortedReviews.filter(review => !review.responded);
      case 'pinned':
        return sortedReviews.filter(review => review.isPinned);
      default:
        return sortedReviews;
    }
  };
  
  const handleRespondToReview = (id: string): void => {
    // Here you would open a modal to write and submit a response
    console.log(`Responding to review ${id}`);
  };
  
  const handleTogglePin = (id: string): void => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, isPinned: !review.isPinned } 
        : review
    ));
  };

  const renderFeedbackIcon = (feedback: 'positive' | 'neutral' | 'negative'): React.ReactElement => {
    switch (feedback) {
      case 'positive':
        return <MaterialIcons name="thumb-up" size={18} color="#22C55E" />; // Green thumbs up
      case 'neutral':
        return <MaterialIcons name="thumbs-up-down" size={18} color="#F59E0B" />; // Yellow neutral
      case 'negative':
        return <MaterialIcons name="thumb-down" size={18} color="#EF4444" />; // Red thumbs down
      default:
        return <></>;
    }
  };
  
  const getFeedbackColor = (feedback: 'positive' | 'neutral' | 'negative'): string => {
    switch (feedback) {
      case 'positive': return '#22C55E'; // Green for positive
      case 'neutral': return '#F59E0B';  // Orange/yellow for neutral
      case 'negative': return '#EF4444'; // Red for negative
      default: return '#6B7280';         // Gray default
    }
  };

  const renderFeedbackBadge = (feedback: 'positive' | 'neutral' | 'negative'): React.ReactElement => {
    let text = '';
    let color = '';

    switch (feedback) {
      case 'positive':
        text = 'Positive';
        color = '#22C55E';
        break;
      case 'neutral':
        text = 'Neutral';
        color = '#F59E0B';
        break;
      case 'negative':
        text = 'Negative';
        color = '#EF4444';
        break;
    }

    return (
      <View style={[styles.feedbackBadge, { backgroundColor: `${color}20`, borderColor: color }]}>
        <Text style={[styles.feedbackText, { color }]}>{text}</Text>
      </View>
    );
  };
  
  const renderReviewItem = ({item}: {item: Review}): React.ReactElement => (
    <Card style={[styles.reviewCard, item.isPinned && styles.pinnedReviewCard]}>
      <Card.Content>
        {/* Pinned indicator */}
        {item.isPinned && (
          <View style={styles.pinnedBadge}>
            <MaterialIcons name="push-pin" size={12} color="#FFFFFF" />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
        
        <View style={styles.reviewHeader}>
          <View style={styles.customerInfo}>
            <Avatar.Image size={40} source={{uri: item.customer.avatar}} />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{item.customer.name}</Text>
              <View style={styles.feedbackContainer}>
                {renderFeedbackIcon(item.feedback)}
                <Text style={[styles.feedbackLabel, { color: getFeedbackColor(item.feedback) }]}>
                  {item.feedback.charAt(0).toUpperCase() + item.feedback.slice(1)} feedback
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.reviewDate}>{item.date}</Text>
            <Badge style={styles.serviceBadge}>{item.serviceType}</Badge>
          </View>
        </View>
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
        
        {item.responded && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Your Response:</Text>
            <Text style={styles.responseText}>{item.response}</Text>
          </View>
        )}
        
        <View style={styles.actionButtonsContainer}>
          {!item.responded && (
            <Button 
              mode="outlined" 
              onPress={() => handleRespondToReview(item.id)}
              style={styles.actionButton}
            >
              Respond
            </Button>
          )}
          
          <Button
            mode={item.isPinned ? "contained" : "outlined"}
            icon={() => <MaterialIcons name="push-pin" size={16} color={item.isPinned ? "#FFF" : colors.primary} />}
            onPress={() => handleTogglePin(item.id)}
            style={[styles.actionButton, item.isPinned ? styles.unpinButton : styles.pinButton]}
          >
            {item.isPinned ? 'Unpin' : 'Pin to Top'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
  
  if (loading || !metrics) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your reputation data...</Text>
      </SafeAreaView>
    );
  }
  
  // Calculate percentages for the review breakdown
  const totalReviews = metrics.positiveReviews + metrics.neutralReviews + metrics.negativeReviews;
  const positivePercent = totalReviews > 0 ? (metrics.positiveReviews / totalReviews) * 100 : 0;
  const neutralPercent = totalReviews > 0 ? (metrics.neutralReviews / totalReviews) * 100 : 0;
  const negativePercent = totalReviews > 0 ? (metrics.negativeReviews / totalReviews) * 100 : 0;
  
  // Get count of pinned reviews for the filter badge
  const pinnedCount = reviews.filter(review => review.isPinned).length;
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Transaction Success Rate Dashboard */}
      <View style={styles.metricsCard}>
        <Text style={styles.metricTitle}>Transaction Summary</Text>
        
        <View style={styles.keyMetricsRow}>
          <View style={styles.keyMetric}>
            <Text style={styles.keyMetricValue}>{metrics.totalTransactions}</Text>
            <Text style={styles.keyMetricLabel}>Total Jobs</Text>
          </View>
          <View style={styles.keyMetric}>
            <Text style={[styles.keyMetricValue, { color: '#22C55E' }]}>
              {metrics.successRate}%
            </Text>
            <Text style={styles.keyMetricLabel}>Success Rate</Text>
          </View>
          <View style={styles.keyMetric}>
            <Text style={styles.keyMetricValue}>{metrics.responseTime}m</Text>
            <Text style={styles.keyMetricLabel}>Avg Response</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Customer Satisfaction Metrics */}
        <Text style={styles.subSectionTitle}>Customer Satisfaction</Text>
        <View style={styles.satisfactionContainer}>
          <View style={styles.satisfactionBar}>
            <View style={[styles.barSection, { backgroundColor: '#22C55E', width: `${positivePercent}%` }]} />
            <View style={[styles.barSection, { backgroundColor: '#F59E0B', width: `${neutralPercent}%` }]} />
            <View style={[styles.barSection, { backgroundColor: '#EF4444', width: `${negativePercent}%` }]} />
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <MaterialIcons name="thumb-up" size={18} color="#22C55E" />
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {metrics.positiveReviews} ({positivePercent.toFixed(1)}%)
                </Text>
                <Text style={styles.metricLabel}>Positive</Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <MaterialIcons name="thumbs-up-down" size={18} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {metrics.neutralReviews} ({neutralPercent.toFixed(1)}%)
                </Text>
                <Text style={styles.metricLabel}>Neutral</Text>
              </View>
            </View>
            
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <MaterialIcons name="thumb-down" size={18} color="#EF4444" />
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {metrics.negativeReviews} ({negativePercent.toFixed(1)}%)
                </Text>
                <Text style={styles.metricLabel}>Negative</Text>
              </View>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />
        
        {/* Completion Rate */}
        <View style={styles.completionRateContainer}>
          <View style={styles.completionRateHeader}>
            <Text style={styles.completionRateTitle}>Job Completion Rate</Text>
            <Text style={styles.completionRateValue}>{metrics.completionRate}%</Text>
          </View>
          <ProgressBar 
            progress={metrics.completionRate / 100} 
            color="#2563EB" 
            style={styles.progressBar} 
          />
        </View>
      </View>
      
      {/* Pinned reviews tooltip when there are some */}
      {pinnedCount > 0 && (
        <View style={styles.pinnedInfoContainer}>
          <MaterialIcons name="info-outline" size={16} color="#2563EB" />
          <Text style={styles.pinnedInfoText}>
            {pinnedCount} review{pinnedCount > 1 ? 's' : ''} pinned to the top
          </Text>
        </View>
      )}
      
      {/* Customer Feedback Section */}
      <View style={styles.reviewsHeader}>
        <Text style={styles.reviewsTitle}>Customer Feedback</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Chip 
            selected={filterBy === 'all'}
            onPress={() => setFilterBy('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip 
            selected={filterBy === 'pinned'}
            onPress={() => setFilterBy('pinned')}
            style={styles.filterChip}
            icon={() => <MaterialIcons name="push-pin" size={16} color={filterBy === 'pinned' ? "#ffffff" : "#2563EB"} />}
          >
            Pinned{pinnedCount > 0 ? ` (${pinnedCount})` : ''}
          </Chip>
          <Chip 
            selected={filterBy === 'positive'}
            onPress={() => setFilterBy('positive')}
            style={styles.filterChip}
            icon={() => <MaterialIcons name="thumb-up" size={16} color={filterBy === 'positive' ? "#ffffff" : "#22C55E"} />}
          >
            Positive
          </Chip>
          <Chip 
            selected={filterBy === 'neutral'}
            onPress={() => setFilterBy('neutral')}
            style={styles.filterChip}
            icon={() => <MaterialIcons name="thumbs-up-down" size={16} color={filterBy === 'neutral' ? "#ffffff" : "#F59E0B"} />}
          >
            Neutral
          </Chip>
          <Chip 
            selected={filterBy === 'negative'}
            onPress={() => setFilterBy('negative')}
            style={styles.filterChip}
            icon={() => <MaterialIcons name="thumb-down" size={16} color={filterBy === 'negative' ? "#ffffff" : "#EF4444"} />}
          >
            Negative
          </Chip>
          <Chip 
            selected={filterBy === 'unresponded'}
            onPress={() => setFilterBy('unresponded')}
            style={styles.filterChip}
            icon="message-reply-text"
          >
            Unresponded
          </Chip>
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredReviews()}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.reviewsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="message-text-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No feedback matches your filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  metricsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  keyMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  keyMetric: {
    alignItems: 'center',
    flex: 1,
  },
  keyMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  keyMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  satisfactionContainer: {
    marginBottom: 16,
  },
  satisfactionBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSection: {
    height: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  completionRateContainer: {
    marginBottom: 8,
  },
  completionRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionRateTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  completionRateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  reviewsHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChip: {
    margin: 4,
  },
  reviewsList: {
    padding: 16,
    paddingTop: 0,
  },
  reviewCard: {
    marginBottom: 16,
    elevation: 2,
  },
  pinnedReviewCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  pinnedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  pinnedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  pinnedInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  pinnedInfoText: {
    fontSize: 12,
    color: '#2563EB',
    marginLeft: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingTop: 10, // Additional padding for cards that have the pin badge
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerDetails: {
    marginLeft: 12,
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  feedbackBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  feedbackText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  serviceBadge: {
    backgroundColor: '#2563EB',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  responseLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
    color: '#757575',
  },
  responseText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    // Small buttons are better for this UI
  },
  pinButton: {
    // Style for the pin button
  },
  unpinButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ReputationScreen;
