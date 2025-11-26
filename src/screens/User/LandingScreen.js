import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../../store/coursesSlice";
import { Calendar } from "react-native-calendars";

export default function LandingScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { enrollments } = useSelector(state => state.courses);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchEnrollments(user.uid));
    }
  }, [dispatch, user]);

  const recentEnrollments = enrollments.slice(0, 3);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState('');
  
  // Generate upcoming deadlines from actual course dates
  const upcomingDeadlines = enrollments
    .filter(course => course.endDate) // Only courses with end dates
    .map(course => {
      const endDate = new Date(course.endDate);
      const today = new Date();
      
      // Calculate assignment deadline (midpoint between now and end date)
      const assignmentDeadline = new Date((today.getTime() + endDate.getTime()) / 2);
      
      return [
        {
          courseTitle: course.title,
          date: assignmentDeadline.toISOString().split('T')[0],
          type: 'Assignment',
          dateDisplay: assignmentDeadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          daysUntil: Math.ceil((assignmentDeadline - today) / (1000 * 60 * 60 * 24))
        },
        {
          courseTitle: course.title,
          date: endDate.toISOString().split('T')[0],
          type: 'Final Exam',
          dateDisplay: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          daysUntil: Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
        }
      ];
    })
    .flat()
    .filter(deadline => deadline.daysUntil > 0) // Only future deadlines
    .sort((a, b) => a.daysUntil - b.daysUntil) // Sort by nearest first
    .slice(0, 5); // Show top 5 upcoming deadlines

  // Mark dates on calendar
  const markedDates = {};
  
  // Mark course start dates
  enrollments.forEach(course => {
    if (course.startDate) {
      const startDate = new Date(course.startDate).toISOString().split('T')[0];
      markedDates[startDate] = {
        marked: true,
        dotColor: '#10b981',
        activeOpacity: 0
      };
    }
  });
  
  // Mark deadlines
  upcomingDeadlines.forEach(item => {
    if (!markedDates[item.date]) {
      markedDates[item.date] = {
        marked: true,
        dotColor: '#f59e0b',
        activeOpacity: 0
      };
    } else {
      markedDates[item.date].dotColor = '#ef4444'; // Red if multiple events
    }
  });

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#2563eb'
    };
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={["#2563eb", "#1e40af", "#1e3a8a"]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Feather name="book-open" size={80} color="#fff" style={styles.heroIcon} />
          <Text style={styles.heroTitle}>UoM Course Finder</Text>
          <Text style={styles.heroSubtitle}>
            Discover, Learn & Enroll in Your Favorite Courses
          </Text>
          <Text style={styles.heroDescription}>
            Browse through our extensive catalog of courses and start your learning journey today.
          </Text>
        </View>
      </LinearGradient>

      {recentEnrollments.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recently Enrolled</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Enrolled")}>
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            data={recentEnrollments}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.enrolledCard}
                onPress={() => navigation.navigate("Details", { course: item })}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.enrolledImage} />
                <View style={styles.enrolledContent}>
                  <Text style={styles.enrolledTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.enrolledBadge}>
                    <Feather name="check-circle" size={14} color="#10b981" />
                    <Text style={styles.enrolledBadgeText}>Enrolled</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {enrollments.length > 0 && (
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Feather name="calendar" size={24} color="#2563eb" />
            <Text style={styles.calendarTitle}>Upcoming Deadlines</Text>
          </View>

          <Calendar
            style={styles.calendar}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#64748b',
              selectedDayBackgroundColor: '#2563eb',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#2563eb',
              dayTextColor: '#1e293b',
              textDisabledColor: '#cbd5e1',
              dotColor: '#f59e0b',
              selectedDotColor: '#ffffff',
              arrowColor: '#2563eb',
              monthTextColor: '#1e293b',
              textMonthFontWeight: '700',
              textMonthFontSize: 18,
            }}
            markedDates={markedDates}
            onDayPress={(day) => setSelectedDate(day.dateString)}
          />

          {upcomingDeadlines.length > 0 && (
            <View style={styles.deadlinesList}>
              <Text style={styles.deadlinesListTitle}>Next Deadlines</Text>
              {upcomingDeadlines.map((deadline, index) => (
                <View key={index} style={styles.deadlineItem}>
                  <View style={styles.deadlineDate}>
                    <Text style={styles.deadlineDateText}>{deadline.dateDisplay}</Text>
                  </View>
                  <View style={styles.deadlineInfo}>
                    <Text style={styles.deadlineTitle} numberOfLines={1}>{deadline.courseTitle}</Text>
                    <Text style={styles.deadlineType}>{deadline.type} Due</Text>
                  </View>
                  <Feather name="alert-circle" size={20} color="#f59e0b" />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: "#dbeafe" }]}>
              <Feather name="search" size={32} color="#2563eb" />
            </View>
            <Text style={styles.featureTitle}>Easy Search</Text>
            <Text style={styles.featureDescription}>
              Find courses quickly with our powerful search and filter system
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: "#dcfce7" }]}>
              <Feather name="heart" size={32} color="#10b981" />
            </View>
            <Text style={styles.featureTitle}>Save Favorites</Text>
            <Text style={styles.featureDescription}>
              Bookmark courses you like and access them anytime
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: "#fef3c7" }]}>
              <Feather name="award" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.featureTitle}>Easy Enrollment</Text>
            <Text style={styles.featureDescription}>
              Enroll in courses with just a single tap
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: "#fce7f3" }]}>
              <Feather name="users" size={32} color="#ec4899" />
            </View>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDescription}>
              Keep track of all your enrolled courses in one place
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Feather name="book" size={32} color="#2563eb" />
          <Text style={styles.statNumber}>100+</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="users" size={32} color="#10b981" />
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statCard}>
          <Feather name="star" size={32} color="#f59e0b" />
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Start Learning?</Text>
        <Text style={styles.ctaSubtitle}>
          Explore our course catalog and find the perfect course for you
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Courses")}
        >
          <Text style={styles.ctaButtonText}>Browse Courses</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroContent: {
    alignItems: "center",
  },
  heroIcon: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e0e7ff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 32,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#f8fafc",
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  recentSection: {
    paddingVertical: 24,
    paddingLeft: 24,
    backgroundColor: "#fff",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 24,
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  enrolledCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  enrolledImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f1f5f9",
  },
  enrolledContent: {
    padding: 12,
  },
  enrolledTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    minHeight: 36,
  },
  enrolledBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  enrolledBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
  },
  ctaSection: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  calendarSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#fff",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  calendar: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  deadlinesList: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
  },
  deadlinesListTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  deadlineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  deadlineDate: {
    backgroundColor: "#fef3c7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  deadlineDateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400e",
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  deadlineType: {
    fontSize: 12,
    color: "#64748b",
  },
});
