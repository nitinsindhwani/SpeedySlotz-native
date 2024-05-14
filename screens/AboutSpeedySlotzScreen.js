// AboutSpeedySlotzScreen.js
import React from "react";
import { ScrollView, Text, StyleSheet, SafeAreaView } from "react-native";
import Header from "./GlobalComponents/Header";
import { theme3 } from "../assets/branding/themes";

const AboutSpeedySlotzScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <Header title={"About SpeedySlotz"}/>
      <ScrollView style={styles.container}>
        {/* <Text style={styles.heading}>About SpeedySlotz</Text> */}

        <Text style={styles.text}>
          SpeedySlotz revolutionizes how users book services across various
          industries by providing a seamless, efficient, and user-friendly
          online booking platform. Born out of the necessity to simplify the
          appointment booking process, SpeedySlotz aims to bridge the gap
          between service providers and customers seeking immediate bookings.
        </Text>

        <Text style={styles.text}>
          Our journey began when we noticed a recurring problem: last-minute
          cancellations leaving service providers with unfilled slots and
          potential customers scrambling to find available bookings. SpeedySlotz
          addresses this issue head-on, enabling service providers to list their
          available slots in real-time and customers to book those slots
          instantly.
        </Text>

        <Text style={styles.text}>
          Beyond mere convenience, SpeedySlotz is committed to enriching the
          community it serves. By optimizing the booking process, we not only
          enhance the customer experience but also support local businesses in
          maximizing their operational efficiency and revenue potential.
        </Text>

        <Text style={styles.text}>
          At SpeedySlotz, we envision a world where booking an appointment is as
          easy and straightforward as making a purchase online. We are
          continuously working to expand our service categories and reach,
          ensuring that more people can experience the convenience of
          SpeedySlotz.
        </Text>

        <Text style={styles.text}>
          Thank you for choosing SpeedySlotz. We're excited to be a part of your
          journey and look forward to serving you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: theme3.fontColor,
  },
});

export default AboutSpeedySlotzScreen;
