import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Icon, Text, Layout, Button, Card, Input } from '@ui-kitten/components';
import Service from '../Service';
import { Shimmer } from 'react-shimmer'
import Rating from '../components/Rating';

const Menu = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        setLoadData() {
            loadData()
        }
    }));

    const [items, setItems] = useState<any[]>([]);
    const [itemOriginal, setItemOriginial] = useState<any[]>([]);
    const [filter, setFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [errorReseponse, setErrorResponse] = useState('')
    const [maxRating, setMaxRating] = useState(0)
    const [search, setSearch] = useState('')

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

    const loadData = async () => {
        setLoading(true)
        await Service.menu.list()
            .then((response) => {
                const data = response.data
                setItems(data)
                setItemOriginial(data)

                if (data.length > 0) {
                    const top = data[0]
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

    const renderIcon = (props: any): React.ReactElement => (
        <View><Icon {...props} name={'maximize-outline'} /></View>
    );


    useEffect(() => {
        loadData();
        return () => {
            setItems([])
            setItemOriginial([])
            setFilter('all')
            setLoading(true)
            setErrorResponse('')
            setMaxRating(0)
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
                                <Card key={index} style={{ marginBottom: 10 }}>
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
                                </Card>
                            )
                        })}
                    </View>
                </>}
            </ScrollView>
        </Layout>
    )

})


export default Menu