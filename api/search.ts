import DiographJson from '../diograph'
import { Diory } from '../types'

function search(this: DiographJson, query: string): Diory[] {
  const diories: Diory[] = Object.values(this.diograph)
  return diories.filter((diory: Diory) => {
    return diory.text && diory.text.toLowerCase().includes(query.toLowerCase())
  })
}

export { search }
