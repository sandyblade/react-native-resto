import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconElement } from '@ui-kitten/components';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Service from '../Service';
import Home from './Home';
import Menu from './Menu';
import History from './History';
import Profile from './Profile';

interface props {
    navigation: any,
    state: any
}

const MainLayout = () => {

    const logged: boolean = Service.logged()
    const { Navigator, Screen } = createBottomTabNavigator();
    const navigation = useNavigation<any>()

    const getIcon = (props: any, name: string): IconElement => (
        <Icon {...props} name={name} />
    );

    const handleLogout = () => {
        navigation.navigate('Login')
    }

    const BottomTabBar = (props: props) => (
        <BottomNavigation
            selectedIndex={props.state.index}
            onSelect={index => props.navigation.navigate(props.state.routeNames[index])}>
            <BottomNavigationTab title='Home' icon={props => getIcon(props, 'home-outline')} />
            <BottomNavigationTab title='History' icon={props => getIcon(props, 'calendar-outline')} />
            <BottomNavigationTab title='Menu' icon={props => getIcon(props, 'gift-outline')} />
            <BottomNavigationTab title='Profile' icon={props => getIcon(props, 'person-outline')} />
        </BottomNavigation>
    );

    const TabNavigator = () => (
        <Navigator tabBar={props => <BottomTabBar {...props} />}>
            <Screen name='Home' component={Home} />
            <Screen name='History' component={History} />
            <Screen name='Menu' component={Menu} />
            <Screen name='Profile' component={() => <Profile handleLogout={handleLogout} />} />
        </Navigator>
    );

    React.useEffect(() => {
        if (!logged) {
            navigation.navigate('Login')
        }
        return () => { }
    }, [])

    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <TabNavigator />
            </NavigationContainer>
        </NavigationIndependentTree>

    )
}


export default MainLayout