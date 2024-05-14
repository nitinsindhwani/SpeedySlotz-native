import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons'; 

const SettingOption = ({ title }) => (
    <View style={styles.settingOptionContainer}>
        <Text style={styles.settingOptionTitle}>{title}</Text>
    </View>
);

const SettingsScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons 
                    name="arrow-back" 
                    size={24} 
                    color="black"
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.goBack()}
                />
            ),
            headerTitle: 'Settings',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
                color: 'purple', 
            },
            headerStyle: {
                backgroundColor: 'white',
            }
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <SettingOption title="Edit Profile" />
            <SettingOption title="Change Password" />
            <SettingOption title="Notifications" />
            <SettingOption title="Privacy & Security" />
            <SettingOption title="Logout" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFF',
    },
    settingOptionContainer: {
        marginVertical: 10,
        padding: 20,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white', // Changed from #0000FF for consistency
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    settingOptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black', // Changed from #FFA500 for consistency
    },
});

export default SettingsScreen;
