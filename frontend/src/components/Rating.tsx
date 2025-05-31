import { Layout, Icon } from '@ui-kitten/components';
import { ViewStyle, Text, View } from 'react-native';

interface IRating {
    maxRating: number,
    rating: number
}

const Rating = (props: IRating) => {

    const maxStar = 10
    const maxRating = props.maxRating
    const rating = props.rating
    const current = (((rating / maxRating) * 100) / maxStar)
    const currentRound = Math.round(current)
    const less = maxStar - currentRound

    return (
        <View style={{ flexDirection: 'row' }}>
            {Array.from(Array(currentRound), (e, i) => {
                return (<Icon style={{ width: 10, flex: 1 }} key={i} name="star" fill='#ffc107' />)
            })}
            {Array.from(Array(less), (e, i) => {
                return (<Icon style={{ width: 10, flex: 1 }} key={i} name="star-outline" fill='#ffc107' />)
            })}
        </View>
    )
}


export default Rating