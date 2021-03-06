import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Animated,
  ScrollView
} from 'react-native'
import { Transition } from 'react-navigation-fluid-transitions'
import { SCREEN_HEIGHT, DEFAULT_WINDOW_MULTIPLIER } from './constants'
import styles from './styles'

const ScrollViewPropTypes = ScrollView.propTypes

export default class ParallaxScrollView extends Component {
  constructor () {
    super()

    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  scrollTo (where) {
    if (!this._scrollView) return
    this._scrollView.scrollTo(where)
  }

  renderBackground () {
    var { noTransition, imageUrl, windowHeight, backgroundSource, onBackgroundLoadEnd, onBackgroundLoadError } = this.props
    var { scrollY } = this.state
    if (!windowHeight || !backgroundSource) {
      return null
    }
    const transform = [
      {
        translateY: scrollY.interpolate({
          inputRange: [-windowHeight, 0, windowHeight],
          outputRange: [windowHeight / 2, 0, -windowHeight / 3]
        })
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-windowHeight, 0, windowHeight],
          outputRange: [2, 1, 1]
        })
      }
    ]
    let RenderComponent = null
    if (noTransition) {
      RenderComponent = (
        <Animated.Image
          style={[
            styles.background,
            {
              height: windowHeight,
              transform
            }
          ]}
          source={backgroundSource}
          onLoadEnd={onBackgroundLoadEnd}
          onError={onBackgroundLoadError}
        >
        </Animated.Image>
      )
    } else {
      RenderComponent = (
        <Transition shared={imageUrl}>
          <Animated.Image
            style={[
              styles.background,
              {
                height: windowHeight,
                transform
              }
            ]}
            source={backgroundSource}
            onLoadEnd={onBackgroundLoadEnd}
            onError={onBackgroundLoadError}
          >
          </Animated.Image>
        </Transition>
      )
    }

    return RenderComponent
  }

  renderHeaderView () {
    const { windowHeight, backgroundSource, navBarHeight } = this.props
    const { scrollY } = this.state
    if (!windowHeight || !backgroundSource) {
      return null
    }

    const newNavBarHeight = navBarHeight || 60
    const newWindowHeight = windowHeight - newNavBarHeight

    return (
      <View style={{ height: newWindowHeight, justifyContent: 'center', alignItems: 'center' }}>
        {this.props.headerView && this.props.headerView(scrollY)}
      </View>
    )
  }

  render () {
    const { style, ...props } = this.props

    return (
      <View style={[styles.container, style]}>
        {this.renderBackground()}
        <ScrollView
          ref={component => {
            this._scrollView = component
          }}
          {...props}
          style={styles.scrollView}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
          scrollEventThrottle={16}
        >
          {this.renderHeaderView()}
          <View style={[styles.content, props.scrollableViewStyle]}>
            {this.props.children}
          </View>
        </ScrollView>
      </View>
    )
  }
}

ParallaxScrollView.defaultProps = {
  backgroundSource: { uri: 'http://i.imgur.com/6Iej2c3.png' },
  windowHeight: SCREEN_HEIGHT * DEFAULT_WINDOW_MULTIPLIER,
  leftIconOnPress: () => console.log('Left icon pressed'),
  rightIconOnPress: () => console.log('Right icon pressed')
}

ParallaxScrollView.propTypes = {
  ...ScrollViewPropTypes,
  backgroundSource: PropTypes.object,
  windowHeight: PropTypes.number,
  navBarTitle: PropTypes.string,
  navBarTitleColor: PropTypes.string,
  navBarTitleComponent: PropTypes.node,
  navBarColor: PropTypes.string,
  userImage: PropTypes.string,
  userName: PropTypes.string,
  userTitle: PropTypes.string,
  headerView: PropTypes.func,
  leftIcon: PropTypes.object,
  rightIcon: PropTypes.object
}
