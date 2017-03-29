import React from 'react'
import assert from 'assert'
import jsdom from 'jsdom'
import { createStore } from 'redux'
import { mount } from 'enzyme'
import { Observable } from 'rxjs'
import fuse from './fusion'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView

const mocks = () => {
  const mockStream = () => () => Observable.of('foo')
  const mockStore = createStore(() => {});
  return {
    mockStream,
    mockStore
  }
}

describe('fusion', () => {
  it('should render the wrapped component', () => {
    const { mockStream, mockStore } = mocks()
    const WrappedComponent = () => <div />
    const FusedComponent = fuse(mockStream, WrappedComponent)
    const enz = mount(
      <FusedComponent />,
      { context: { store: mockStore } }
    )
    assert.equal(enz.find('div').length, 1, 'wrapper div rendered')
  })

  it('should throw an error when store is not in context', () => {
    const { mockStream } = mocks()
    const WrappedComponent = () => <div />
    const FusedComponent = fuse(mockStream, WrappedComponent)
    assert.throws(
      () => mount(<FusedComponent />, { context: undefined }),
      /Missing/,
      'thrown error'
    )
  })

  it('should throw an error when store is not observable', () => {
    const { mockStream } = mocks()
    const WrappedComponent = () => <div />
    const FusedComponent = fuse(mockStream, WrappedComponent)
    assert.throws(
      () => mount(<FusedComponent />, { context: { store: {} } }),
      /observable/,
      'throws error'
    )
  })
})
