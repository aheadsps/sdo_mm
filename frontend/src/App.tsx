import './App.css'
import '@fontsource/manrope/200.css';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/manrope/800.css';
import LibraryIcon from './assets/icons/LibraryIcon';
import MainIcon from './assets/icons/MainIcon';
import StudyIcon from './assets/icons/StudyIcon';
import SettingsIcon from './assets/icons/SettingsIcon';
import NewsIcon from './assets/icons/NewIcon';
import WebinarAndSupportIcon from './assets/icons/WebinarAndSupportIcon';
import OpenedEyeIcon from './assets/icons/OpenedEyeIcon';
import ClosedEyeIcon from './assets/icons/ClosedEyeIcon';

function App() {

  return (
    <>
      <h2>Lorem ipsum dolor sit amet.</h2>
      <h3>Lorem ipsum dolor sit amet.</h3>
      <LibraryIcon color="blue" width={40} height={40} />
      <MainIcon color="green" width={40} height={40} />
      <StudyIcon color="white" width={40} height={40} />
      <SettingsIcon color="pink" width={40} height={40} /> 
      <NewsIcon color="yellow" width={40} height={40} /> 
      <WebinarAndSupportIcon color="black" width={40} height={40} /> 
      <OpenedEyeIcon color="black" width={40} height={40} />
      <ClosedEyeIcon color="black" width={40} height={40} />
    </>
  )
}

export default App
