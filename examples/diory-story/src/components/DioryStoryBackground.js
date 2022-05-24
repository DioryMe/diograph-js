import React from 'react'
import PropTypes from 'prop-types'

import Diory from './Diory'

function getStyles(dioryStyles) {
  return {
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    diory: {
      ...dioryStyles,
      zIndex: -1000,
      image: {
        ...blurStyle,
        ...(dioryStyles && dioryStyles.image),
      },
    }
  }
}

const blurStyle = {
  filter: 'blur(20px)',
  inset: '-40px',
  backgroundColor: '#9bc53d',
}

const DioryStoryBackground = ({ story, onClick, children }) => {
  const styles = getStyles(story.style)

  return (
    <div style={styles.container}>
      <Diory diory={{ ...story, style: styles.diory, onClick }}/>
      {children}
    </div>
  )
}

DioryStoryBackground.propTypes = {
  story: PropTypes.shape({
    style: PropTypes.object,
  }),
  onClick: PropTypes.func,
  children: PropTypes.node,
}

export default DioryStoryBackground
