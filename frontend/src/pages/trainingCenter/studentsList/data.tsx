export const columns: string[] = ['Студент', 'Прогресс', 'Действия']

export type studentType = {
  id: number
  name: string
  progress: number
  //   isExpandableContent?: boolean
}

export const studentsData: studentType[] = [
  {
    id: 1,
    name: 'Кузнецов Евгений Андреевич',
    progress: 20,
  },
  {
    id: 2,
    name: 'Петровa Татьяна Артемовa',
    progress: 40,
  },
  {
    id: 3,
    name: 'Зайцевa Александра Геннадиевa',
    progress: 80,
  },
  {
    id: 4,
    name: 'Михайлов Игорь Тимофеевич',
    progress: 5,
  },
  {
    id: 5,
    name: 'Васильевa Владислава Геннадиевa',
    progress: 0,
  },
  {
    id: 4,
    name: 'Соколов Иван Антонович',
    progress: 98,
  },
  {
    id: 4,
    name: 'Степановa София Александровa',
    progress: 100,
  },
]
