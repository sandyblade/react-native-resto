import { Layout } from '@ui-kitten/components';
import { Player } from '@lottiefiles/react-lottie-player';
import AnimationSplash from '../json/Animation.json'
import { ViewStyle, Text } from 'react-native';

const SplashScreen = () => {

    const AppName: string = `${process.env.APP_TITLE}`
    const styles: ViewStyle = {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0d6efd'
    }

    return (
        <Layout style={styles}>
            <Player src={AnimationSplash} className="player" loop autoplay />
            <Text
                style={{ textAlign: 'center', marginVertical: 5, fontSize: 25, color: '#fff' }}
            >{AppName}
            </Text>
            <Text
                style={{ textAlign: 'center', fontSize: 13.5, color: '#fff' }}
            >Version 1.0
            </Text>
        </Layout>
    )
}


export default SplashScreen