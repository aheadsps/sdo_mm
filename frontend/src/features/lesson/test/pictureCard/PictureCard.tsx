import { Select, Typography } from '@shared/components'

import s from '../tests.module.scss'

const options = [
  {
    id: 1,
    value: 'Cat',
  },
  {
    id: 2,
    value: 'Dog',
  },
  {
    id: 3,
    value: 'Apple',
  },
]

type PictureAnswer = {
  id: number
  engVary: string
  answer: string
}

type Props = {
  title: string
  answers: PictureAnswer[]
}
export const PictureCard = ({ title, answers }: Props) => {
  return (
    <div>
      <div className={(s.question, s.pictureCard)}>
        <Typography variant="body_1" className={s.headerQuestion}>
          <span>{title}</span>
        </Typography>
        <div className={s.match}>
          <div className={s.imageGroup}>
            <div className={s.pictureBox}>
              <img src="img/dog.png" alt="Dog" />
              <Typography variant="body_1" className={s.headerQuestion}>
                <span>a.</span>
              </Typography>
            </div>
            <div className={s.pictureBox}>
              <img src="img/Apple.png" alt="Apple" />
              <Typography variant="body_1" className={s.headerQuestion}>
                <span>b.</span>
              </Typography>
            </div>
            <div className={s.pictureBox}>
              <img src="img/car.png" alt="Car" />
              <Typography variant="body_1" className={s.headerQuestion}>
                <span>c.</span>
              </Typography>
            </div>
          </div>
          <div className={s.selectGroup}>
            {answers.map((answerData, index) => {
              return (
                <div key={index} className={s.optionCard}>
                  <Typography variant="body_1" className={s.headerQuestion}>
                    <span>{answerData.engVary}</span>
                  </Typography>
                  <Select options={options} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
