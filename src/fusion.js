import * as React from 'react'
import { connect } from 'react-redux'
import { default as compose } from 'recompose/compose'
import { default as mapProps } from 'recompose/mapProps'
import { mapPropsStreamWithConfig } from 'recompose/mapPropsStream'
import { default as pure } from 'recompose/pure'
import { default as rxjsConfig } from 'recompose/rxjsObservableConfig'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/publishReplay'

const mapPropsStream = mapPropsStreamWithConfig(rxjsConfig)
const stateProxy = new ReplaySubject(1)
const nullifiedState = {}
const stateSpy = connect((storeState) => {
  stateProxy.next(storeState)
  return nullifiedState
});
const state$ = stateProxy.distinctUntilChanged().publishReplay(1).refCount()
const dispatchSpy = compose(
  stateSpy,
  mapProps(({dispatch}) => dispatch),
  pure,
)
const fuse = (handler) => (Component) => dispatchSpy((dispatch) => {
  const enhance = mapPropsStream(handler(state$, dispatch))
  const EnhancedComponent = enhance(Component)
  return <EnhancedComponent/>
});

export default fuse
