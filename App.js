// Arquivos das telas
import Login from './screens/Login'
import Logout from './screens/Logout'
import Dias from './screens/AulasDisponiveis'
import Horas from './screens/HorasDisponiveis'
import Welcome from './screens/Welcome'

import { createStackNavigator } from 'react-navigation'
import commonStyles from './assets/styles/commonStyles';

const navigator = createStackNavigator (
  {
    Login: Login,
    Logout: Logout,
    Dias: Dias,
    Horas: Horas,
    Welcome: Welcome,
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
    id_aluno: undefined,
    nome_aluno: undefined,
    email_aluno: undefined,
    foto_aluno: undefined,
    facebookID_aluno: undefined
  },

  aulasAgendadas:[],

  aulasDisponiveis: [],
  
  datasDisponiveis: [],
  
  horariosDisponiveis: [],

  dataSelecionada: '2001-01-01'
}

export default navigator;