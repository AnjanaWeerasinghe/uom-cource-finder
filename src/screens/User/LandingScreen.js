import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

export default function LandingScreen({ navigation }) {
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
});
