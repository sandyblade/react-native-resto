import { Layout } from '@ui-kitten/components';
import { ViewStyle, Text } from 'react-native';

const MainLayout = () => {

    const styles: ViewStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

    return (
        <Layout style={styles}>
            <Text
                style={{ textAlign: 'center', fontSize: 13.5, color: '#fff' }}
            >MainLayout
            </Text>
        </Layout>
    )
}


export default MainLayout