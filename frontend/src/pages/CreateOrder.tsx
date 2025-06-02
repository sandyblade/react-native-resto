import { Layout, Button } from '@ui-kitten/components';
import { ViewStyle, Text } from 'react-native';

interface IProps {
    mainApp: any
}

const CreateOrder = (p: IProps) => {

    const styles: ViewStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

    return (
        <Layout style={styles}>
            <Text
                style={{ textAlign: 'center', fontSize: 13.5, color: '#000' }}
            >CREATE ORDER
            </Text>
        </Layout>
    )
}


export default CreateOrder