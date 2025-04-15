import PictureIcon from '@assets/icons/PictureIcon'
import VideoIcon from '@assets/icons/VideoIcon'
import { Typography } from '@shared/components/typography'
import React, { useRef } from 'react'

import { ConstructorCard } from '../constructorCard'

import s from './constructorContent.module.scss'

interface Props {
  type: 'video' | 'text' | 'image'
  media?: string
  title?: string
  description?: string
}

export const ConstructorContent: React.FC<Props> = ({ type }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={s.wrapper}>
      <div className={s.block}>
        {type === 'video' && (
          <ConstructorCard>
            <div className={s.mediaBlock}>
              <div className={s.clickZone} onClick={() => fileInputRef.current?.click()}>
                <div className={s.iconCircle}>
                  <VideoIcon />
                </div>

                <Typography variant="body_1" className={s.uploadText}>
                  Загрузить видео можно нажав на этот блок или вставить ссылку на файл
                </Typography>

                <input
                  className={s.urlInput}
                  placeholder="Вставить ссылку на видео"
                  onClick={(e) => e.stopPropagation()}
                />

                <Typography
                  variant="caption"
                  className={s.caption}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Поддерживаются форматы: mp4, mov, webm, avi (до 100 Mb) <br />
                  Сервисы: YouTube, Vimeo, Google Drive (общедоступные)
                </Typography>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4, video/mov, video/webm, video/avi"
                className={s.fileInput}
              />
            </div>
          </ConstructorCard>
        )}
        {type === 'text' && (
          <div className={s.textBlock}>
            <label className={s.label}>Введите текст</label>
            <textarea
              className={s.textarea}
              placeholder="Например: Введение в технику безопасности"
            />
            <Typography variant="caption" className={s.caption}>
              Вы можете использовать Enter, чтобы делать абзацы.
            </Typography>
          </div>
        )}

        {type === 'image' && (
          <ConstructorCard>
            <div className={s.mediaBlock}>
              <div className={s.clickZone} onClick={() => fileInputRef.current?.click()}>
                <div className={s.iconCircle}>
                  <PictureIcon />
                </div>

                <Typography variant="body_1" className={s.uploadText}>
                  Загрузить изображение можно нажав на этот блок или вставить ссылку на файл
                </Typography>

                <input
                  className={s.urlInput}
                  placeholder="Вставить ссылку"
                  onClick={(e) => e.stopPropagation()}
                />

                <Typography
                  variant="caption"
                  className={s.caption}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Загрузка файлов: jpg, jpeg, png, gif (до 5 Mb) <br />
                  Источники: Unsplash, Pexels, Pixabay, Freepik, Flickr, StockSnap
                </Typography>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/gif"
                className={s.fileInput}
              />
            </div>
          </ConstructorCard>
        )}
      </div>
    </div>
  )
}
