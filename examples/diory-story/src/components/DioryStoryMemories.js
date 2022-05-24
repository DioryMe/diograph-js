import React from 'react'
import PropTypes from 'prop-types'

import Diory from './Diory'

function getStyles({ memory, ...styles } = {}) {
  return {
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      flexWrap: 'wrap',
      padding: '24px',
      alignContent: 'flex-start',
      ...styles,
    },
    memory: {
      flex: '1 0 360px',
      height: '240px',
      padding: '24px',
      alignSelf: 'center',
      ...memory,
    }
  }
}

const DioryStoryMemories = ({ memories, style, onClick, ...props }) => {
  const styles = getStyles(style)

  return (
    <div style={styles.container} {...props}>
      {memories.map((memoryDiory) => (
        <div key={memoryDiory.id} style={styles.memory}>
          <Diory diory={memoryDiory} onClick={onClick}/>
        </div>
      ))}
    </div>
  )
}

DioryStoryMemories.propTypes = {
  memories: PropTypes.array.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func,
}

export default DioryStoryMemories
