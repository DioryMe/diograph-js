function getStory(diograph = {}, dioryId) {
  return diograph[dioryId]
}

function getDiorys(diograph = {}, dioryIds = {}) {
  return Object.entries(dioryIds)
    .map(([key, { id }]) => ({ key, ...diograph[id] }))
    .filter(({ id }) => id)
}

function getMemories(diograph = {}, dioryId) {
  const { links } = diograph[dioryId] || {}
  return getDiorys(diograph, links)
}

export function getDioryStory(diograph, dioryId) {
  return {
    story: getStory(diograph, dioryId),
    memories: getMemories(diograph, dioryId),
  }
}