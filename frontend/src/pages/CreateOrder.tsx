import React, { useRef, useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, Select, SelectItem, IconElement, Modal, Layout, Text, Card, Input, Button, IndexPath } from '@ui-kitten/components';
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

    const [confirm, setConfirm] = React.useState(false);
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
    const [errorResponse, setErrorResponse] = useState('')
    const [maxRating, setMaxRating] = useState(0)
    const [customerName, setCustomerName] = useState('')
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : null
    const [search, setSearch] = useState('')
    const [errorCustomerName, setErrorCustomerName] = useState('')
    const [errorOrderType, setErrorOrderType] = useState('')
    const [errorTable, setErrorTable] = useState('')
    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const [selectedTableIndex, setSelectedTableIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const [successResponse, setSuccessResponse] = React.useState('');


    const getIcon = (props: any, name: string): IconElement => (
        <Icon {...props} name={name} />
    );

    const BottomTabBar = (props: props) => (
        <BottomNavigation
            selectedIndex={props.state.index}
            onSelect={(index) => {
                // console.log(props, index)
                props.navigation.navigate(props.state.routeNames[index])
            }}>
            <BottomNavigationTab key={0} title='List Menu' icon={props => getIcon(props, 'shopping-cart-outline')} />
            <BottomNavigationTab key={1} title={`Detail $ (${parseFloat(String(totalPaid)).toFixed(2)})`} icon={props => getIcon(props, 'calendar-outline')} />
            <BottomNavigationTab key={2} title='Checkout' icon={props => getIcon(props, 'layout-outline')} />
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

    const handleCustomerName = (value: string) => {
        setCustomerName(value)
        if (!value) {
            setErrorCustomerName('This field is required.')
        } else {
            setErrorCustomerName('')
        }
    }

    const handleOrderType = (value: string) => {
        setOrderType(value)
        if (!value) {
            setErrorOrderType('This field is required.')
        } else {
            setErrorOrderType('')
        }
    }

    const handleTable = (value: string) => {
        setTableSelected(value)
        if (!value) {
            setErrorTable('This field is required.')
        } else {
            setErrorTable('')
        }
    }

    const renderCaption = (field: string): React.ReactElement => {
        let errorMessage = ""
        if (field === 'customerName') {
            errorMessage = errorCustomerName
        } else if (field === 'orderType') {
            errorMessage = errorOrderType
        } else if (field === 'tableSelected') {
            errorMessage = errorTable
        }
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text status='danger' style={{
                    fontSize: 10
                }}>
                    {errorMessage}
                </Text>
            </View>
        );
    };

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
                    </> : <>
                        {errorResponse ? <>
                            <View style={{ marginTop: 20, alignItems: 'center' }}>
                                <Text style={{
                                    backgroundColor: '#dc3545',
                                    alignContent: 'stretch',
                                    fontSize: 12,
                                    paddingHorizontal: 10,
                                    paddingVertical: 20,
                                    color: '#fff',
                                    borderRadius: 5,
                                    alignSelf: 'stretch'
                                }}>
                                    {errorResponse}
                                </Text>
                            </View>
                        </> : <></>}
                        {successResponse ? <>
                            <View style={{ marginTop: 20, alignItems: 'center' }}>
                                <Text style={{
                                    backgroundColor: '#198754',
                                    alignContent: 'stretch',
                                    fontSize: 12,
                                    paddingHorizontal: 10,
                                    paddingVertical: 20,
                                    color: '#fff',
                                    borderRadius: 5,
                                    alignSelf: 'stretch'
                                }}>
                                    {successResponse}
                                </Text>
                            </View>
                        </> : <></>}
                        <Input
                            label='Order Number'
                            placeholder='Please Enter Your Order Number'
                            value={orderNumber}
                            style={{ marginBottom: 10 }}
                            readOnly={true}
                            status={'basic'}
                        />
                        <Input
                            label='Customer Name'
                            placeholder='Please Enter Your Customer Name'
                            value={customerName}
                            style={{ marginBottom: 10 }}
                            caption={renderCaption('customerName')}
                            onChangeText={nextValue => handleCustomerName(nextValue)}
                            status={errorCustomerName ? 'danger' : 'basic'}
                        />
                        <Select
                            label='Order Type'
                            placeholder='Please Enter Your Order Type'
                            style={{ marginBottom: 10 }}
                            value={orderType === '1' ? 'Dine In' : 'Take Away'}
                            status={errorOrderType ? 'danger' : 'basic'}
                            selectedIndex={selectedIndex}
                            onSelect={index => {
                                const selected: any = index
                                setSelectedIndex(index)
                                handleOrderType(selected.row === 0 ? '1' : '2')
                            }}
                        >
                            <SelectItem title={'Dine In'} />
                            <SelectItem title={'Take Away'} />
                        </Select>
                        {orderType === '1' ? <>
                            <Select
                                label='Table'
                                placeholder='Please Enter Your Table'
                                style={{ marginBottom: 10 }}
                                value={tableSelected ? tableSelected : tables[0].name}
                                status={errorTable ? 'danger' : 'basic'}
                                selectedIndex={selectedTableIndex}
                                onSelect={index => {
                                    const selected: any = index
                                    const row = selected.row
                                    const tabget = tables[row]
                                    setSelectedTableIndex(index)
                                    handleTable(tabget.name)
                                }}
                            >
                                {tables.map((aa, index) => (
                                    <SelectItem key={index} title={aa.name} />
                                ))}
                            </Select>
                        </> : <></>}
                        <Input
                            label='Total Paid'
                            placeholder='Please Enter Your Total Paid'
                            value={String(totalPaid)}
                            style={{ marginBottom: 10 }}
                            readOnly={true}
                            status={'basic'}
                        />
                        {orderType === '1' ? <>
                            <Button style={{ flexDirection: 'row', flex: 1, }} size='small' status='primary' onPress={() => setConfirm(true)}>
                                Save Order
                            </Button>
                        </> : <>
                            <Button style={{ flexDirection: 'row', flex: 1, }} size='small' status='success' onPress={() => setConfirm(true)}>
                                Checkout Payment
                            </Button>
                        </>}
                    </>}
                </ScrollView>
            </Layout>
        )
    }


    const TabNavigator = () => (
        <Navigator initialRouteName={'List Menu'} tabBar={props => <BottomTabBar {...props} />}>
            <Screen key={0} name='List Menu' component={(props: any) => (<ListMenu  {...props} />)} />
            <Screen key={1} name='Detail Order' component={(props: any) => (<DetailOrder  {...props} />)} />
            <Screen key={2} name='Checkout' component={(props: any) => (<Checkout  {...props} />)} />
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

    const handleSubmit = () => {

    }

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
            <TabNavigator />
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
            <Modal
                visible={confirm}
                animationType='none'
                backdropStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onBackdropPress={() => setConfirm(false)}
            >
                <Card disabled={true}>
                    <Text>
                        Are you sure you want to process this order ?
                    </Text>
                    <View style={{ marginTop: 50, flexDirection: 'row' }}>
                        <Button style={{ flexDirection: 'row', flex: 1, marginRight: 10 }} size='small' onPress={handleSubmit}>
                            Ok, Continue
                        </Button>
                        <Button style={{ flexDirection: 'row', flex: 1, }} size='small' status='danger' onPress={() => setConfirm(false)}>
                            Cancel
                        </Button>
                    </View>
                </Card>
            </Modal>
        </>
    )
}


export default CreateOrder