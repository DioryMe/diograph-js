function getDiory(diograph = {}, dioryId) {
  return diograph[dioryId]
}

function getLinkedDiories(diograph = {}, dioryId) {
  const { links } = diograph[dioryId] || {}
  return Object.entries(links)
    .map(([key, { id }]) => ({ key, ...diograph[id] }))
    .filter(({ id }) => id)
}

export function getDiories(diograph, dioryId) {
  return [
    getDiory(diograph, dioryId),
    ...getLinkedDiories(diograph, dioryId),
  ]
}