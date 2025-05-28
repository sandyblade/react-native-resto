import { Layout } from '@ui-kitten/components';
import { Player } from '@lottiefiles/react-lottie-player';
import DisconnectSplash from '../json/Disconnect.json'
import { ViewStyle, Text } from 'react-native';

const DisconnectScreen = () => {

    const styles: ViewStyle = {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0d6efd',
        paddingTop: 150
    }

    return (
        <Layout style={styles}>
            <Player src={DisconnectSplash} className="player" loop autoplay />
            <Text
                style={{ textAlign: 'center', marginVertical: 5, fontSize: 11, padding: 10, color: '#fff' }}
            >Sorry, An Http error has occurred. Please close the client and try again.
            </Text>
        </Layout>
    )
}


export default DisconnectScreen