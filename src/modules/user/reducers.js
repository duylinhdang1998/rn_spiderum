import { handleActions } from 'redux-actions'
import { clearAll } from '../../common/actions/common'
import * as actions from './actions'

const defaultState = {
  bookmark: []
}

const handlers = {
  [clearAll]: (state, action) => ({ ...defaultState }),
  [actions.saveNews]: (state, action) => {
    const bookmark = (state.bookmark || []).filter(item => {
      return item._id !== action.payload._id
    })
    return {
      ...state,
      bookmark: [action.payload, ...bookmark]
    }
  },
  [actions.removeNews]: (state, action) => {
    const bookmark = (state.bookmark || []).filter(item => {
      return item._id !== action.payload._id
    })
    return {
      ...state,
      bookmark
    }
  }
}

export default handleActions(handlers, defaultState)
