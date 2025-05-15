import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Avatar, Divider, Badge, Chip } from 'react-native-paper';

// Define interfaces for type safety
interface Customer {
  name: string;
  avatar: string;
}

interface Review {
  id: string;
  customer: Customer;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
  responded: boolean;
  response?: string;
}

interface Metrics {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: number[];
}

// Mock data - replace with real API calls
const mockReviews: Review[] = [
  {
    id: '1',
    customer: {
      name: 'John Smith',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    rating: 5,
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
    rating: 4,
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
    rating: 3,
    date: '2023-05-01',
    comment: 'Service was ok, but took longer than expected.',
    serviceType: 'Electrical',
    responded: false
  },
];

const ReputationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: [0, 0, 0, 0, 0] // 1-5 stars count
  });
  const [filterBy, setFilterBy] = useState('all'); // all, positive, negative, unresponded
  
  const theme = useTheme();
  const colors = theme.colors;
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews);
      
      // Calculate metrics
      const total = mockReviews.length;
      const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
      const average = sum / total;
      
      // Count reviews per rating
      const breakdown = [0, 0, 0, 0, 0];
      mockReviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          breakdown[review.rating - 1]++;
        }
      });
      
      setMetrics({
        averageRating: average,
        totalReviews: total,
        ratingBreakdown: breakdown
      });
      
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredReviews = (): Review[] => {
    switch(filterBy) {
      case 'positive':
        return reviews.filter(review => review.rating >= 4);
      case 'negative':
        return reviews.filter(review => review.rating <= 2);
      case 'unresponded':
        return reviews.filter(review => !review.responded);
      default:
        return reviews;
    }
  };
  
  const handleRespondToReview = (id: string): void => {
    // Here you would open a modal to write and submit a response
    console.log(`Responding to review ${id}`);
  };

  const renderStars = (rating: number): React.ReactElement => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons 
            key={star} 
            name={star <= rating ? "star" : "star-outline"} 
            size={14} 
            color={star <= rating ? "#FFD700" : "#CCCCCC"}
            style={{marginRight: 2}}
          />
        ))}
      </View>
    );
  };
  
  const renderReviewItem = ({item}: {item: Review}): React.ReactElement => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <View style={styles.customerInfo}>
            <Avatar.Image size={40} source={{uri: item.customer.avatar}} />
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{item.customer.name}</Text>
              {renderStars(item.rating)}
            </View>
          </View>
          <View>
            <Text style={styles.reviewDate}>{item.date}</Text>
            <Badge style={{backgroundColor: colors.primary}}>{item.serviceType}</Badge>
          </View>
        </View>
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
        
        {item.responded && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Your Response:</Text>
            <Text style={styles.responseText}>{item.response}</Text>
          </View>
        )}
        
        {!item.responded && (
          <Button 
            mode="outlined" 
            onPress={() => handleRespondToReview(item.id)}
            style={styles.respondButton}
          >
            Respond to Review
          </Button>
        )}
      </Card.Content>
    </Card>
  );
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your reputation data...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.metricsContainer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.averageRating}>
            {metrics.averageRating.toFixed(1)}
          </Text>
          {renderStars(Math.round(metrics.averageRating))}
          <Text style={styles.totalReviews}>
            {metrics.totalReviews} {metrics.totalReviews === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
        
        <View style={styles.ratingBreakdown}>
          {metrics.ratingBreakdown.slice().reverse().map((count, reversedIndex) => {
            const rating = 5 - reversedIndex;
            const percentage = metrics.totalReviews > 0 
              ? (count / metrics.totalReviews) * 100 
              : 0;
              
            return (
              <View key={rating} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{rating} stars</Text>
                <View style={styles.breakdownBarContainer}>
                  <View 
                    style={[
                      styles.breakdownBar, 
                      { width: `${percentage}%`, backgroundColor: colors.primary }
                    ]} 
                  />
                </View>
                <Text style={styles.breakdownCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.filterContainer}>
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Chip 
            selected={filterBy === 'all'}
            onPress={() => setFilterBy('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip 
            selected={filterBy === 'positive'}
            onPress={() => setFilterBy('positive')}
            style={styles.filterChip}
          >
            Positive
          </Chip>
          <Chip 
            selected={filterBy === 'negative'}
            onPress={() => setFilterBy('negative')}
            style={styles.filterChip}
          >
            Negative
          </Chip>
          <Chip 
            selected={filterBy === 'unresponded'}
            onPress={() => setFilterBy('unresponded')}
            style={styles.filterChip}
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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="star-off" size={60} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No reviews match your filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
  metricsContainer: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
  },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    width: '30%',
  },
  averageRating: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: '#757575',
  },
  ratingBreakdown: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'space-around',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  breakdownLabel: {
    width: 60,
    fontSize: 12,
  },
  breakdownBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  breakdownBar: {
    height: 8,
    borderRadius: 4,
  },
  breakdownCount: {
    width: 20,
    fontSize: 12,
    textAlign: 'right',
  },
  divider: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 12,
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
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
  respondButton: {
    marginTop: 12,
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
