import persistedUiStates from '@/web/states/persistedUiStates'
import player from '@/web/states/player'
import { ease } from '@/web/utils/const'
import { cx, css } from '@emotion/css'
import { MotionConfig, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import Icon from '../Icon'
import { State as PlayerState } from '@/web/utils/player'
import useUserLikedTracksIDs, { useMutationLikeATrack } from '@/web/api/hooks/useUserLikedTracksIDs'
import { toast } from 'react-hot-toast'
import { BlockDescription, BlockTitle, Option, OptionText, Switch, Input } from '@/web/pages/Settings/Controls'
import Slider from '@/web/components/Slider'
import { ceil } from 'lodash'
import {useTranslation} from 'react-i18next'

const LikeButton = () => {
  const { track } = useSnapshot(player)
  const { data: likedIDs } = useUserLikedTracksIDs()
  const isLiked = !!likedIDs?.ids?.find(id => id === track?.id)
  const likeATrack = useMutationLikeATrack()
  const { minimizePlayer: mini } = useSnapshot(persistedUiStates)

  return (
    <motion.button
      layout='position'
      animate={{ rotate: mini ? 90 : 0 }}
      onClick={() => track?.id && likeATrack.mutateAsync(track.id)}
      className='text-black/90 transition-colors duration-400 dark:text-white/40 hover:dark:text-white/90'
    >
      <Icon name={isLiked ? 'heart' : 'heart-outline'} className='h-7 w-7' />
    </motion.button>
  )
}

const Controls = () => {
  const { state, track } = useSnapshot(player)
  const { minimizePlayer: mini } = useSnapshot(persistedUiStates)

  return (
    <MotionConfig transition={{ ease, duration: 0.6 }}>
      <motion.div
        className={cx(
          'fixed bottom-0 right-0 flex',
          mini ? 'flex-col items-center justify-between' : 'items-center justify-between',
          mini
            ? css`
                right: 24px;
                bottom: 18px;
                width: 44px;
                height: 254px;
              `
            : css`
                bottom: 56px;
                right: 56px;
                width: 254px;
              `
        )}
      >
         

        {/* Minimize */}
        <motion.button
          layout='position'
          animate={{ rotate: mini ? 90 : 0 }}
          className='text-black/90 transition-colors duration-400 dark:text-white/40 hover:dark:text-white/90'
          onClick={() => {
            persistedUiStates.minimizePlayer = !mini
          }}
        >
          <Icon name='hide-list' className='h-7 w-7 ' />
        </motion.button>


        {/* Media controls */}
        <div className='flex flex-wrap gap-2 text-black/95 dark:text-white/80'>
        
          <motion.button
            layout='position'
            animate={{ rotate: mini ? 90 : 0 }}
            onClick={() => track && player.prevTrack()}
            disabled={!track}
            className='rounded-full bg-black/10 p-2.5 transition-colors duration-400 dark:bg-white/10 hover:dark:bg-white/20'
          >
            <Icon name='previous' className='h-6 w-6' />
          </motion.button>
          <motion.button
            layout='position'
            animate={{ rotate: mini ? 90 : 0 }}
            onClick={() => track && player.playOrPause()}
            className='rounded-full bg-black/10 p-2.5 transition-colors duration-400 dark:bg-white/10 hover:dark:bg-white/20'
          >
            <Icon
              name={[PlayerState.Playing, PlayerState.Loading].includes(state) ? 'pause' : 'play'}
              className='h-6 w-6 '
            />
          </motion.button>
          <motion.button
            layout='position'
            animate={{ rotate: mini ? 90 : 0 }}
            onClick={() => {
              track && player.nextTrack()
            }}
            disabled={!track}
            className='rounded-full bg-black/10 p-2.5 transition-colors duration-400 dark:bg-white/10 hover:dark:bg-white/20'
          >
            <Icon name='next' className='h-6 w-6 ' />
          </motion.button>
        </div>

        {/* Like */}
        <LikeButton />
      </motion.div>
      <motion.div className={cx(`space-y-7`)}>
        {'asdgasgasgsg'}
      <VolumeSlider />
      </motion.div>
    </MotionConfig>
  )
}

function VolumeSlider() {
  const { t } = useTranslation()
  const { volume } = useSnapshot(player)
  const onChange = (volume: number) => {
    player.volume = volume
  }
  return (
    <div>
      {' holy shit '}
      <div className='pt-2 pr-1'>
        <Slider
          value={volume}
          min={0}
          max={1}
          onChange={onChange}
          alwaysShowTrack
          alwaysShowThumb
        />
      </div>
      <div className='mt-1 flex justify-between text-14 font-bold text-neutral-100'>
        <span>0</span>
        <span>{ceil(volume * 100)}</span>
      </div>
    </div>
  )
}

export default Controls
