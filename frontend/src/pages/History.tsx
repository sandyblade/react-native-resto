import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Image, ScrollView, RefreshControl } from 'react-native';
import { Icon, Text, Layout, Button, Card, Input } from '@ui-kitten/components';
import Service from '../Service';
import { Shimmer } from 'react-shimmer'
import queryString from 'query-string'

const History = forwardRef((props, ref) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(true)
    const [loadingDetail, setLoadingDetail] = useState(true)
    const [showDetail, setShowDetail] = useState(false)
    const [items, setItems] = useState<any[]>([]);
    const [cart, setCart] = useState<any[]>([]);
    const [order, setOrder] = useState<any>();
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const limit: number = 10

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const renderIcon = (props: any): React.ReactElement => (
        <View><Icon {...props} name={'maximize-outline'} /></View>
    );

    const addMore = async (pageMore: number) => {

        let params: any = {
            page: pageMore,
            limit: limit
        }

        if (search) {
            params = {
                ...params,
                search: search
            }
        }

        const filterQueryParam = decodeURIComponent(queryString.stringify(params))
        await Service.history.list(filterQueryParam)
            .then((response) => {
                const data = response.data
                setItems([...items, ...data])
            })
            .catch((error) => {
                const msg = error.status === 401 ? Service.expiredMessage : (error.message || error.response.data?.message)
                console.log(msg)
            })

    }

    const loadData = async () => {

        let params: any = {
            page: page,
            limit: limit
        }

        if (search) {
            params = {
                ...params,
                search: search
            }
        }

        const filterQueryParam = decodeURIComponent(queryString.stringify(params))

        setLoading(true)
        await Service.history.list(filterQueryParam)
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

    const onRefresh = React.useCallback(() => {
        const nextPage = page + 1
        setPage(nextPage)
        setRefreshing(true);
        setTimeout(async () => {
            await addMore(nextPage)
            setRefreshing(false);
        }, 1500);
    }, []);

    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setShowDetail(false)
            setLoading(false)
            setLoadingDetail(false)
            setSearch('')
            setCart([])
            setOrder({})
        };
    }, []);

    return (
        <Layout style={{ flex: 1, padding: 10 }}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
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
                            <View style={{ marginBottom: 10 }}>
                                <Input
                                    label='Search Order'
                                    placeholder='Please Enter Your Keyword'
                                    value={search}
                                    accessoryRight={renderIcon}
                                    onChangeText={nextValue => {
                                        setSearch(nextValue)
                                        setTimeout(() => {
                                            loadData()
                                        }, 1500)
                                    }}
                                />
                            </View>
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
                                        <Button size='small' onPress={() => handleView(item._id)} status={'primary'}>Show Detail Order</Button>
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
        </Layout>
    )

})

export default History