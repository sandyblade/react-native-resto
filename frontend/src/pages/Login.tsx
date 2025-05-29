import React from 'react';
import { TouchableHighlight, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Input, Text, Layout, Button, Spinner } from '@ui-kitten/components';
import Service from '../Service';

const Login = () => {

    const navigation = useNavigation<any>()
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [errorEmail, setErrorEmail] = React.useState('');
    const [errorPassword, setErrorPassword] = React.useState('');
    const [errorResponse, setErrorResponse] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const toggleSecureEntry = (): void => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (props: any): React.ReactElement => (
        <TouchableHighlight onPress={toggleSecureEntry} underlayColor="white">
            <View><Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} /></View>
        </TouchableHighlight>
    );

    const LoadingIndicator = (props: any): React.ReactElement => (
        <View style={[props.style, {
            justifyContent: 'center',
            alignItems: 'center',
        }]}>
            {loading ? <Spinner status='basic' size='small' /> : <></>}
        </View>
    );

    const renderCaption = (field: string): React.ReactElement => {
        return (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <Text status='danger' style={{
                    fontSize: 10
                }}>
                    {field === 'email' ? errorEmail : errorPassword}
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

    const validatePassword = (p: string) => {
        let errors: Array<string> = []
        if (p.length < 8) {
            errors.push("Your password must be at least 8 characters");
        }
        if (p.search(/[a-z]/i) < 0) {
            errors.push("Your password must contain at least one letter.");
        }
        if (p.search(/[0-9]/) < 0) {
            errors.push("Your password must contain at least one digit.");
        }
        if (errors.length > 0) {
            return errors.join("\n")
        }
        return ''
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

    const handlePassword = (value: string) => {
        setPassword(value)
        if (!value) {
            setErrorPassword('This field is required.')
        } else {
            const result = validatePassword(value)
            setErrorPassword(result)
        }
    }

    const handleSubmit = async () => {
        if (!email) {
            setErrorEmail('This field is required.')
        } else if (!password) {
            setErrorPassword('This field is required.')
        } else {
            let form = {
                email: email,
                password: password
            }
            setLoading(true)
            setErrorResponse('')
            setTimeout(async () => {
                await Service.auth.login(form)
                    .then(async (response) => {
                        setLoading(false)

                        const token = response.data.token
                        if (!localStorage.getItem('auth_token')) {
                            localStorage.setItem('auth_token', token)
                        }

                        const profile = await Service.profile.detail()
                        if (!localStorage.getItem('auth_user')) {
                            localStorage.setItem('auth_user', JSON.stringify(profile.data))
                        }

                        setTimeout(() => {
                            navigation.navigate('Main')
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
                    Login to your account
                </Text>
                <Text style={{ marginTop: 12, alignContent: 'stretch', fontSize: 12 }}>
                    Please sign in with your e-mail address and correct password.
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
                    caption={renderCaption('email')}
                    disabled={loading}
                    onChangeText={nextValue => handleEmail(nextValue)}
                    status={errorEmail ? 'danger' : 'basic'}
                />
                <Input
                    label='Password'
                    placeholder='Please Enter Your Password'
                    value={password}
                    accessoryRight={renderIcon}
                    secureTextEntry={secureTextEntry}
                    caption={renderCaption('password')}
                    style={{ marginBottom: 10 }}
                    disabled={loading}
                    onChangeText={nextValue => handlePassword(nextValue)}
                    status={errorPassword ? 'danger' : 'basic'}
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
                            Signing.....
                        </Button>
                    </> : <>
                        <Button
                            status='primary'
                            style={{ marginBottom: 10 }}
                            onPress={handleSubmit}
                        >
                            Sign In Now
                        </Button>
                    </>
                }
                <Button
                    status='warning'
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    Forgot Password ?
                </Button>
            </View>
        </Layout>
    )
}


export default Login