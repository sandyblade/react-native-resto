import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Icon, Text, Layout, Button, Card } from '@ui-kitten/components';
import Service from '../Service';
import { Shimmer } from 'react-shimmer'
import Rating from '../components/Rating';

const Home = () => {

    const [products, setProducst] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [errorReseponse, setErrorResponse] = useState('')
    const [loading, setLoading] = useState(true)
    const [totalSales, setTotalSales] = useState(0)
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalDineIn, setTotalDineIn] = useState(0)
    const [totalTakeAway, setTotalTakeAway] = useState(0)
    const [maxRating, setMaxRating] = useState(0)

    const loadData = async () => {
        setLoading(true)
        await Service.home.summary()
            .then((response) => {
                const data = response.data
                setTotalSales(data.total_sales)
                setTotalOrder(data.total_orders)
                setTotalDineIn(data.total_dine_in)
                setTotalTakeAway(data.total_take_away)
                setProducst(data.products)
                setTables(data.tables)

                if (data.products.length > 0) {
                    const top = data.products[0]
                    setMaxRating(top.rating)
                }

                setTimeout(() => {
                    setLoading(false)
                }, 1500)
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                setErrorResponse(msg)
            })
    }

    const Header = (title: string): React.ReactElement => (
        <View style={{
            backgroundColor: 'rgb(51, 102, 255)',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text category='s1' style={{ color: '#fff' }}>
                {title}
            </Text>
        </View>
    );

    useEffect(() => {
        loadData();
        return () => {
            setTables([])
            setProducst([])
            setTotalSales(0)
            setTotalOrder(0)
            setTotalDineIn(0)
            setTotalTakeAway(0)
            setLoading(true)
            setErrorResponse('')
            setMaxRating(0)
        };
    }, []);

    return (
        <Layout style={{ flex: 1, padding: 10 }}>
            <ScrollView>
                <Card
                    header={() => Header('Summary')}
                    style={{ marginBottom: 10 }}
                >
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        {loading ? <>
                            {Array.from(Array(4), (e, i) => {
                                return (
                                    <View key={i} style={{ flex: 4 }} >
                                        <Shimmer width={70} height={80} />
                                    </View>
                                )
                            })}
                        </> : <>
                            <View style={{ flex: 1, }} >
                                <Icon name="gift-outline" fill='#198754' />
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#198754", fontSize: 10, marginBottom: 3 }}
                                >Revenue
                                </Text>
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#198754", fontSize: 13.5 }}
                                >$ {parseFloat(String(totalSales)).toFixed(2)}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Icon name="shopping-cart-outline" fill='#0d6efd' />
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#0d6efd", fontSize: 10, marginBottom: 3 }}
                                >Orders
                                </Text>
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#0d6efd", fontSize: 13.5 }}
                                >{totalOrder} Sales
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Icon name="pin-outline" fill='#dc3545' />
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#dc3545", fontSize: 10, marginBottom: 3 }}
                                >Dine In
                                </Text>
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#dc3545", fontSize: 13.5 }}
                                >{Math.round(totalDineIn)} Orders
                                </Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Icon name="navigation-2-outline" fill='#712cf9' />
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#712cf9", fontSize: 10, marginBottom: 3 }}
                                >Take Away
                                </Text>
                                <Text
                                    style={{ textAlign: 'center', alignItems: 'center', fontWeight: 'bold', color: "#712cf9", fontSize: 13.5 }}
                                >{Math.round(totalTakeAway)} Orders
                                </Text>
                            </View>
                        </>}
                    </View>
                </Card>
                <Card
                    header={() => Header('Dine In Tables')}
                    style={{ marginBottom: 10 }}
                >
                    {loading ? <>
                        {Array.from(Array(4), (x, j) => {
                            return (
                                <View key={j} style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    {Array.from(Array(3), (e, i) => {
                                        return (
                                            <View key={i} style={{ flex: 3 }} >
                                                <Shimmer width={100} height={80} />
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </> : <>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            {tables.slice(0, 3).map((table, index) => (
                                <View key={index} style={{ flex: 3, alignItems: 'center', }} >
                                    <Image source={{ uri: 'https://5an9y4lf0n50.github.io/demo-images/demo-resto/table.png' }} style={{ width: 70, height: 70 }} />
                                    <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>{table.name}</Text>
                                    <Button status={table.status === 1 ? 'success' : 'danger'} size='tiny'>{table.status === 1 ? 'Available' : 'Reserved'}</Button>
                                </View>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            {tables.slice(3, 6).map((table, index) => (
                                <View key={index} style={{ flex: 3, alignItems: 'center', }} >
                                    <Image source={{ uri: 'https://5an9y4lf0n50.github.io/demo-images/demo-resto/table.png' }} style={{ width: 70, height: 70 }} />
                                    <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>{table.name}</Text>
                                    <Button status={table.status === 1 ? 'success' : 'danger'} size='tiny'>{table.status === 1 ? 'Available' : 'Reserved'}</Button>
                                </View>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            {tables.slice(6, 9).map((table, index) => (
                                <View key={index} style={{ flex: 3, alignItems: 'center', }} >
                                    <Image source={{ uri: 'https://5an9y4lf0n50.github.io/demo-images/demo-resto/table.png' }} style={{ width: 70, height: 70 }} />
                                    <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>{table.name}</Text>
                                    <Button status={table.status === 1 ? 'success' : 'danger'} size='tiny'>{table.status === 1 ? 'Available' : 'Reserved'}</Button>
                                </View>
                            ))}
                        </View>
                    </>}
                </Card>
                <Card
                    header={() => Header('Best Seller')}
                    style={{ marginBottom: 10 }}
                >
                    {loading ? <>
                        {Array.from(Array(5), (x, j) => {
                            return (
                                <View key={j} style={{ flexDirection: 'row', marginBottom: 5 }}>
                                    <Shimmer width={500} height={70} />
                                </View>
                            )
                        })}
                    </> : <>
                        {products.map((item, index) => {
                            return (
                                <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: 5, borderWidth: 1, borderColor: "#eee" }} />
                                    </View>
                                    <View style={{ flex: 2, padding: 5 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#28a745', marginBottom: 5 }}>${parseFloat(item.price['$numberDecimal'].toLocaleString()).toFixed(2)}</Text>
                                        <Rating maxRating={maxRating} rating={item.rating} />
                                    </View>
                                </View>
                            )
                        })}
                    </>}
                </Card>
            </ScrollView>
        </Layout>
    )
}


export default Home