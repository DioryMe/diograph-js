import React from 'react'
import PropTypes from 'prop-types'

function getStyle(imageUrl, imageStyles) {
  return {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("${imageUrl}")`,
    ...imageStyles,
  }
}

const DioryImage = ({ image, style, children, ...props }) => {
  return (
    <div style={getStyle(image, style)} {...props}>
      {children}
    </div>
  )
}

DioryImage.propTypes = {
  image: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export default DioryImage
