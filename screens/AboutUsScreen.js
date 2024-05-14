// AboutUsScreen.js
import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";

const AboutUsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>About Us</Text>

        <Section title="Our Beginning">
          It all began with a simple, personal frustration. As a software
          developer, technology has always been a part of my life. But when it
          came to finding a last-minute grooming appointment for Elmo, our
          6-month-old mini Golden Doodle, technology felt distant. Despite being
          newly vaccinated against rabies and desperately needing a trim, I
          found myself on a seemingly endless call loop with various groomers,
          only to be met with constant rejections. With hair covering his eyes
          and affecting his comfort, it was clear Elmo couldn't wait. It struck
          me: there should be a better way. A platform that not only benefits
          people like me, looking for quick appointments but also addresses a
          pressing issue faced by service providers - the problem of same-day
          cancellations and the ensuing loss of business.
        </Section>

        <Section title="A Solution For All">
          Cancellations, especially last minute, are detrimental to businesses.
          Filling those slots becomes another challenge, often involving frantic
          calls to existing clients who might not always be available or
          interested in such short notice. This is where SpeedySlotz bridges the
          gap. Our platform provides a hassle-free solution where service
          providers can open specific slots, and users can instantly book them.
          A win-win for everyone involved.
        </Section>

        <Section title="Our Vision">
          At SpeedySlotz, we aim to streamline and simplify the booking process
          for both customers and service providers. We envision a world where
          getting an appointment is just a click away, saving time, energy, and
          reducing lost opportunities for businesses. Our journey with Elmo was
          just the beginning, and we're excited to be part of yours.
        </Section>

        <Section title="Contact Us">
          To learn more or for any queries, feel free to reach out to us at
          info@speedyslotz.com. We'd love to hear from you!
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

export default AboutUsScreen;
