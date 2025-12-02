import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { fetchWorksByTeacher } from '../../store/worksSlice';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

export default function TeacherNotificationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { works } = useSelector(state => state.works);
  const [submissions, setSubmissions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (user?.uid) {
      dispatch(fetchWorksByTeacher(user.uid));
      
      // Fetch all submissions for teacher's works
      const q = query(
        collection(db, 'submissions'),
        where('status', '==', 'submitted'),
        orderBy('submittedAt', 'desc')
      );
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Generate notifications
  const notifications = [];

  // New submissions waiting for grading
  submissions.forEach(sub => {
    notifications.push({
      id: `submission-${sub.id}`,
      type: 'submission',
      title: 'New Submission',
      message: `${sub.studentName} submitted "${sub.workTitle}"`,
      detail: 'Awaiting grade',
      icon: 'file-text',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      time: new Date(sub.submittedAt),
      action: () => {
        const work = works.find(w => w.id === sub.workId);
        if (work) {
          navigation.navigate('WorkSubmissions', { work });
        }
      }
    });
  });

  // Upcoming deadlines (works due in next 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  works
    .filter(work => {
      const dueDate = new Date(work.dueDate);
      return dueDate > new Date() && dueDate <= threeDaysFromNow;
    })
    .forEach(work => {
      notifications.push({
        id: `deadline-${work.id}`,
        type: 'deadline',
        title: 'Upcoming Deadline',
        message: `"${work.title}" is due soon`,
        detail: new Date(work.dueDate).toLocaleDateString(),
        icon: 'clock',
        color: '#ef4444',
        bgColor: '#fee2e2',
        time: new Date(work.dueDate),
        action: () => navigation.navigate('WorkSubmissions', { work })
      });
    });

  // Sort by time (newest first)
  notifications.sort((a, b) => b.time - a.time);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={styles.notificationCard}
      onPress={item.action}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        <Feather name={item.icon} size={24} color={item.color} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.timeText}>{getTimeAgo(item.time)}</Text>
        </View>
        
        <Text style={styles.notificationMessage}>{item.message}</Text>
        
        {item.detail && (
          <View style={[styles.detailBadge, { backgroundColor: item.bgColor }]}>
            <Text style={[styles.detailText, { color: item.color }]}>
              {item.detail}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bell" size={28} color="#10b981" />
        <Text style={styles.title}>Notifications</Text>
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="bell-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#10b981']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  detailBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
