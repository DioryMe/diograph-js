import { IDiograph, IDiographObject, IDiory, IDioryObject } from './types'
import { v4 as uuid } from 'uuid'

import { Diograph } from './diograph'

// Mocks
jest.mock('uuid')

describe('diograph', () => {
  let diograph: IDiograph

  describe('constructor(diographObject)', () => {
    let diographObject: IDiographObject

    describe('given diograph with some diory', () => {
      beforeEach(() => {
        diographObject = {
          'some-id': {
            id: 'some-id'
          }
        }
        diograph = new Diograph(diographObject)
      })

      it('adds diory to diograph', () => {
        expect(diograph.diograph['some-id'].id).toBe('some-id')
      })

      describe('when toObject()', () => {
        it('returns diograph object', () => {
          expect(diograph.toObject()).toStrictEqual({
            'some-id': expect.anything(),
          })
        })
      })

      describe('when addDiograph()', () => {
        describe('given diograph with other diory', () => {
          beforeEach(() => {
            diograph.addDiograph({
              'other-id': {
                id: 'other-id',
              }
            })
          })

          it('adds diory to diograph', () => {
            expect(diograph.diograph['other-id'].id).toBe('other-id')
          })

          describe('when toObject()', () => {
            it('returns diograph object', () => {
              expect(diograph.toObject()).toStrictEqual({
                'other-id': expect.anything(),
                'some-id': expect.anything(),
              })
            })
          })

          describe('when createLink()', () => {
            let diory: IDiory
            beforeEach(() => {
              diory = diograph.createLink({ id: 'some-id' }, { id: 'other-id' })
            })

            it('creates link between diories', () => {
              expect(diograph.diograph['some-id'].links).toStrictEqual({ 'other-id': { id: 'other-id' } })
            })

            describe('given diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.createLink({ id: 'not-existing-id' }, { id: 'other-id' })
                }).toThrow()
              })
            })

            describe('given linked diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.createLink({ id: 'some-id' }, { id: 'not-existing-id' })
                }).toThrow()
              })
            })

            describe('when deleteLink()', () => {
              beforeEach(() => {
                diory = diograph.deleteLink({ id: 'some-id' }, { id: 'other-id' })
              })

              it('deletes link between diories', () => {
                expect(diograph.diograph['some-id'].links).toBe(undefined)
              })

              describe('given diory does not exist', () => {
                it('throws error', () => {
                  expect(() => {
                    diory = diograph.deleteLink({ id: 'not-existing-id' }, { id: 'other-id' })
                  }).toThrow()
                })
              })

              describe('given linked diory does not exist', () => {
                it('throws error', () => {
                  expect(() => {
                    diory = diograph.deleteLink({ id: 'some-id' }, { id: 'not-existing-id' })
                  }).toThrow()
                })
              })
            })
          })
        })

        describe('given diograph with same diory', () => {
          it('throws error', () => {
            expect(() => {
              diograph.addDiograph({
                'some-id': {
                  id: 'some-id',
                }
              })
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
            }
          })
        })

        describe('when queryDiograph() with matching text query', () => {
          let queryDiograph: IDiograph
          beforeEach(() => {
            queryDiograph = diograph.queryDiograph({ text: 'query' })
          })

          it('returns diograph with query diory', () => {
            expect(queryDiograph.diograph['query-id'].id).toBe('query-id')
          })

          describe('when toObject()', () => {
            it('returns diograph object', () => {
              expect(queryDiograph.toObject()).toStrictEqual({
                'query-id': expect.anything(),
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

      describe('when getDiory() with id', () => {
        let diory: IDiory
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'some-id' })
        })

        it('returns diory', () => {
          expect(diory?.id).toBe('some-id')
        })

        describe('given diory does not exist', () => {
          it('throws error', () => {
            expect(() => {
              diograph.getDiory({ id: 'other-id' })
            }).toThrow()
          })
        })
      })

      describe('when createDiory() with text', () => {
        let diory: IDiory
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
          expect(diograph.diograph['some-uuid'].id).toBe('some-uuid')
        })
      })

      describe('when resetDiograph()', () => {
        it('resets diograph to empty object', () => {
          diograph.resetDiograph()

          expect(diograph.diograph).toStrictEqual({})
        })
      })

      describe('when updateDiory() with text', () => {
        let diory: IDiory
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
    })
  })
})

