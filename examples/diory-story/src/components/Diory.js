import React from 'react'
import PropTypes from 'prop-types'

import DioryImage from './DioryImage'

function getStyles({ image, text, background, width,...style } = {}) {
  return {
    diory: {
      height: '100%',
      flexBasis: width,
      ...style,
    },
    container: {
      position: 'relative',
      height: '100%',
      cursor: 'pointer',
      overflow: 'hidden',
      background: background || '#fa7921',
    },
    text: {
      position: 'relative',
      padding: '16px',
      color: 'white',
      fontWeight: 'bold',
      ...text,
    },
    image: {
      ...image,
    }
  }
}

const Diory = ({ diory, onClick, children, ...props }) => {
  const styles = getStyles(diory.style)
  return (
    <div
      id={diory.id}
      style={styles.diory}
      onClick={(event) => onClick && onClick({ diory, event })}
      {...props}
    >
      <div style={styles.container}>
        {diory.image && (
          <DioryImage style={styles.image} image={diory.image}/>
        )}
        {diory.text && (
          <div style={styles.text}>{diory.text}</div>
        )}
      </div>
      {children}
    </div>
  )
}

Diory.propTypes = {
  diory: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    image: PropTypes.string,
    style: PropTypes.object,
  }),
  onClick: PropTypes.func,
  children: PropTypes.node,
}

export default Diory
