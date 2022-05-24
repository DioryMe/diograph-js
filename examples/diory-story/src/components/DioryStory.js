import React from 'react'
import PropTypes from 'prop-types'

import DioryStoryBackground from './DioryStoryBackground'
import DioryStoryMemories from './DioryStoryMemories'

const DioryStory = ({ story, memories, onStoryClick, onMemoryClick }) => {
  return (
    <DioryStoryBackground story={story} onClick={onStoryClick}>
      <DioryStoryMemories memories={memories} onClick={onMemoryClick} />
    </DioryStoryBackground>
  )
}

DioryStory.propTypes = {
  story: PropTypes.object.isRequired,
  memories: PropTypes.array.isRequired,
  onStoryClick: PropTypes.func,
  onMemoryClick: PropTypes.func,
}

export default DioryStory
