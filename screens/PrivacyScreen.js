import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";

const PrivacyScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"Privacy Policy"} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Privacy Policy</Text>

        <Section title="Introduction">
          Welcome to www.speedyslotz.com. Your privacy is of utmost importance
          to us. This Privacy Policy outlines the types of information we
          collect, how we use it, and the measures we take to keep your data
          safe.
        </Section>

        <Section title="Information Collection">
          We collect information when users register, make a booking, or
          interact with our services. This may include name, email, contact
          number, and preferences related to the booking.
        </Section>

        <Section title="Usage of Information">
          The information collected is used to facilitate bookings, enhance user
          experience, and for communication purposes. We may also use the data
          for marketing or promotional activities, unless you opt out.
        </Section>

        <Section title="Sharing of Information">
          We do not sell or share your personal information with third parties
          without your consent, except when required by law or as necessary to
          render our services.
        </Section>

        <Section title="Cookies">
          We use cookies to enhance user experience. You have the option to
          decline these cookies, but it may affect your usage of certain
          features on our website.
        </Section>

        <Section title="Data Security">
          We employ various measures to ensure the security of your data. These
          include encryption, secure servers, and regular audits.
        </Section>

        <Section title="Changes to Privacy Policy">
          We may update our Privacy Policy from time to time. We recommend users
          regularly review our privacy policy to stay informed. Continued use of
          our services after changes have been made implies acceptance of those
          changes.
        </Section>

        <Section title="Contact Us">
          If you have any questions or concerns about these Terms, please
          contact us at info@speedyslotz.com. We are always available to address
          your concerns and provide clarity where needed.
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ title, children }) => (
  <>
    <Text style={styles.subHeading}>{title}</Text>
    <Text style={styles.text}>{children}</Text>
  </>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5", // A light grey background
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: theme3.fontColor, // Darker text for better readability
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: theme3.fontColor, // Slightly lighter than the main heading
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24, // Increased line height for better readability
    color: theme3.fontColor, // Grey text for the main content to reduce strain
  },
});

export default PrivacyScreen;
