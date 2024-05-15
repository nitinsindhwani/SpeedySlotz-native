// HowItWorksScreen.js
import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";
import { theme3 } from "../assets/branding/themes";
import Header from "./GlobalComponents/Header";

const HowItWorksScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={'How it works'}/>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>How It Works</Text>

        <Step number="1" title="Browse Services">
          Start by browsing through the various service categories available on
          our platform. Whether you need grooming, healthcare, or any other
          service, SpeedySlotz makes finding the right provider a breeze.
        </Step>

        <Step number="2" title="Choose a Slot">
          Once you've found your desired service, view the available slots. Our
          system updates in real-time, ensuring you see the most current
          availability. Select a slot that fits your schedule.
        </Step>

        <Step number="3" title="Book Instantly">
          With just a few taps, you can book your chosen slot. You’ll receive
          instant confirmation, and your service provider will be notified
          immediately. It’s that simple - no more phone calls or waiting.
        </Step>

        <Step number="4" title="Enjoy Your Service">
          Show up at the scheduled time and enjoy your service. SpeedySlotz
          streamlines the entire booking process, making it efficient for both
          users and service providers.
        </Step>

        <Text style={styles.finalNote}>
          At SpeedySlotz, our goal is to make scheduling appointments as
          straightforward as possible. Say goodbye to the hassle of last-minute
          bookings. Welcome to the future of service scheduling.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Step = ({ number, title, children }) => (
  <>
    <Text style={styles.stepTitle}>{`Step ${number}: ${title}`}</Text>
    <Text style={styles.text}>{children}</Text>
  </>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color:  theme3.fontColor,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
    color: theme3.fontColor,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
    color:  theme3.fontColor,
  },
  finalNote: {
    fontSize: 16,
    fontWeight: "500",
    color: theme3.fontColor,
    marginTop: 20,
    marginBottom: 20,
  },
});

export default HowItWorksScreen;
