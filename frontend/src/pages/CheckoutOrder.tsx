import React, { useRef } from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconElement, Modal, Layout, Text } from '@ui-kitten/components';
import { NavigationContainer, NavigationIndependentTree, } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Image, ScrollView } from 'react-native';

interface IProps {
    mainApp: any
}

interface props {
    navigation: any,
    state: any
}

const CheckoutOrder = (p: IProps) => {

    const { Navigator, Screen } = createBottomTabNavigator();

    const getIcon = (props: any, name: string): IconElement => (
        <Icon {...props} name={name} />
    );

    const BottomTabBar = (props: props) => (
        <BottomNavigation
            selectedIndex={props.state.index}
            onSelect={(index) => props.navigation.navigate(props.state.routeNames[index])}>
            <BottomNavigationTab title='List Menu' icon={props => getIcon(props, 'home-outline')} />
            <BottomNavigationTab title='Detail Order' icon={props => getIcon(props, 'calendar-outline')} />
            <BottomNavigationTab title='Checkout' icon={props => getIcon(props, 'gift-outline')} />
        </BottomNavigation >
    );

    const ListMenu = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    <Text>AAA</Text>
                </ScrollView>
            </Layout>
        )
    }

    const DetailOrder = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    <Text>AAA</Text>
                </ScrollView>
            </Layout>
        )
    }

    const Checkout = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    <Text>AAA</Text>
                </ScrollView>
            </Layout>
        )
    }


    const TabNavigator = () => (
        <Navigator initialRouteName={'List Menu'} tabBar={props => <BottomTabBar {...props} />}>
            <Screen name='List Menu' component={ListMenu} />
            <Screen name='Detail Order' component={DetailOrder} />
            <Screen name='Checkout' component={Checkout} />
        </Navigator>
    );

    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        </NavigationIndependentTree>
    )
}


export default CheckoutOrder