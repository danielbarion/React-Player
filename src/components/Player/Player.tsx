import { memo, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import type { Player } from './PlayerTypes'
import { useAppGlobalStateApi, useAppGlobalStateData } from '../../contexts/AppContext'

import styles from './styles.module.css'

const Player = ({ className, ...rest }: Player) => {
  const {
    setCanvasContext,
    setCanvas,
    setFramerMaxTickSize,
    setFramerCountTicks,
    setFramerLoadingAngle,
    setTimeControl,
    setSceneInProcess,
    setIsLoadingFullSong,
  } = useAppGlobalStateApi()
  const {
    playing,
    framerTickSize,
    canvasScaleCoef,
    canvasFirstDraw,
    canvasResized,
    sceneInProcess,
    audioContext,
    audioLoadOffsetTime,
    currentSource,
    timeControl,
    playingFullMusic,
    isLoadingFullSong,
    canLoadFullSong,
    threadInUse,
    hasStreamSupport,
  } = useAppGlobalStateData()

  const canvasRef = useRef<null | HTMLCanvasElement>(null)

  const configureCanvas = () => {
    const canvasContext = canvasRef.current?.getContext('2d')

    if (canvasContext) {
      canvasContext.strokeStyle = '#61dafb'

      setCanvas(canvasRef.current)
      setCanvasContext(canvasContext)
    }
  }

  const framerInit = () => {
    const framerMaxTickSize = framerTickSize * 9 * canvasScaleCoef
    const framerCountTicks = 360 * canvasScaleCoef

    setFramerMaxTickSize(framerMaxTickSize)
    setFramerCountTicks(framerCountTicks)
  }

  const sceneRender = () => {
    if (canvasFirstDraw || canvasResized) {
      sceneClear()
      sceneDraw()
      setState({ canvasFirstDraw: false, canvasResized: false })
    }

    requestAnimationFrame(() => {
      if (playing) {
        sceneClear()
        sceneDraw()
      }
      if (sceneInProcess) {
        sceneRender()
      }
    })
  }

  const framerSetLoadingPercent = (percent: number) => {
    setFramerLoadingAngle(percent * 2 * Math.PI)
  }

  const startSceneRender = () => {
    setSceneInProcess(true)
    sceneRender()
  }

  const sceneInit = () => {
    framerInit()
    // @TODO: implement it
    // trackerInit()
    timeHandler()

    startSceneRender()

    setInterval(() => {
      timeHandler()
      songContextHandler()
    }, 300)
  }

  const showPlayer = () => {
    framerSetLoadingPercent(1)
    sceneInit()
  }

  useEffect(() => {
    configureCanvas()
  }, [])

  // useEffect(() => {

  // }, [playing])

  useEffect(() => {
    const resizeHandler = () => {
      // @TODO: need to handle the resize
      // this.canvasConfigure()
      // this.framerInit()
      // this.sceneRender()
      // this.setState({ canvasResized: true })
    }

    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return (
    <div className={styles['player']}>
      <canvas ref={canvasRef} className={styles['player-canvas']} id="Player-canvas" />
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('react_player--previous_song'))
        }}
      >
        Previous
      </button>
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('react_player--initialize'))
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent('react_player--next_song'))
        }}
      >
        Next
      </button>
    </div>
  )
}

export default memo(Player)
