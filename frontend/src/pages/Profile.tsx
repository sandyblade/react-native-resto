import React from 'react';
import { Layout, Input, Text, Button, Spinner, Modal, Card, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { View, ViewProps } from 'react-native';
import Service from '../Service';

interface IProps {
    handleLogout: any,
    changeScreen: any
}

interface userInterface {
    email: string,
    phone: string,
    gender: string,
    name: string,
    address: string
}

const Profile = (p: IProps) => {

    const [confirm, setConfirm] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [errorName, setErrorName] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [errorGender, setErrorGender] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [errorPhone, setErrorPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [errorEmail, setErrorEmail] = React.useState('');
    const [errorResponse, setErrorResponse] = React.useState('');
    const [successResponse, setSuccessResponse] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [errorAddress, setErrorAddress] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const user: userInterface | null = (localStorage.getItem('auth_user') !== undefined && localStorage.getItem('auth_user') !== null) ? JSON.parse(String(localStorage.getItem('auth_user'))) : null


    const LoadingIndicator = (props: any): React.ReactElement => (
        <View style={[props.style, {
            justifyContent: 'center',
            alignItems: 'center',
        }]}>
            {loading ? <Spinner status='basic' size='small' /> : <></>}
        </View>
    );



    const renderCaption = (field: string): React.ReactElement => {
        let errorMessage = ""
        if (field === 'name') {
            errorMessage = errorName
        } else if (field === 'gender') {
            errorMessage = errorGender
        } else if (field === 'phone') {
            errorMessage = errorPhone
        } else if (field === 'email') {
            errorMessage = errorEmail
        } else if (field === 'address') {
            errorMessage = errorAddress
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

    const handleName = (value: string) => {
        setName(value)
        if (!value) {
            setErrorName('This field is required.')
        } else {
            setErrorName('')
        }
    }

    const handleGender = (value: string) => {
        setGender(value)
        if (!value) {
            setErrorGender('This field is required.')
        } else {
            setErrorGender('')
        }
    }

    const handlePhone = (value: string) => {
        setPhone(value)
        if (!value) {
            setErrorPhone('This field is required.')
        } else {
            setErrorPhone('')
        }
    }

    const handleAddress = (value: string) => {
        setAddress(value)
        if (!value) {
            setErrorAddress('This field is required.')
        } else {
            setErrorAddress('')
        }
    }

    const handleEmail = (value: string) => {
        setEmail(value)
        if (!value) {
            setErrorEmail('This field is required.')
        } else {
            const result = validateEmail(value)
            setErrorEmail(!result ? 'Please enter a valid email address.' : '')
        }
    }

    const handleSubmit = async () => {
        if (!name) {
            setErrorEmail('This field is required.')
        } else if (!gender) {
            setErrorGender('This field is required.')
        } else if (!email) {
            setEmail('This field is required.')
        } else if (!phone) {
            setPhone('This field is required.')
        } else {
            let form = {
                name: name,
                email: email,
                phone: phone,
                gender: gender.toLowerCase(),
                address: address
            }
            setLoading(true)
            setErrorResponse('')
            setSuccessResponse('')
            setTimeout(async () => {
                await Service.profile.changeProfile(form)
                    .then(async (response) => {

                        const profile = await Service.profile.detail()
                        if (localStorage.getItem('auth_user')) {
                            localStorage.setItem('auth_user', JSON.stringify(profile.data))
                        }

                        setLoading(false)
                        setSuccessResponse(response.data.message)
                    })
                    .catch((error) => {
                        setLoading(false)
                        setErrorResponse(error.response.data?.error)
                    })
            }, 2000)
        }
    }

    const handleLogOut = async () => {
        setConfirm(true)
    }

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

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

    React.useEffect(() => {
        if (user !== null) {
            setName(user.name)
            setPhone(user.phone)
            setEmail(user.email)
            setAddress(user.address)
            setGender(user.gender === 'male' ? 'Male' : 'Female')
        }
    }, []);

    return (
        <>
            <Layout style={{ flex: 1, padding: 10 }}>
                <Card
                    header={() => Header('Current Profile')}
                >
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
                    <View style={{ marginTop: 5, padding: 1 }}>
                        <Input
                            label='Full Name'
                            placeholder='Please Enter Your Name'
                            value={name}
                            style={{ marginBottom: 10 }}
                            caption={renderCaption('name')}
                            disabled={loading}
                            onChangeText={nextValue => handleName(nextValue)}
                            status={errorName ? 'danger' : 'basic'}
                        />
                        <Select
                            label='Gender'
                            placeholder='Please Enter Your Gender'
                            style={{ marginBottom: 10 }}
                            disabled={loading}
                            value={gender}
                            status={errorGender ? 'danger' : 'basic'}
                            selectedIndex={selectedIndex}
                            onSelect={index => {
                                const selected: any = index
                                setSelectedIndex(index)
                                setGender(selected.row === 0 ? 'Male' : 'Female')
                            }}
                        >
                            <SelectItem title={'Male'} />
                            <SelectItem title={'Female'} />
                        </Select>
                        <Input
                            label='E-Mail Address'
                            placeholder='Please Enter Your E-Mail Address'
                            value={email}
                            style={{ marginBottom: 10 }}
                            caption={renderCaption('email')}
                            disabled={loading}
                            onChangeText={nextValue => handleEmail(nextValue)}
                            status={errorEmail ? 'danger' : 'basic'}
                        />
                        <Input
                            label='Phone Number'
                            placeholder='Please Enter Your Phone Number'
                            value={phone}
                            style={{ marginBottom: 10 }}
                            caption={renderCaption('phone')}
                            disabled={loading}
                            onChangeText={nextValue => handlePhone(nextValue)}
                            status={errorPhone ? 'danger' : 'basic'}
                        />
                        <Input
                            multiline={true}
                            textStyle={{
                                minHeight: 64,
                            }}
                            label='Street Address'
                            placeholder='Please Enter Your Street Address'
                            value={address}
                            style={{ marginBottom: 10 }}
                            caption={renderCaption('address')}
                            disabled={loading}
                            onChangeText={nextValue => handleAddress(nextValue)}
                            status={errorPhone ? 'danger' : 'basic'}
                        />
                        {
                            loading ? <>
                                <Button
                                    status='basic'
                                    style={{ marginBottom: 10 }}
                                    onPress={handleSubmit}
                                    disabled={true}
                                    accessoryLeft={LoadingIndicator}
                                >
                                    Sending Request.....
                                </Button>
                            </> : <>
                                <Button
                                    status='primary'
                                    style={{ marginBottom: 10 }}
                                    onPress={handleSubmit}
                                >
                                    Update Current Profile
                                </Button>
                            </>
                        }

                    </View>
                </Card>
                <Button
                    status='warning'
                    style={{ marginBottom: 10, marginTop: 5 }}
                    onPress={() => {
                        p.changeScreen('ChangePassword')
                    }}
                >
                    Change Password
                </Button>
                <Button
                    status='danger'
                    style={{ marginBottom: 10 }}
                    onPress={handleLogOut}
                >
                    Log Out Application
                </Button>
            </Layout>
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
                        Are you sure you want to log out ?
                    </Text>
                    <View style={{ marginTop: 50, flexDirection: 'row' }}>
                        <Button style={{ flexDirection: 'row', flex: 1, marginRight: 10 }} size='small' onPress={() => {

                            if (localStorage.getItem('auth_token')) {
                                localStorage.removeItem('auth_token')
                            }

                            if (localStorage.getItem('auth_user')) {
                                localStorage.removeItem('auth_user')
                            }

                            setConfirm(false)
                            setTimeout(() => {
                                if (p !== undefined) {
                                    p.handleLogout()
                                }
                            }, 500)
                        }}>
                            Ok, Log Out
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


export default Profile