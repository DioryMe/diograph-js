import { IDiograph, IDiographObject, IDiory } from './types'
import { v4 as uuid } from 'uuid'

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
        },
      }
      diograph = new Diograph(diographObject)
    })

    it('adds diory to diograph', () => {
      expect(diograph.diograph['some-id']).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
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
            'other-id': expect.objectContaining({ id: 'other-id' }),
          })
        })

        it('adds diory to diograph', () => {
          expect(diograph.diograph['other-id']).toStrictEqual(expect.objectContaining({ id: 'other-id' }))
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(diograph.toObject()).toStrictEqual({
              'other-id': expect.objectContaining({ id: 'other-id' }),
              'some-id': expect.objectContaining({ id: 'some-id' }),
            })
          })
        })

        describe('when createLink()', () => {
          let diory: IDiory
          beforeEach(() => {
            diory = diograph.createDioryLink({ id: 'some-id' }, { id: 'other-id' })
          })

          it('creates link between diories', () => {
            expect(diograph.diograph['some-id'].links).toStrictEqual([{ id: 'other-id' }])
          })

          describe('given diory does not exist', () => {
            it('throws error', () => {
              expect(() => {
                diory = diograph.createDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
              }).toThrow()
            })
          })

          describe('when deleteLink()', () => {
            beforeEach(() => {
              diory = diograph.deleteDioryLink({ id: 'some-id' }, { id: 'other-id' })
            })

            it('deletes link between diories', () => {
              expect(diograph.diograph['some-id'].links).toBe(undefined)
            })

            describe('given diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.deleteDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
                }).toThrow()
              })
            })

            describe('given linked diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.deleteDioryLink({ id: 'some-id' }, { id: 'not-existing-id' })
                }).toThrow()
              })
            })
          })
        })
      })

      describe('given existing diory in diograph object', () => {
        it('throws error', () => {
          diograph.addDiograph({
            'some-id': {
              id: 'some-id',
            },
          })

          expect(console.error).toHaveBeenCalled()
        })
      })

      describe('given diograph contains root', () => {
        beforeEach(() => {
          diograph.addDiograph({
            '/': { id: 'some-rootId' },
            'some-rootId': {
              id: 'some-rootId',
              text: 'root',
            },
          })
        })

        it('sets root', () => {
          expect(diograph.getRoot()).toStrictEqual(expect.objectContaining({
            id: 'some-rootId',
            text: 'root',
          }))
        })
      })
    })

    describe('when setRoot()', () => {
      describe('given diograph contains root', () => {
        beforeEach(() => {
          diograph.addDiograph({
            'some-rootId': {
              id: 'some-rootId',
              text: 'root',
            },
          })
        })

        it('sets root', () => {
          diograph.setRoot({ id: 'some-rootId' })

          expect(diograph.getRoot()).toStrictEqual(expect.objectContaining({
            id: 'some-rootId',
            text: 'root',
          }))
        })
      })

      describe('given diograph does not contain root', () => {
        beforeEach(() => {
          diograph.addDiograph({
            'some-id': {
              id: 'some-id',
              text: 'not-root',
            },
          })
        })

        it('throws error', () => {
          expect(() => {
            diograph.setRoot({ id: 'some-rootId' })
          }).toThrow()
        })
      })
    })

    describe('when createDiory() with text', () => {
      beforeEach(() => {
        // @ts-ignore
        uuid.mockReturnValue('some-uuid')
        diory = diograph.createDiory({ text: 'created-text' })
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
        expect(diograph.diograph['some-uuid']).toStrictEqual(expect.objectContaining({ id: 'some-uuid' }))
      })
    })

    describe('when resetDiograph()', () => {
      it('resets diograph to empty object', () => {
        diograph.resetDiograph()

        expect(diograph.diograph).toStrictEqual({})
      })
    })

    describe('when updateDiory() with text', () => {
      beforeEach(() => {
        diory = diograph.updateDiory({ id: 'some-id', text: 'updated-text' })
      })

      it('updates diory text', () => {
        expect(diograph.diograph['some-id'].text).toBe('updated-text')
      })

      it('returns updated diory', () => {
        expect(diory?.text).toBe('updated-text')
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when deleteDiory() with id', () => {
      let result: boolean | undefined

      beforeEach(() => {
        result = diograph.deleteDiory({ id: 'some-id' })
      })

      it('deletes diory', () => {
        expect(diograph.diograph['some-id']).toBe(undefined)
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
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
        let queryDiograph: IDiograph
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'query' })
        })

        it('returns diograph with query diory', () => {
          expect(queryDiograph.diograph['query-id']).toStrictEqual(expect.objectContaining({ id: 'query-id' }))
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(queryDiograph.toObject()).toStrictEqual({
              'query-id': expect.objectContaining({ id: 'query-id' }),
            })
          })
        })
      })

      describe('when queryDiograph() without matching text query', () => {
        let queryDiograph: IDiograph
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'other-query' })
        })

        it('returns empty diograph', () => {
          expect(queryDiograph.diograph).toStrictEqual({})
        })

        describe('when toObject()', () => {
          it('returns empty diograph object', () => {
            expect(queryDiograph.toObject()).toStrictEqual({})
          })
        })
      })
    })
  })
})
