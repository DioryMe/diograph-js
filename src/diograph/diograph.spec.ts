import { v4 as uuid } from 'uuid'
import { IDiograph, IDiory, IDiographObject } from '../types'

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
      diograph = new Diograph(jest.fn()).addDiograph(diographObject)
    })

    it('adds diory to diograph', () => {
      expect(diograph.diograph['some-id']).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
    })

    it('does not save diograph', () => {
      expect(diograph.callback).not.toHaveBeenCalled()
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
          expect(diograph.callback).not.toHaveBeenCalled()
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
        expect(diograph.callback).toHaveBeenCalled()
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
        expect(diograph.callback).toHaveBeenCalled()
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
        expect(diograph.callback).toHaveBeenCalled()
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

    describe('when diory.update()', () => {
      beforeEach(() => {
        diory = diograph.getDiory({ id: 'some-id' }).update({ id: 'some-id', text: 'updated-text' })
      })

      it('updates diory', () => {
        expect(diograph.diograph['some-id'].text).toBe('updated-text')
      })

      it('returns updated diory', () => {
        expect(diory?.text).toBe('updated-text')
      })

      it('saves diograph', () => {
        expect(diograph.callback).toHaveBeenCalled()
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
        expect(diograph.callback).toHaveBeenCalled()
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when diory.addLink()', () => {
      let diory: IDiory
      beforeEach(() => {
        diograph.addDiograph({
          'other-id': { id: 'other-id' },
        })
        diory = diograph.getDiory({ id: 'some-id' }).addLink({ id: 'other-id' })
      })

      it('creates link between diograph', () => {
        expect(diograph.diograph['some-id'].links).toStrictEqual([{ id: 'other-id' }])
      })

      it('saves diograph', () => {
        expect(diograph.callback).toHaveBeenCalled()
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diory = diograph.getDiory({ id: 'not-existing-id' }).addLink({ id: 'other-id' })
          }).toThrow()
        })
      })

      describe('when diory.removeLink()', () => {
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'some-id' }).removeLink({ id: 'other-id' })
        })

        it('deletes link between diograph', () => {
          expect(diograph.diograph['some-id'].links).toBe(undefined)
        })

        it('saves diograph', () => {
          expect(diograph.callback).toHaveBeenCalled()
        })

        describe('given diory does not exist', () => {
          it('throws error', () => {
            expect(() => {
              diory = diograph.getDiory({ id: 'not-existing-id' }).removeLink({ id: 'other-id' })
            }).toThrow()
          })
        })

        describe('given linked diory does not exist', () => {
          it('throws error', () => {
            expect(() => {
              diory = diograph.getDiory({ id: 'some-id' }).removeLink({ id: 'not-existing-id' })
            }).toThrow()
          })
        })
      })
    })
  })
})
