import React from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Diograph } from './diograph-js'

import DioryStory from './components/DioryStory'

const diograph = new Diograph({
  rootId: 'welcome',
  welcome: {
    id: 'welcome',
    text: 'Welcome to Diory!'
  }
})

const useRoute = () => {
  const navigate = useNavigate()
  const { storyId } = useParams()

  return {
    storyId,
    setStoryId: (id) => navigate(`/story/${id}`)
  }
}

const DioryStoryRoute = () => {
  const { storyId, setStoryId } = useRoute()
  const { story, memories } = diograph.getDioryStory(storyId)

  return (
    <DioryStory story={story} memories={memories} onMemoryClick={setStoryId} />
  )
}

export default DioryStoryRoute
