import { BasketIcon, CopyIcon, DragIcon, PaintIcon, PictureIcon, VideoIcon } from '@assets/icons'
import { selectActiveBlockId, deleteItem } from '@services/slices/constructor/constructorSlice'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Typography } from '@shared/components'
import { useFileUpload } from '@shared/hooks'
import { FC } from 'react'

import { Card } from '../card'
import { ConstructorCard } from '../constructorCard'
import { AddTest } from '../constructorMenu/addTest/AddTest'
import { Input, Textarea } from '../text-field'

import s from './constructorContent.module.scss'

interface Props {
  type: 'video' | 'text' | 'image' | 'test'
  media?: string
  title?: string
  description?: string
  itemId: number
}

export const ConstructorContent: FC<Props> = ({ type, itemId }) => {
  const activeBlockId = useAppSelector(selectActiveBlockId)
  const { fileInputRef, fileName, handleButtonClick, handleFileChange } = useFileUpload()
  const dispatch = useAppDispatch()

  const onDeleteItem = () => {
    if (activeBlockId) dispatch(deleteItem({ itemId, activeBlockId }))
  }

  return (
    <div className={s.wrapper}>
      <div className={s.block}>
        {type === 'video' && (
          <ConstructorCard deleteItem={onDeleteItem}>
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
          <Card className={s.textBlock}>
            <div className={s.inputIconBlock}>
              <Input placeholder="Заголовок" className={s.input} />
              <div className={s.icons}>
                <PictureIcon width={'16px'} height={'16px'} />
                <PaintIcon width={'16px'} height={'16px'} />
                <CopyIcon width={'16px'} height={'16px'} />
                <BasketIcon width={'16px'} height={'16px'} onClick={onDeleteItem} />
                <DragIcon width={'16px'} height={'16px'} />
              </div>
            </div>
            <Textarea className={s.textarea} placeholder="Описание (не обязательно) " />
          </Card>
        )}

        {type === 'image' && (
          <ConstructorCard deleteItem={onDeleteItem}>
            <div className={s.mediaBlock}>
              <div className={s.clickZone} onClick={handleButtonClick}>
                <div className={s.iconCircle}>
                  <PictureIcon />
                </div>

                {fileName && <Typography variant="body_2">{fileName}</Typography>}

                <Typography variant="body_1" className={s.uploadText}>
                  Загрузить изображение можно нажав на этот блок или вставить ссылку на файл
                </Typography>

                <input
                  className={s.urlInput}
                  placeholder="Вставить ссылку"
                  onClick={(e) => e.stopPropagation()}
                />

                <Typography variant="caption" className={s.caption} onClick={handleButtonClick}>
                  Загрузка файлов: jpg, jpeg, png, gif (до 5 Mb) <br />
                  Источники: Unsplash, Pexels, Pixabay, Freepik, Flickr, StockSnap
                </Typography>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/gif"
                className={s.fileInput}
                onChange={handleFileChange}
              />
            </div>
          </ConstructorCard>
        )}

        {type === 'test' && (
          <ConstructorCard deleteItem={onDeleteItem}>
            <AddTest />
          </ConstructorCard>
        )}
      </div>
    </div>
  )
}
