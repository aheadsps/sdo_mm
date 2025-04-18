import s from './materials.module.scss'
import { MaterialsDropdown } from './MaterialsDropdown'

export const Materials = () => {
  return (
    <div className={s.courseMaterials}>
      <MaterialsDropdown />
      <MaterialsDropdown />
      <MaterialsDropdown />
    </div>
  )
}
