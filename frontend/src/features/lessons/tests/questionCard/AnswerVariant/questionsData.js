export const cards = [
  {id: 1, title: '1. Переведи на английский, какой вариант правильный?', task: '«Я — студент»', answers:
  [
    {isCorrect: false, vary: 'a)', answer: 'a) I student', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».',},
    { isCorrect: false, vary: 'b)', answer: 'b) I am student', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».,'
     },
    { isCorrect: true, vary: 'c)', answer: 'c) I am a student', descr: 'Все верно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  ]

  },
  {id: 2, title: '2. Выбери, какое слово пропущено?', task: '«This __ a cat»', answers:
  [{isCorrect: false, vary: 'a)', answer: 'a) are', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  { isCorrect: true, vary: 'b)', answer: 'b) is', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  { isCorrect: false, vary: 'c)', answer: 'c) am', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', }
  ]
  },
  ]

  export const pictureCards = [
    {id: 1, title: '4. Сопоставь слова с их значением:', task: '', answers:
    [{ engVary: 'Apple', answer: 'b.' },
    { engVary: 'Dog', answer: 'a.' },
    { engVary: 'Car', answer: 'c.' }
    ]
    },
  ]

  export const quest = 
  {
    "id": 1,
    "questions": [
        {
            "id": 1,
            "text": "Кто ты такой?",
            "image": null,
            "answers": [
                {
                    "id": 1,
                    "text": "Питонист"
                },
                {
                    "id": 2,
                    "text": "Фронт"
                },
                {
                    "id": 3,
                    "text": "Человек"
                },
                {
                    "id": 4,
                    "text": "Инопланетянин"
                }
            ]
        },
        {
            "id": 2,
            "text": "Когда закончим?",
            "image": null,
            "answers": [
                {
                    "id": 5,
                    "text": "Да, хз"
                },
                {
                    "id": 6,
                    "text": "Завтра"
                },
                {
                    "id": 7,
                    "text": "Через неделю"
                },
                {
                    "id": 8,
                    "text": "Через 2 недели"
                }
            ]
        }
    ]
}