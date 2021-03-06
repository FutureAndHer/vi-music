import * as types from './mutation-types'
import {mode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, deleteFavorite, saveFavorite} from 'common/js/cache'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST_STATE, list)

  if (state.mode === mode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST_STATE, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST_STATE, list)
  }
  commit(types.SET_CURRENT_INDEX_STATE, index)
  commit(types.SET_FULL_SCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE_STATE, mode.random)
  commit(types.SET_SEQUENCE_LIST_STATE, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST_STATE, randomList)
  commit(types.SET_CURRENT_INDEX_STATE, 0)
  commit(types.SET_FULL_SCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAY_LIST_STATE, playList)
  commit(types.SET_CURRENT_INDEX_STATE, currentIndex)
  commit(types.SET_SEQUENCE_LIST_STATE, sequenceList)
  commit(types.SET_FULL_SCREEN_STATE, true)
  commit(types.SET_PLAYING_STATE, true)

}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY_STATE, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY_STATE, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY_STATE, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAY_LIST_STATE, playList)
  commit(types.SET_SEQUENCE_LIST_STATE, sequenceList)
  commit(types.SET_CURRENT_INDEX_STATE, currentIndex)

  let playingState = playList.length > 0 ? true : false

  commit(types.SET_PLAYING_STATE, playingState)

}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAY_LIST_STATE, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX_STATE, -1)
  commit(types.SET_SEQUENCE_LIST_STATE, [])
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY_STATE, savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST_STATE, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST_STATE, deleteFavorite(song))
}
