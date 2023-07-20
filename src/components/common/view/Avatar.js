// @flow
import React, { useMemo } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-paper'

import useOnPress from '../../../lib/hooks/useOnPress'
import useAvatar from '../../../lib/hooks/useAvatar'

import { getBase64Source, isGoodDollarImage } from '../../../lib/utils/image'
import { withStyles } from '../../../lib/styles'

import UnknownProfileSVG from '../../../assets/unknownProfile.svg'
import GoodDollarLogo from '../../../assets/Feed/favicon-96x96.svg'
import EthereumLogo from '../../../assets/Feed/ethereum-eth-logo.svg'
import GoerliLogo from '../../../assets/Feed/goerli.svg'
import FuseLogo from '../../../assets/Feed/fuse-logo.svg'
import CeloLogo from '../../../assets/Feed/celo-logo.svg'
import { isNativeToken } from '../../../lib/wallet/utils'

const TokenLogo = {
  ETH: EthereumLogo,
  GETH: GoerliLogo,
  FUSE: FuseLogo,
  CELO: CeloLogo,
}

/**
 * Touchable Avatar
 * @param {Props} props
 * @param {Function} [props.onPress]
 * @param {String} [props.source]
 * @param {Object} [props.style]
 * @param {Number} [props.size=34]
 * @returns {React.Node}
 */
const CustomAvatar = ({
  styles,
  style,
  imageStyle,
  unknownStyle,
  size,
  imageSize,
  plain,
  source,
  onPress,
  children,
  ...avatarProps
}) => {
  const _onPress = useOnPress(onPress)
  const isGDLogo = isGoodDollarImage(source)
  const isSvgLogo = isGDLogo || (isNativeToken(source) && source in TokenLogo)
  const ImageComponent = plain ? Image : Avatar.Image
  const dataUrl = useAvatar(isSvgLogo || !source ? null : source)
  const SvgLogo = TokenLogo[source]

  const calculatedStyles = useMemo(() => {
    const container = { width: size, height: size, borderRadius: size / 2 }
    const background = { backgroundColor: 'rgba(0, 0, 0, 0)' }
    const wrapper = { ...background, width: size, height: size }

    return { container, wrapper, background }
  }, [size])

  const imgSource = useMemo(() => (dataUrl ? getBase64Source(dataUrl) : null), [dataUrl])

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={!onPress}
      onPress={_onPress}
      style={[styles.avatarContainer, calculatedStyles.container, style]}
      underlayColor="#fff"
    >
      {isSvgLogo ? (
        <View style={calculatedStyles.wrapper} {...avatarProps}>
          {isGDLogo ? <GoodDollarLogo /> : <SvgLogo />}
        </View>
      ) : imgSource ? (
        <ImageComponent
          size={imageSize || size - 2}
          source={imgSource}
          style={[calculatedStyles.background, imageStyle]}
          {...avatarProps}
        />
      ) : (
        <View style={[calculatedStyles.wrapper, unknownStyle]} {...avatarProps}>
          <UnknownProfileSVG />
        </View>
      )}
      {children}
    </TouchableOpacity>
  )
}

CustomAvatar.defaultProps = {
  size: 42,
  plain: false,
}

const getStylesFromProps = ({ theme }) => ({
  avatarContainer: {
    backgroundColor: theme.colors.gray50Percent,
    borderWidth: 1,
    borderColor: theme.colors.gray80Percent,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withStyles(getStylesFromProps)(CustomAvatar)
