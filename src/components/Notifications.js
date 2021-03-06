import React, {Component} from 'react'
import { View, Text, StyleSheet, StatusBar} from 'react-native'
import { connect } from 'react-redux'
import * as appActions from '../actions/app'
import colors from '../utils/colors.json'
import * as Animatable from 'react-native-animatable';

const DISPLAY_TIME = 5000

class Notifications extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activeNotification: null,
	  	isStatusbarHidden: true,
	  };
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.notifications.length < nextProps.notifications.length) {
			this.showNotification(nextProps.notifications[0])
		}
	}


	render() {

		const notification = this.state.activeNotification
		if (notification === null) return null

		const title = notification.title
		const body = notification.body

		return (
			<Animatable.View ref='view' animation="slideInDown" duration={700} easing='ease-out-quint' style={styles.container}>
				<StatusBar hidden={this.state.isStatusbarHidden} animated />
				<View style={styles.textContainer}>
					<Text numberOfLines={1} style={styles.title}>{title}</Text>
					<Text numberOfLines={2} style={styles.body}>{body}</Text>
				</View>
			</Animatable.View>
		)
	}

	showNotification(notification) {

		if (this.state.activeNotification === null) this.startCountdown()

		this.setState({
			activeNotification: notification,
			isStatusbarHidden: true,
		})
	}

	startCountdown() {
		setTimeout(() => {
			this.setState({isStatusbarHidden: false})
			this.refs.view.slideOutUp(700)
			.then(() => {
				this.props.dispatch(appActions.removeNotification())
				this.setState({activeNotification: null}, () => {
					if (this.props.notifications.length > 0)
						this.showNotification(this.props.notifications[0])
				})
			})
		}, DISPLAY_TIME)
	}
}


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0, right: 0,
		backgroundColor: colors.primary,
	},
	textContainer: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	title: {
		color: 'rgba(255,255,255,0.9)',
		fontSize: 16,
		fontWeight: '500',
	},
	body: {
		color: 'rgba(255,255,255, 0.8)',
		fontSize: 14,
	},
})



export default connect((store) => {
  return {
    notifications: store.app.notifications,
  }
}, null)(Notifications)