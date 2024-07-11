import { v4 as uuid } from 'uuid'
import { LocalClient } from '@diograph/local-client'
import { ConnectionClient } from '@diory/connection-client-js'
import { IDiograph, IDiographObject, IDiory, IDataClient, IConnectionClient } from '@diory/types'

import { Diograph } from './diograph'

// Mocks
jest.mock('uuid')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('diograph', () => {
  let diograph: IDiograph
  let diory: IDiory

  describe('when new Diograph() with some diory in diograph object', () => {
    let diographObject: IDiographObject

    beforeEach(() => {
      diographObject = {
        'some-id': {
          id: 'some-id',
          text: 'some-text',
        },
      }
      diograph = new Diograph().addDiograph(diographObject)
      diograph.saveDiograph = jest.fn()
    })

    it('adds diory to diograph', () => {
      expect(diograph.diograph['some-id']).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
    })

    it('does not save diograph', () => {
      expect(diograph.saveDiograph).not.toHaveBeenCalled()
    })

    describe('when toObject()', () => {
      it('returns diograph object', () => {
        expect(diograph.toObject()).toStrictEqual({
          'some-id': expect.objectContaining({ id: 'some-id' }),
        })
      })
    })

    describe('when addDiograph()', () => {
      describe('given new diory in added diograph object', () => {
        beforeEach(() => {
          diograph.addDiograph({
            'other-id': { id: 'other-id' },
          })
        })

        it('adds diory to diograph', () => {
          expect(diograph.diograph['other-id']).toStrictEqual(
            expect.objectContaining({ id: 'other-id' }),
          )
        })

        it('does not save diograph', () => {
          expect(diograph.saveDiograph).not.toHaveBeenCalled()
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(diograph.toObject()).toStrictEqual({
              'other-id': expect.objectContaining({ id: 'other-id' }),
              'some-id': expect.objectContaining({ id: 'some-id' }),
            })
          })
        })
      })
    })

    describe('when initialise()', () => {
      let connectionClient: IConnectionClient
      beforeEach(() => {
        const dataClient: IDataClient = new LocalClient()
        connectionClient = new ConnectionClient([dataClient])
        diograph.connect(connectionClient)
      })

      it('adds connection client', () => {
        expect(diograph.connectionClient).toStrictEqual(connectionClient)
      })

      it('does not save diograph', () => {
        expect(diograph.saveDiograph).not.toHaveBeenCalled()
      })
    })

    describe('when addDiory()', () => {
      beforeEach(() => {
        // @ts-ignore
        uuid.mockReturnValue('some-uuid')
        diory = diograph.addDiory({ text: 'created-text' })
      })

      it('creates id to diory', () => {
        expect(uuid).toHaveBeenCalled()
      })

      it('adds id diory', () => {
        expect(diory.id).toBe('some-uuid')
      })

      it('adds text to diory', () => {
        expect(diory.text).toBe('created-text')
      })

      it('adds diory to diograph', () => {
        expect(diograph.diograph['some-uuid']).toStrictEqual(
          expect.objectContaining({ id: 'some-uuid' }),
        )
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })
    })

    describe('when addDiory() with new key', () => {
      beforeEach(() => {
        diory = diograph.addDiory({ id: 'some-id' }, 'some-key')
      })

      it('adds id', () => {
        expect(diory.id).toBe('some-id')
      })

      it('adds diory alias to diograph', () => {
        expect(diograph.diograph['some-key']).toStrictEqual(
          expect.objectContaining({ id: 'some-id' }),
        )
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })

      describe('when getDiory() with alias key', () => {
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'some-key' })
        })

        it('returns diory', () => {
          expect(diory).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
        })
      })
    })

    describe('when addDiory() with existing key', () => {
      beforeEach(() => {
        diograph.addDiory({ id: 'some-id' }, 'existing-key')
        diory = diograph.addDiory({ id: 'new-id' }, 'existing-key')
      })

      it('return new diory', () => {
        expect(diory).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
      })

      it('adds new diory alias to diograph', () => {
        expect(diograph.diograph['existing-key']).toStrictEqual(
          expect.objectContaining({ id: 'new-id' }),
        )
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })

      describe('when getDiory() with alias key', () => {
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'existing-key' })
        })

        it('returns new diory', () => {
          expect(diory).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
        })
      })
    })

    describe('when updateDiory()', () => {
      beforeEach(() => {
        diory = diograph.updateDiory({ id: 'some-id', text: 'updated-text' })
      })

      it('updates diory', () => {
        expect(diograph.diograph['some-id'].text).toBe('updated-text')
      })

      it('returns updated diory', () => {
        expect(diory?.text).toBe('updated-text')
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when removeDiory()', () => {
      beforeEach(() => {
        diograph.removeDiory({ id: 'some-id' })
      })

      it('removes diory', () => {
        expect(diograph.diograph['some-id']).toBe(undefined)
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when addLink()', () => {
      let diory: IDiory
      beforeEach(() => {
        diograph.addDiograph({
          'other-id': { id: 'other-id' },
        })
        diory = diograph.addDioryLink({ id: 'some-id' }, { id: 'other-id' })
      })

      it('creates link between diograph', () => {
        expect(diograph.diograph['some-id'].links).toStrictEqual([{ id: 'other-id' }])
      })

      it('saves diograph', () => {
        expect(diograph.saveDiograph).toHaveBeenCalled()
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diory = diograph.addDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
          }).toThrow()
        })
      })

      describe('when removeLink()', () => {
        beforeEach(() => {
          diory = diograph.removeDioryLink({ id: 'some-id' }, { id: 'other-id' })
        })

        it('deletes link between diograph', () => {
          expect(diograph.diograph['some-id'].links).toBe(undefined)
        })

        it('saves diograph', () => {
          expect(diograph.saveDiograph).toHaveBeenCalled()
        })

        describe('given diory does not exist', () => {
          it('throws error', () => {
            expect(() => {
              diory = diograph.removeDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
            }).toThrow()
          })
        })

        describe('given linked diory does not exist', () => {
          it('throws error', () => {
            expect(() => {
              diory = diograph.removeDioryLink({ id: 'some-id' }, { id: 'not-existing-id' })
            }).toThrow()
          })
        })
      })
    })

    describe('given diograph with query text diory', () => {
      beforeEach(() => {
        diograph.addDiograph({
          'query-id': {
            id: 'query-id',
            text: 'query-text',
          },
        })
      })

      describe('when queryDiograph() with matching text query', () => {
        let queryDiograph: IDiographObject
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'query' })
        })

        it('returns diograph with query diory', () => {
          expect(queryDiograph['query-id']).toStrictEqual(
            expect.objectContaining({ id: 'query-id' }),
          )
        })

        it('does not save diograph', () => {
          expect(diograph.saveDiograph).not.toHaveBeenCalled()
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(queryDiograph).toStrictEqual({
              'query-id': expect.objectContaining({ id: 'query-id' }),
            })
          })
        })
      })

      describe('when queryDiograph() without matching text query', () => {
        let queryDiograph: IDiographObject
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'other-query' })
        })

        it('returns empty diograph', () => {
          expect(queryDiograph).toStrictEqual({})
        })

        it('does not save diograph', () => {
          expect(diograph.saveDiograph).not.toHaveBeenCalled()
        })
      })
    })
  })
})
