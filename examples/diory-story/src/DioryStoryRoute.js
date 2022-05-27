import React from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Diograph } from './diograph-js'

import DioryStory from './components/DioryStory'

import diographJson from './diograph.json'
const diograph = new Diograph(diographJson)

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
  const [story, ...memories] = diograph.getDiories(storyId)

  return (
    <DioryStory story={story} memories={memories} onMemoryClick={setStoryId} />
  )
}

export default DioryStoryRoute
