# redux-fusion
[![Build Status](https://travis-ci.org/cif/redux-fusion.svg?branch=master)](https://travis-ci.org/cif/redux-fusion)

### What is this?
This module is a higher order component that serves as a replacement for `react-redux` [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options).
There is no additional buy in, all of your redux modules remain as-is. You could even wrap an existing connected component with `fuse()` if desired.

### How it works
Redux `createStore` is [observable](https://github.com/reactjs/redux/blob/master/src/createStore.js#L203-L208) so it is straight forward to
access store from root `<Provider>` context, convert state to a `state$` observable and subscribe a wrapped component's props via `mapPropsStream()`.
See [recompose's Observable utilities](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities) for more details.

Effectively, this just wraps ``mapPropsStream()` in another function with signature
`($state, dispatch)` giving a "fuser" bi-directional reactive programing capabilities.

It looks like this:

```
import React from 'react'
import { createEventHandler } from 'recompose'
import fuse from 'redux-fusion'

const Hello$ = (state$, dispatch) => (props$) => {
  // handler props for the component (see recompose observable utils)
  const { handler: handleClick, stream: click$ } = createEventHandler()

  // subscribe to click stream, debounce before dispatch to redux
  click$
    .debounceTime(300)
    .subscribe(() => dispatch(someReduxAction()))

  // subscribe to some state stream properties, a 'selector' of sorts
  const $hello = state$
    .pluck('hello')
    .map(val => `Hello ${val}`)

  return props$.combineLatest(hello$, (props, hello) => ({
    hello,
    handleClick
  }))   

}

// consume
const Hello = ({ handleClick, message }) =>
  (
    <div>
      Hello {message}!
      <button onClick={handleClick}>Click Me</button>
    </div>
    )

// the final 'fused' or 'connected' container component
const HelloWorld = fuse(Hello$, Hello)

```

## Stay tuned for more real life examples!
