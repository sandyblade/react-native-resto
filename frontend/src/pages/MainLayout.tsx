import React, { useRef } from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconElement, Modal } from '@ui-kitten/components';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Octicons from "@expo/vector-icons/Octicons";
import Service from '../Service';
import Home from './Home';
import Menu from './Menu';
import History from './History';
import Profile from './Profile';
import { TouchableOpacity } from 'react-native';

interface props {
    navigation: any,
    state: any
}

interface IProps {
    changeScreen: any,
    tabName: string
}

const MainLayout = (p: IProps) => {

    const [checkout, setCheckout] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const logged: boolean = Service.logged()
    const { Navigator, Screen } = createBottomTabNavigator();
    const navigation = useNavigation<any>()
    const homeRef = useRef<any>()
    const historyRef = useRef<any>()
    const menuRef = useRef<any>()

    const getIcon = (props: any, name: string): IconElement => (
        <Icon {...props} name={name} />
    );

    const handleLogout = () => {
        navigation.navigate('Login')
    }

    const changeScreen = (name: any, option: any) => {
        p.changeScreen(name, option)
    }

    const BottomTabBar = (props: props) => (
        <BottomNavigation
            selectedIndex={props.state.index}
            onSelect={index => {
                props.navigation.navigate(props.state.routeNames[index])
                if (index === 0) {
                    homeRef.current?.setLoadData()
                } else if (index === 1) {
                    historyRef.current?.setLoadData()
                } else if (index === 2) {
                    menuRef.current?.setLoadData()
                }
            }}>
            <BottomNavigationTab title='Home' icon={props => getIcon(props, 'home-outline')} />
            <BottomNavigationTab title='History' icon={props => getIcon(props, 'calendar-outline')} />
            <BottomNavigationTab title='Menu' icon={props => getIcon(props, 'gift-outline')} />
            <BottomNavigationTab title='Profile' icon={props => getIcon(props, 'person-outline')} />
        </BottomNavigation>
    );

    const TabNavigator = () => (
        <Navigator initialRouteName={p.tabName} tabBar={props => <BottomTabBar {...props} />}>
            <Screen name='Home' component={() => <Home setCheckout={setCheckout} />} />
            <Screen name='History' component={() => <History ref={historyRef} />} />
            <Screen name='Menu' component={() => <Menu ref={menuRef} />} />
            <Screen name='Profile' component={() => <Profile changeScreen={changeScreen} handleLogout={handleLogout} />} />
        </Navigator>
    );

    const handlePress = () => {
        p.changeScreen('CreateOrder')
    };

    React.useEffect(() => {
        if (!logged) {
            navigation.navigate('Login')
        }
        return () => { }
    }, [])

    return (
        <>

            <NavigationIndependentTree>
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </NavigationIndependentTree>
            {checkout ? <>
                <TouchableOpacity style={{
                    backgroundColor: '#157347',
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 6,
                    right: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                }} onPress={handlePress}>
                    <Octicons name="checklist" size={24} color="white" />
                </TouchableOpacity>
            </> : <></>}
            <TouchableOpacity style={{
                backgroundColor: '#dc3545',
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 40,
                left: 165,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }} onPress={handlePress}>
                <Octicons name="paste" size={24} color="white" />
            </TouchableOpacity>
        </>
    )
}


export default MainLayout