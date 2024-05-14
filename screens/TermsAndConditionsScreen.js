// TermsAndConditionsScreen.js
import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";
import Header from "./GlobalComponents/Header";

const TermsAndConditionsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={"Terms and Conditions"} />
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Terms and Conditions</Text>

        <Section title="Introduction">
          Welcome to www.speedyslotz.com. This app and website are provided to
          offer a scheduling platform, allowing users across the US to discover
          and book available slots with a variety of service providers. By
          accessing and using our services, users agree to abide by the
          following terms and conditions.
        </Section>

        <Section title="Data Collection and Use">
          We retrieve data from Yelp to provide our users with accurate and
          up-to-date information on various service providers. This data is
          stored in our own database for efficient access and retrieval. We
          respect the intellectual property rights of Yelp and other third
          parties, and we only use this data for legitimate purposes related to
          our services.
        </Section>

        <Section title="Booking">
          Users can search for various service categories. Based on their
          preferences, our system will offer available service providers and
          their respective time slots. When a user selects a slot, they are
          required to provide specific profile details. This information helps
          the provider gain a better understanding of the booking and allows
          them to confirm it accordingly.
        </Section>

        <Section title="Provider Slot Management">
          Service providers are responsible for opening up slots for end-users.
          We encourage providers to ensure the accuracy and availability of
          these slots. Once a slot is booked, it's the provider's responsibility
          to honor that booking or communicate any changes directly to the user.
        </Section>

        <Section title="Authentication">
          We use the Keycloak server to provide authentication and authorization
          for our services. This ensures that user data is secured and only
          accessible by authorized individuals. Users are responsible for
          keeping their login credentials confidential.
        </Section>

        <Section title="Changes to Terms">
          We may update our Terms and Conditions from time to time to reflect
          changes in our services, legal and regulatory requirements, or for
          other reasons. We encourage users to regularly review our terms to
          stay informed. Continued use of our services after changes have been
          made implies acceptance of those changes.
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
    backgroundColor: "#f5f5f5",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: "#444",
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color: "#666",
  },
});

export default TermsAndConditionsScreen;
