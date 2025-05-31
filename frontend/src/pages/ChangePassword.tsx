import React from 'react';
import { TouchableHighlight, View, Image } from 'react-native';
import { Icon, Input, Text, Layout, Button, Spinner } from '@ui-kitten/components';
import Service from '../Service';

interface IProps {
    mainApp: any
}

const ChangePassword = (p: IProps) => {

    const [currentPassword, setCurrentPassword] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [secureTextEntryConfirm, setSecureTextEntryConfirm] = React.useState(true);
    const [secureTextEntryCurrent, setSecureTextEntryCurrent] = React.useState(true);
    const [errorPassword, setErrorPassword] = React.useState('');
    const [errorPasswordConfirm, setErrorPasswordConfirm] = React.useState('');
    const [errorPasswordCurrent, setErrorPasswordCurrent] = React.useState('');
    const [errorResponse, setErrorResponse] = React.useState('');
    const [successResponse, setSuccessResponse] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const toggleSecureEntry = (): void => {
        setSecureTextEntry(!secureTextEntry);
    };

    const toggleSecureEntryConfirm = (): void => {
        setSecureTextEntryConfirm(!secureTextEntryConfirm);
    };

    const toggleSecureEntryCurrent = (): void => {
        setSecureTextEntryCurrent(!secureTextEntryCurrent);
    };

    const renderIcon = (props: any): React.ReactElement => (
        <TouchableHighlight onPress={toggleSecureEntry} underlayColor="white">
            <View><Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} /></View>
        </TouchableHighlight>
    );

    const renderIconConfirm = (props: any): React.ReactElement => (
        <TouchableHighlight onPress={toggleSecureEntryConfirm} underlayColor="white">
            <View><Icon {...props} name={secureTextEntryConfirm ? 'eye-off' : 'eye'} /></View>
        </TouchableHighlight>
    );

    const renderIconCurrent = (props: any): React.ReactElement => (
        <TouchableHighlight onPress={toggleSecureEntryCurrent} underlayColor="white">
            <View><Icon {...props} name={secureTextEntryCurrent ? 'eye-off' : 'eye'} /></View>
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

    const renderCaption = (flag: number): React.ReactElement => {
        let message: string = ""
        if (flag === 0) {
            message = errorPasswordCurrent
        } else if (flag === 1) {
            message = errorPassword
        } else if (flag === 2) {
            message = errorPasswordConfirm
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
                    {message}
                </Text>
            </View>
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


    const handlePassword = (value: string) => {
        setPassword(value)
        if (!value) {
            setErrorPassword('This field is required.')
        } else {
            const result = validatePassword(value)
            setErrorPassword(result)
        }
    }

    const handlePasswordConfirm = (value: string) => {
        setPasswordConfirm(value)
        if (!value) {
            setErrorPasswordConfirm('This field is required.')
        }
    }

    const handlePasswordCurrent = (value: string) => {
        setCurrentPassword(value)
        if (!value) {
            setErrorPasswordCurrent('This field is required.')
        }
    }

    const handleSubmit = async () => {

        setErrorPasswordConfirm('')
        setErrorPassword('')
        setErrorPasswordCurrent('')

        if (!currentPassword) {
            setErrorPasswordCurrent('This field is required.')
        } else if (!password) {
            setErrorPassword('This field is required.')
        } else if (!passwordConfirm) {
            setErrorPasswordConfirm('This field is required.')
        } else if (passwordConfirm !== password) {
            setErrorPasswordConfirm('The password confirmation does not match.')
        } else {
            const form = {
                currentPassword: currentPassword,
                password: password,
                confirmPassword: passwordConfirm
            }
            setLoading(true)
            setSuccessResponse('')
            setErrorResponse('')
            setTimeout(async () => {
                await Service.profile.changePassword(form)
                    .then(async (response) => {
                        const messsage = response.data.message
                        setLoading(false)
                        setSuccessResponse(messsage)
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
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 100, paddingHorizontal: 15 }}>
                <Text style={{ margin: 2, alignContent: 'stretch', fontSize: 23 }}>
                    Change Current Password
                </Text>
                <Text style={{ marginTop: 12, alignContent: 'stretch', fontSize: 12 }}>
                    Enter a new password to reset the password on your account.
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
                    label='Current Password'
                    placeholder='Please Enter Your Current Password'
                    value={currentPassword}
                    accessoryRight={renderIconCurrent}
                    secureTextEntry={secureTextEntryCurrent}
                    caption={renderCaption(0)}
                    style={{ marginBottom: 10 }}
                    disabled={loading}
                    onChangeText={nextValue => handlePasswordCurrent(nextValue)}
                    status={errorPasswordCurrent ? 'danger' : 'basic'}
                />
                <Input
                    label='Password'
                    placeholder='Please Enter Your Password'
                    value={password}
                    accessoryRight={renderIcon}
                    secureTextEntry={secureTextEntry}
                    caption={renderCaption(1)}
                    style={{ marginBottom: 10 }}
                    disabled={loading}
                    onChangeText={nextValue => handlePassword(nextValue)}
                    status={errorPassword ? 'danger' : 'basic'}
                />
                <Input
                    label='Password Confirmation'
                    placeholder='Please Enter Your Password Confirmation'
                    value={passwordConfirm}
                    accessoryRight={renderIconConfirm}
                    secureTextEntry={secureTextEntryConfirm}
                    caption={renderCaption(2)}
                    style={{ marginBottom: 10 }}
                    disabled={loading}
                    onChangeText={nextValue => handlePasswordConfirm(nextValue)}
                    status={errorPasswordConfirm ? 'danger' : 'basic'}
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
                            Update Password Now.....
                        </Button>
                    </> : <>
                        <Button
                            status='primary'
                            style={{ marginBottom: 10 }}
                            onPress={handleSubmit}
                        >
                            Update Password
                        </Button>
                    </>
                }
                <Button
                    status='danger'
                    style={{ marginBottom: 10 }}
                    onPress={() => {
                        p.mainApp('Profile')
                    }}
                >
                    Back To Profile
                </Button>
            </View>
        </Layout>
    )
}


export default ChangePassword