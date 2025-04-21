import { Student } from './AssignmentsCheck'
import Status from './Status'

export const students: Student[] = [
  { id: '1', name: 'Титов Валерий Иосифович', status: Status.UNSERT },
  { id: '2', name: 'Тарасова Владислава Романова', status: Status.UNSERT },
  { id: '3', name: 'Михайлова Алиса Михайлова', status: Status.UNSERT },
  { id: '4', name: 'Иванова Мария Антонова', status: Status.REVIEWING },
  { id: '5', name: 'Иванов Владимир Витальевич', status: Status.REVIEWING },
  { id: '6', name: 'Титов Валерий Иосифович', status: Status.DONE },
  { id: '7', name: 'Тарасова Владислава Романова', status: Status.DONE },
  { id: '8', name: 'Михайлова Алиса Михайлова', status: Status.DONE },
  { id: '9', name: 'Соловьёв Иван Федорович', status: Status.DONE },
  { id: '10', name: 'Соколов Василий Николаевич', status: Status.DONE },
  { id: '11', name: 'Макарова Валерия Станиславова', status: Status.DONE },
]
