// Arquivos das telas
import PIN from './screens/PIN'
import Login from './screens/Login'
import Logout from './screens/Logout'
import Dias from './screens/AulasDisponiveis'
import Horas from './screens/HorasDisponiveis'
import Welcome from './screens/Welcome'
import appInfo from './screens/appInfo'

import { createStackNavigator } from 'react-navigation'
import commonStyles from './assets/styles/commonStyles';

const navigator = createStackNavigator (
  {
    PIN: PIN,
    Login: Login,
    Logout: Logout,
    Dias: Dias,
    Horas: Horas,
    Welcome: Welcome,
    appInfo: appInfo,
  },
  {
    initialRouteName: 'Login',
    /* The header config from HomeScreen is now here */
    navigationOptions: {      
      headerBackTitle: '',
      headerTruncatedBackTitle: '',
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: commonStyles.colors.primary,
      },
      headerTintColor: commonStyles.colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'left',
      },
    },
  }
)

export const globalState = {
  
  navBar: {
    firstLink: {
      screen: 'Logout',
      state: 0,
      icon: 'power',
      title: 'Sair'
    },
    secondLink: {
      screen: 'Welcome',
      state: 1,
      icon: 'person',
      title: 'Minhas Aulas'
    },
    thirdLink: {
      screen: 'Dias',
      state: 0,
      icon: 'calendar',
      title: 'Calendário'
    },
    navigation: null
  },
    
  alunoInfo: {
    id_aluno: 0,
    pin_aluno: 0,
    nome_aluno: 'Aluno',
    email_aluno: false,
    foto_aluno: false,
    facebookID_aluno: false
  },

  aulasAgendadas:[],

  aulasDisponiveis: [],
  
  datasDisponiveis: [],
  
  horariosDisponiveis: [],

  dataSelecionada: '2001-01-01'
}

export default navigator;