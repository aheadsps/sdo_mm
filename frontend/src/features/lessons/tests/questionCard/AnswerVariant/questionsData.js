export const cards = [
  {id: 11, title: '1. Переведи на английский, какой вариант правильный?', task: '«Я — студент»', answers:
  [
    {id: 1,isCorrect: false, vary: 'a)', answer: 'a) I student', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».',},
    { id: 2,isCorrect: false, vary: 'b)', answer: 'b) I am student', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».,'
     },
    { id: 3,isCorrect: true, vary: 'c)', answer: 'c) I am a student', descr: 'Все верно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  ]

  },
  {id: 10, title: '2. Выбери, какое слово пропущено?', task: '«This __ a cat»', answers:
  [{id: 5,isCorrect: false, vary: 'a)', answer: 'a) are', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  { id: 6,isCorrect: true, vary: 'b)', answer: 'b) is', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', },
  { id: 7,isCorrect: false, vary: 'c)', answer: 'c) am', descr: 'Неверно! В английском предложении всегда нужен глагол, а перед профессией нужен артикль«a».', }
  ]
  },
  ]

  export const pictureCards = [
    {id: 12, title: '4. Сопоставь слова с их значением:', task: '', answers:
    [{ id: 8,engVary: 'Apple', answer: 'b.' },
    { id: 9, engVary: 'Dog', answer: 'a.' },
    { id: 10, engVary: 'Car', answer: 'c.' }
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