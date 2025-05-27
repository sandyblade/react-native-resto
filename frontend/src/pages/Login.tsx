import { Layout } from '@ui-kitten/components';
import { Text, View, Image } from 'react-native';


const Login = () => {

    return (
        <Layout style={{ flex: 1, alignItems: 'center', padding: 22 }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
                <Text style={{ margin: 2, alignContent: 'stretch', fontSize: 23 }}>
                    Login to your account
                </Text>
                <Text style={{ marginTop: 12, alignContent: 'stretch', fontSize: 12 }}>
                    Please sign in with your e-mail address and correct password.
                </Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={{
                        uri: 'https://5an9y4lf0n50.github.io/demo-images/demo-resto/burger.png',
                    }}
                />
            </View>
        </Layout>
    )
}


export default Login