import { Diograph } from '../diograph'
import { Diory } from '../diory'

function search(this: Diograph, query: string, field: 'text' | 'data'): Diory[] {
  return this.diories.filter((diory: Diory) => {
    if (field === 'text') {
      return diory.text && diory.text.toLowerCase().includes(query.toLowerCase())
    } else if (field === 'data') {
      // Convert diory.data array of objects to object value strings
      // e.g. [{"url": "https://diory.me", "type": "website"}] => "https://diory.me website"
      const dataFieldValues = diory.data
        ?.map((dataArrayCell) => Object.values(dataArrayCell).join(' '))
        .join(' ')
      return dataFieldValues && dataFieldValues.toLowerCase().includes(query.toLowerCase())
    }
  })
}

export { search }
