import * as React from 'react'
import { connect } from 'react-redux'
import { componentFromStreamWithConfig } from 'recompose/componentFromStream'
import { default as rxjsConfig } from 'recompose/rxjsObservableConfig'
import { default as shallowEqual } from 'recompose/shallowEqual'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/let'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/publishReplay'

const namespece = 'reduxFusion'
const componentFromStream = componentFromStreamWithConfig(rxjsConfig)
const stateProxy = new ReplaySubject(1)
const nullifiedState = {}
const stateSpy = (storeState) => {
  stateProxy.next(storeState)
  return nullifiedState
}
const dispatchKey = `${namespece}Dispatch`
const dispatchSpy = (dispatch) => ({ [dispatchKey]: dispatch })
const connectSpy = connect(stateSpy, dispatchSpy)
const state$ = stateProxy.distinctUntilChanged().publishReplay(1).refCount()

const fuse = (connectHandler) => (Component) => {
  class FusedComponent extends React.Component {
    constructor(props) {
      super(props)
      const { [dispatchKey]: dispatch, ...pureProps } = props
      const propsProxy = new BehaviorSubject(pureProps)
      const propsHandler = connectHandler(state$, dispatch)
      const transformedProps$ = propsProxy
        .distinctUntilChanged(shallowEqual)
        .let(propsHandler)
        .distinctUntilChanged(shallowEqual)
      const applyPropsStream = (transformedProps) => <Component {...transformedProps}/>
      this.propsProxy = propsProxy
      this.ConnectedComponent = componentFromStream(
        () => transformedProps$.map(applyPropsStream),
      )
    }

    componentWillReceiveProps(nextProps) {
      // eslint-disable-next-line no-unused-vars
      let { [dispatchKey]: unused, ...pureProps } = nextProps;
      this.propsProxy.next(pureProps)
    }

    shouldComponentUpdate() {
      return false
    }

    propsProxy
    ConnectedComponent

    render() {
      const { ConnectedComponent } = this
      return <ConnectedComponent/>
    }
  }

  return connectSpy(FusedComponent)
}

export default fuse
