import { Typography } from '@shared/components'

import s from '../tests.module.scss'

import { AnswerVariant } from './AnswerVariant/AnswerVariant'
import { cards } from './AnswerVariant/questionsData'
export const PictureCard = ({ title, answers }) => {
  //const answers = data.answers
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
                  <select>
                    <option>Значение</option>
                    <option>a.</option>
                    <option>b.</option>
                    <option>c.</option>
                  </select>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
//className={clsx(s.card,s.question, className)}