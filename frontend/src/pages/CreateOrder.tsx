import React, { useRef, useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconElement, Modal, Layout, Text, Card, Input, Button } from '@ui-kitten/components';
import { NavigationContainer, NavigationIndependentTree, } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Image, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Shimmer } from 'react-shimmer'
import Octicons from "@expo/vector-icons/Octicons";
import Service from '../Service';
import moment from 'moment'
import Rating from '../components/Rating';

interface IProps {
    mainApp: any,
    changeScreen: any
}

interface props {
    navigation: any,
    state: any
}

interface userInterface {
    email: string,
    phone: string,
    gender: string,
    name: string,
    address: string
}

const CreateOrder = (p: IProps) => {

    const { Navigator, Screen } = createBottomTabNavigator();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [itemOriginal, setItemOriginial] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [totalPaid, setTotalPaid] = useState(0.0)
    const [filter, setFilter] = useState("all")
    const [orderType, setOrderType] = useState('1');
    const [tableSelected, setTableSelected] = useState("");
    const [tables, setTables] = useState<any[]>([]);
    const [orderNumber, setOrderNumber] = useState("0")
    const [errorReseponse, setErrorResponse] = useState('')
    const [maxRating, setMaxRating] = useState(0)
    const [customerName, setCustomerName] = useState('')
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : null
    const [search, setSearch] = useState('')

    const getIcon = (props: any, name: string): IconElement => (
        <Icon {...props} name={name} />
    );

    const BottomTabBar = (props: props) => (
        <BottomNavigation
            selectedIndex={props.state.index}
            onSelect={(index) => props.navigation.navigate(props.state.routeNames[index])}>
            <BottomNavigationTab title='List Menu' icon={props => getIcon(props, 'shopping-cart-outline')} />
            <BottomNavigationTab title={`Detail Order ($ ${parseFloat(String(totalPaid)).toFixed(2)})`} icon={props => getIcon(props, 'calendar-outline')} />
            <BottomNavigationTab title='Checkout' icon={props => getIcon(props, 'layout-outline')} />
        </BottomNavigation >
    );

    const handleItem = (menu: any) => {
        let newOrder = menu
        if (orders.length === 0) {
            setOrders((x) => [...x, newOrder]);
            setTotalPaid(menu.price)
        } else {
            let filter = orders.filter((item) => item.name === menu.name)
            if (filter.length === 0) {
                setOrders((x) => [...x, newOrder]);
                setTotalPaid(totalPaid + menu.price);
            } else {
                let sum = 0
                let updateOrders = orders.map(mn => {
                    if (mn.name === menu.name) {
                        let qty = parseInt(mn.qty) + 1
                        let total = parseFloat(mn.price) * qty
                        mn.qty = qty
                        mn.total = total
                    }
                    sum = sum + mn.total
                    return mn;
                });
                setOrders(updateOrders)
                setTotalPaid(sum)
            }
        }
    }

    const handlePlus = (item: any) => {
        let sum = 0
        let updateOrders = orders.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) + 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const handleMinus = (item: any) => {
        let sum = 0
        let updateOrders = orders.map(mn => {
            if (mn.name === item.name && parseInt(item.qty) > 1) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const handleRemove = (item: any) => {
        let sum = 0
        let updateOrders = orders.filter((order) => order.name !== item.name);
        orders.map(mn => {
            if (mn.name === item.name) {
                let qty = parseInt(mn.qty) - 1
                let total = parseFloat(mn.price) * qty
                mn.qty = qty
                mn.total = total
            }
            sum = sum + mn.total
            return mn;
        });
        setOrders(updateOrders)
        setTotalPaid(sum)
    }

    const ListMenu = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    {loading ? <>
                        {Array.from(Array(10), (e, i) => {
                            return (
                                <Card key={i} style={{ marginBottom: 10 }}>
                                    <Shimmer width={312} height={80} />
                                </Card>
                            )
                        })}
                    </> : <>
                        <View style={{ marginBottom: 10 }}>
                            <Input
                                label='Search Menu'
                                placeholder='Please Enter Your Keyword'
                                value={search}
                                accessoryRight={renderIcon}
                                onChangeText={nextValue => handleInput(nextValue)}
                            />
                        </View>
                        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                            <Button onPress={() => handleFilter("Appetizer")} disabled={filter === 'Appetizer'} style={{ flex: 1, marginRight: 1 }} status={filter !== 'Appetizer' ? 'success' : 'basic'} size='tiny'>Appetizer</Button>
                            <Button onPress={() => handleFilter("Main Course")} disabled={filter === 'Main Course'} style={{ flex: 1, marginRight: 1 }} status={filter !== 'Main Course' ? 'danger' : 'basic'} size='tiny'>Main Course</Button>
                            <Button onPress={() => handleFilter("Dessert")} disabled={filter === 'Dessert'} style={{ flex: 1, marginRight: 1 }} status={filter !== 'Dessert' ? 'warning' : 'basic'} size='tiny'>Dessert</Button>
                            <Button onPress={() => handleFilter("all")} disabled={filter === 'all'} style={{ flex: 1 }} status={filter !== 'all' ? 'primary' : 'basic'} size='tiny'>All Category</Button>
                        </View>
                        <View>
                            {items.map((item, index) => {
                                return (
                                    <Card key={index} onPressIn={() => handleItem(item)} style={{ marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: 5, borderWidth: 1, borderColor: "#eee" }} />
                                            </View>
                                            <View style={{ flex: 2, padding: 5 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#28a745', marginBottom: 5 }}>${parseFloat(item.price).toFixed(2)}</Text>
                                                <Rating maxRating={maxRating} rating={item.rating} />
                                            </View>
                                        </View>
                                    </Card>
                                )
                            })}
                        </View>
                    </>}
                </ScrollView>
            </Layout>
        )
    }

    const DetailOrder = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    {orders.length === 0 ? <>
                        <Card style={{ marginBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 3, fontWeight: 'bold', fontSize: 12, alignContent: 'center', textAlign: 'center' }}>
                                    No Data Available in Orders
                                </Text>
                            </View>
                        </Card>
                    </> : <>
                        <View>
                            {orders.map((item, index) => {
                                return (
                                    <Card key={index} onPressIn={() => handleItem(item)} style={{ marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <View style={{ flex: 1 }}>
                                                <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: 5, borderWidth: 1, borderColor: "#eee" }} />
                                            </View>
                                            <View style={{ flex: 2, padding: 5 }}>
                                                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#157347', marginBottom: 5 }}>( ${parseFloat(item.price).toFixed(2)} x {item.qty} )</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#28a745', marginBottom: 5 }}>${parseFloat(item.total).toFixed(2)}</Text>
                                                <Rating maxRating={maxRating} rating={item.rating} />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <Button onPress={(e) => handleMinus(item)} style={{ marginRight: 1, flex: 1 }} status={'warning'} size='tiny' accessoryLeft={(props) => getIcon(props, 'minus-circle-outline')}>Reduce Qty</Button>
                                            <Button onPress={(e) => handlePlus(item)} style={{ marginRight: 1, flex: 1 }} status={'success'} size='tiny' accessoryLeft={(props) => getIcon(props, 'plus-outline')}>Add Qty</Button>
                                            <Button onPress={(e) => handleRemove(item)} style={{ flex: 1 }} status={'danger'} size='tiny' accessoryLeft={(props) => getIcon(props, 'trash-outline')}>Remove</Button>
                                        </View>
                                    </Card>
                                )
                            })}
                        </View>
                    </>}
                </ScrollView>
            </Layout>
        )
    }

    const Checkout = () => {
        return (
            <Layout style={{ flex: 1, padding: 10 }}>
                <ScrollView>
                    {orders.length === 0 ? <>
                        <Card style={{ marginBottom: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ flex: 3, fontWeight: 'bold', fontSize: 12, alignContent: 'center', textAlign: 'center' }}>
                                    No Data Available in Orders
                                </Text>
                            </View>
                        </Card>
                    </> : <></>}
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

    const handlePress = () => {
        p.changeScreen('Main')
    }

    const randomIntFromInterval = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const loadData = async () => {
        setLoading(true)
        await Service.order.item()
            .then((response) => {
                const indexes = randomIntFromInterval(1, 1000)
                const orderNumberGenerate = String(indexes).padStart(5, '0')
                const data = response.data
                const menus = data.menus
                const menu: Array<any> = []
                const dateIndex = moment(new Date()).format("YYYYMMDD")
                menus.map((m: any) => {
                    const obj = {
                        id: m._id,
                        name: m.name,
                        image: m.image,
                        price: parseFloat(m.price['$numberDecimal']),
                        category: m.category,
                        rating: m.rating,
                        qty: 1,
                        total: parseFloat(m.price['$numberDecimal'])
                    }
                    menu.push(obj)
                })
                if (menus.length > 0) {
                    const top = menus[0]
                    setMaxRating(top.rating)
                }
                setItems(menu)
                setItemOriginial(menu)
                setTables(data.tables)
                setOrderNumber(`${dateIndex}${orderNumberGenerate}`)
                setCustomerName(`Customer ${orderNumberGenerate}`)
                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                setErrorResponse(msg)
            })
    }

    const handleInput = (searchValue: string) => {
        setSearch(searchValue)
        if (searchValue) {
            searchValue = searchValue.toLowerCase()
            let searchItems = itemOriginal.filter((item) => item.name.toLowerCase().includes(searchValue) || item.category.toLowerCase().includes(searchValue))
            setItems(searchItems)
        } else {
            setItems(itemOriginal)
        }
    }

    const handleFilter = (category: string) => {
        setFilter(category)
        if (category === 'all') {
            setItems(itemOriginal)
        } else {
            setItems(itemOriginal)
            let searchItems = itemOriginal.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()))
            if (searchItems.length > 0) {
                setItems(searchItems)
            }
        }
    }

    const renderIcon = (props: any): React.ReactElement => (
        <View><Icon {...props} name={'maximize-outline'} /></View>
    );

    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setItemOriginial([])
            setFilter('all')
            setOrders([])
            setLoading(true)
            setTotalPaid(0.0)
            setMaxRating(0)
            setCustomerName('')
            setTableSelected('')
        };
    }, []);

    return (
        <>
            <NavigationIndependentTree>
                <NavigationContainer>
                    <TabNavigator />
                </NavigationContainer>
            </NavigationIndependentTree>
            <TouchableOpacity style={{
                backgroundColor: '#dc3545',
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
                <Octicons name="x" size={24} color="white" />
            </TouchableOpacity>
        </>
    )
}


export default CreateOrder