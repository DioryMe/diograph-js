import { IDioryObject, IDiory, IDioryProps } from './types'
import { Diory } from './diory'

describe('diory', () => {
  let diory: IDiory

  // Mock new Date()
  const someNewDate = '2022-01-01T00:00:00.000Z'
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(someNewDate))
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when new Diory(dioryObject)', () => {
    let dioryObject: IDioryObject

    describe('given diory object with id', () => {
      beforeEach(() => {
        dioryObject = {
          id: 'some-id',
        }
        diory = new Diory(dioryObject)
      })

      it('adds id to diory', () => {
        expect(diory.id).toBe('some-id')
      })

      it('adds created ISO date to diory', () => {
        expect(diory.created).toBe(someNewDate)
      })

      it('adds modified ISO date to diory', () => {
        expect(diory.modified).toBe(someNewDate)
      })

      describe('when toObject()', () => {
        let dioryObject: IDioryObject

        it('returns diory object with id', () => {
          dioryObject = diory.toObject()

          expect(dioryObject.id).toBe('some-id')
        })

        it('returns diory object with created', () => {
          dioryObject = diory.toObject()

          expect(dioryObject.created).toBe(someNewDate)
        })

        it('returns diory object with modified', () => {
          dioryObject = diory.toObject()

          expect(dioryObject.modified).toBe(someNewDate)
        })
      })

      describe('given text', () => {
        beforeEach(() => {
          dioryObject.text = 'some-text'

          diory = new Diory(dioryObject)
        })

        it('adds text to diory', () => {
          expect(diory.text).toBe('some-text')
        })

        describe('when toObject()', () => {
          it('returns diory object with text', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.text).toBe('some-text')
          })
        })
      })

      describe('given image', () => {
        beforeEach(() => {
          dioryObject.image = 'some-image'

          diory = new Diory(dioryObject)
        })

        it('adds image to diory', () => {
          expect(diory.image).toBe('some-image')
        })

        describe('when toObject()', () => {
          it('returns diory object with image', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.image).toBe('some-image')
          })
        })
      })

      describe('given latlng', () => {
        beforeEach(() => {
          dioryObject.latlng = 'some-latlng'

          diory = new Diory(dioryObject)
        })

        it('adds latlng to diory', () => {
          expect(diory.latlng).toBe('some-latlng')
        })

        describe('when toObject()', () => {
          it('returns diory object with latlng', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.latlng).toBe('some-latlng')
          })
        })
      })

      describe('given date', () => {
        beforeEach(() => {
          dioryObject.date = 'some-date'

          diory = new Diory(dioryObject)
        })

        it('adds date to diory', () => {
          expect(diory.date).toBe('some-date')
        })

        describe('when toObject()', () => {
          it('returns diory object with date', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.date).toBe('some-date')
          })
        })
      })

      describe('given data', () => {
        beforeEach(() => {
          dioryObject.data = ['some-data']

          diory = new Diory(dioryObject)
        })

        it('adds data to diory', () => {
          expect(diory.data).toStrictEqual(['some-data'])
        })

        describe('when toObject()', () => {
          it('returns diory object with data', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.data).toStrictEqual(['some-data'])
          })
        })
      })

      describe('given links', () => {
        beforeEach(() => {
          dioryObject.links = { some: 'link' }

          diory = new Diory(dioryObject)
        })

        it('adds links to diory', () => {
          expect(diory.links).toStrictEqual({ some: 'link' })
        })

        describe('when toObject()', () => {
          it('returns diory object with links', () => {
            const dioryObject = diory.toObject()

            expect(dioryObject.links).toStrictEqual({ some: 'link' })
          })
        })
      })

      describe('given any other prop', () => {
        it('does not add other prop to diory', () => {
          jest.spyOn(console, 'error').mockImplementation(() => {})
          // @ts-ignore
          dioryObject.other = 'prop'

          diory = new Diory(dioryObject)

          expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
          // @ts-ignore
          expect(diory.other).toBe(undefined)
        })
      })

      describe('when update(dioryProps)', () => {
        let dioryProps: IDioryProps

        beforeEach(() => {
          dioryProps = {}
        })

        it('does not update created ISO date to diory', () => {
          diory.update({})

          expect(diory.created).toBe(someNewDate)
        })

        it('updates modified ISO date to diory', () => {
          jest.setSystemTime(new Date('2022-01-02T00:00:00.000Z'))

          diory.update({})

          expect(diory.modified).toBe('2022-01-02T00:00:00.000Z')
        })

        describe('given text', () => {
          it('adds text to diory', () => {
            dioryProps.text = 'some-text'

            diory.update(dioryProps)

            expect(diory.text).toBe('some-text')
          })
        })

        describe('given image', () => {
          it('adds image to diory', () => {
            dioryProps.image = 'some-image'

            diory.update(dioryProps)

            expect(diory.image).toBe('some-image')
          })
        })

        describe('given latlng', () => {
          it('adds latlng to diory', () => {
            dioryProps.latlng = 'some-latlng'

            diory.update(dioryProps)

            expect(diory.latlng).toBe('some-latlng')
          })
        })

        describe('given date', () => {
          it('adds date to diory', () => {
            dioryProps.date = 'some-date'

            diory.update(dioryProps)

            expect(diory.date).toBe('some-date')
          })
        })

        describe('given data', () => {
          it('adds data to diory', () => {
            dioryProps.data = ['some-data']

            diory.update(dioryProps)

            expect(diory.data).toStrictEqual(['some-data'])
          })
        })

        describe('given one link', () => {
          beforeEach(() => {
            dioryProps.links = {
              some: {
                id: 'link-id',
              },
            }

            diory.update(dioryProps)
          })

          it('adds links to diory', () => {
            expect(diory.links).toStrictEqual({
              some: {
                id: 'link-id',
              },
            })
          })

          describe('when deleteLink(linkedDiory)', () => {
            it('deletes link from diory', () => {
              diory.deleteLink({ id: 'link-id' })

              expect(diory.links).toBe(undefined)
            })
          })
        })

        describe('given two links', () => {
          beforeEach(() => {
            dioryProps.links = {
              some: {
                id: 'some-link-id',
              },
              other: {
                id: 'other-link-id',
              },
            }

            diory.update(dioryProps)
          })

          it('adds links to diory', () => {
            expect(diory.links).toStrictEqual({
              some: {
                id: 'some-link-id',
              },
              other: {
                id: 'other-link-id',
              },
            })
          })

          describe('when deleteLink(otherLinkedDiory)', () => {
            it('deletes link from diory', () => {
              diory.deleteLink({ id: 'other-link-id' })

              expect(diory.links).toStrictEqual({
                some: {
                  id: 'some-link-id',
                },
              })
            })
          })
        })

        describe('given id', () => {
          it('does not add id to diory', () => {
            // @ts-ignore
            dioryProps.id = 'other-id'

            diory.update(dioryProps)

            expect(diory.id).not.toBe('other-id')
          })
        })

        describe('given other prop', () => {
          it('does not add other prop to diory', () => {
            jest.spyOn(console, 'error').mockImplementation(() => {})
            // @ts-ignore
            dioryProps.other = 'prop'

            diory.update(dioryProps)

            expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
            // @ts-ignore
            expect(diory.other).not.toBe('prop')
          })
        })
      })

      describe('when createLink() with existing linked diory', () => {
        beforeEach(() => {
          diory.createLink({ id: 'linked-id' })
        })

        it('creates link to diory', () => {
          expect(diory.links).toStrictEqual({ 'linked-id': { id: 'linked-id' } })
        })

        describe('when deleteLink() with existing linked diory', () => {
          it('deletes link from diory', () => {
            diory.deleteLink({ id: 'linked-id' })

            expect(diory.links).toBe(undefined)
          })
        })

        describe('when deleteLink() without existing linked diory', () => {
          it('throws error', () => {
            expect(() => {
              diory.deleteLink({ id: 'not-existing-id' })
            }).toThrow()
          })
        })
      })
    })
  })
})
