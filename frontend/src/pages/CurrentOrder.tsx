import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Text, Layout, Button, Card } from '@ui-kitten/components';
import Service from '../Service';
import { Shimmer } from 'react-shimmer'
import { TouchableOpacity } from 'react-native';
import Octicons from "@expo/vector-icons/Octicons";

interface IProps {
    changeScreen: any
}

const CurrentOrder = (p: IProps) => {

    const [loading, setLoading] = useState(true)
    const [loadingDetail, setLoadingDetail] = useState(true)
    const [showDetail, setShowDetail] = useState(false)
    const [items, setItems] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [order, setOrder] = useState<any>();


    const loadData = async () => {
        setLoading(true)
        await Service.order.pending()
            .then((response) => {
                const data = response.data
                setItems(data)
                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                console.log(msg)
            })
    }

    const handleView = async (id: string) => {
        setShowDetail(true)
        setLoadingDetail(true)
        await Service.order.detail(id)
            .then((response) => {
                const data = response.data
                setOrder(data.order)
                setCart(data.cart)
                setTimeout(() => {
                    setLoadingDetail(false)
                }, 1500)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handlePress = () => {
        p.changeScreen('Main')
    };

    const handleCheckOut = (order: string) => {
        p.changeScreen('CheckoutOrder', { orderId: order })
    };

    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setShowDetail(false)
            setLoading(false)
            setLoadingDetail(false)
            setCart([])
            setOrder({})
        };
    }, []);

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
                    {showDetail ? <>
                        {loadingDetail ? <>
                            {Array.from(Array(3), (e, i) => {
                                return (
                                    <Card key={i} style={{ marginBottom: 10 }}>
                                        <Shimmer width={312} height={80} />
                                    </Card>
                                )
                            })}
                        </> : <>
                            <View>
                                <View>
                                    {cart.map((item, index) => {
                                        return (
                                            <Card key={index} style={{ marginBottom: 10 }}>
                                                <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Image source={{ uri: item.menu_image }} style={{ width: 70, height: 70, borderRadius: 5, borderWidth: 1, borderColor: "#eee" }} />
                                                    </View>
                                                    <View style={{ flex: 2, padding: 5 }}>
                                                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{item.menu_name}</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#0d6efd', marginBottom: 5 }}>${parseFloat(item.price['$numberDecimal'].toLocaleString()).toFixed(2)} x {item.qty}</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#dc3545', marginBottom: 5 }}>${parseFloat(item.total['$numberDecimal'].toLocaleString()).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                            </Card>
                                        )
                                    })}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Card style={{ marginBottom: 10 }}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <Text style={{ flex: 3, fontWeight: 'bold', color: '#198754' }}>Total Paid</Text>
                                            <Text style={{ flex: 6, fontWeight: 'bold', color: '#198754' }}>${parseFloat(String(order.total_paid)).toFixed(2)}</Text>
                                        </View>
                                    </Card>
                                </View>
                                <Button size='small' onPress={() => setShowDetail(false)} status={'danger'}>Back To List</Button>
                            </View>
                        </>}
                    </> : <>
                        {items.length > 0 ? <>
                            {items.map((item, index) => {
                                return (
                                    <Card key={index} style={{ marginBottom: 10 }}>
                                        <View key={index} style={{ flexDirection: 'column', marginBottom: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3 }}>Order ID</Text>
                                                <Text style={{ flex: 5 }}>{" : "}{item.order_number}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3 }}>Order Type</Text>
                                                <Text style={{ flex: 5 }}>{" : "}{item.order_type}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3 }}>Order Date</Text>
                                                <Text style={{ flex: 5 }}>{" : "}{item.created_at}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3 }}>Customer Name</Text>
                                                <Text style={{ flex: 5 }}>{" : "}{item.customer_name}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3 }}>Casheir Name</Text>
                                                <Text style={{ flex: 5 }}>{" : "}{item.cashier_name}</Text>
                                            </View>
                                            {item.order_type === 'Dine In' ? <>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <Text style={{ flex: 3 }}>Table</Text>
                                                    <Text style={{ flex: 5 }}>{" : "}{item.table_number}</Text>
                                                </View>
                                            </> : <></>}
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3, fontWeight: 'bold' }}>Total Item</Text>
                                                <Text style={{ flex: 5, fontWeight: 'bold', color: '#198754' }}>{" : "}{item.total_item}{' Pieces'}</Text>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 3, fontWeight: 'bold' }}>Total Paid</Text>
                                                <Text style={{ flex: 5, fontWeight: 'bold', color: '#198754' }}>{" : "}${parseFloat(item.total_paid).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                        <Button size='small' style={{ marginBottom: 5 }} onPress={() => handleView(item._id)} status={'primary'}>Show Detail Order</Button>
                                        <Button size='small' onPress={() => handleCheckOut(item._id)} status={'danger'}>Checkout Order</Button>
                                    </Card>
                                )
                            })}
                        </> : <>
                            <Card style={{ marginBottom: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ flex: 3, fontWeight: 'bold', fontSize: 12, alignContent: 'center', textAlign: 'center' }}>
                                        No Data Available in Order Record
                                    </Text>
                                </View>
                            </Card>
                        </>}
                    </>}
                </>}
            </ScrollView>
            <TouchableOpacity style={{
                backgroundColor: '#dc3545',
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 5,
                left: 165,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            }} onPress={handlePress}>
                <Octicons name="x" size={24} color="white" />
            </TouchableOpacity>
        </Layout>
    )

}

export default CurrentOrder