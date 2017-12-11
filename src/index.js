import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import PageSet from './PageSet'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(PageSet)

if (module.hot) {
  module.hot.accept('./PageSet', () => { render(App) })
}
