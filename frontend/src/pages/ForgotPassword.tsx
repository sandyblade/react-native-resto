import React from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Text, Layout, Button, Spinner } from '@ui-kitten/components';
import Service from '../Service';

const ForgotPassword = () => {

    const navigation = useNavigation<any>()
    const [email, setEmail] = React.useState('');
    const [errorEmail, setErrorEmail] = React.useState('');
    const [errorResponse, setErrorResponse] = React.useState('');
    const [successResponse, setSuccessResponse] = React.useState('');
    const [loading, setLoading] = React.useState(false);


    const LoadingIndicator = (props: any): React.ReactElement => (
        <View style={[props.style, {
            justifyContent: 'center',
            alignItems: 'center',
        }]}>
            {loading ? <Spinner status='basic' size='small' /> : <></>}
        </View>
    );

    const renderCaption = (): React.ReactElement => {
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text status='danger' style={{
                    fontSize: 10
                }}>
                    {errorEmail}
                </Text>
            </View>
        );
    };

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

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
        if (!email) {
            setErrorEmail('This field is required.')
        } else {
            let form = {
                email: email,
            }
            setLoading(true)
            setErrorResponse('')
            setSuccessResponse('')
            setTimeout(async () => {
                await Service.auth.forgot(form)
                    .then(async (response) => {
                        setLoading(false)
                        let messsage = response.data.message
                        let token = response.data.token
                        setSuccessResponse(messsage)
                        setTimeout(() => {
                            navigation.navigate('ResetPassword', {
                                token: token
                            });
                        }, 1500)
                    })
                    .catch((error) => {
                        setLoading(false)
                        setErrorResponse(error.response.data?.error)
                    })
            }, 2000)
        }
    }

    return (
        <Layout style={{ flex: 1 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                <Text style={{ margin: 2, alignContent: 'stretch', fontSize: 23 }}>
                    Forgot Password
                </Text>
                <Text style={{ marginTop: 12, alignContent: 'stretch', fontSize: 12 }}>
                    We'll e-mail you instructions on how to reset your password.
                </Text>
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={{
                        uri: 'https://5an9y4lf0n50.github.io/demo-images/demo-resto/burger.png',
                    }}
                />
            </View>
            {successResponse ? <>
                <View style={{ marginTop: 20, alignItems: 'center', paddingHorizontal: 20 }}>
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
            {errorResponse ? <>
                <View style={{ marginTop: 20, alignItems: 'center', paddingHorizontal: 20 }}>
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
            <View style={{ marginTop: 1, padding: 20 }}>
                <Input
                    label='E-Mail Address'
                    placeholder='Please Enter Your E-Mail Address'
                    value={email}
                    style={{ marginBottom: 10 }}
                    caption={renderCaption()}
                    disabled={loading}
                    onChangeText={nextValue => handleEmail(nextValue)}
                    status={errorEmail ? 'danger' : 'basic'}
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
                            Request Password Reset
                        </Button>
                    </>
                }
                <Button
                    status='warning'
                    onPress={() => navigation.navigate('Login')}
                >
                    Back To Sign In
                </Button>
            </View>
        </Layout>
    )

}


export default ForgotPassword