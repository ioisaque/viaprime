import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AsyncStorage, View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, } from 'react-native'

import styles from '../assets/styles/otherStyles'
import commonStyles from '../assets/styles/commonStyles'

import 'expo';
import { globalState } from '../App'
import KeyboardShift from './components/KeyboardShift'

export default class Login extends Component {
  
  static navigationOptions = {
    header: null,
    title: 'Login'
  }

  constructor(props){
    super(props)
  }
  
  state = {
    email: 'isaquecostaa@gmail.com',
    isLoading: true
  };

  render () {
    const { navigate } = this.props.navigation
    console.log('#=> Navigated to Login.')

    if (this.state.isLoading == true) {
      _retrieveLoginData(this._getLocalLoginInfo)

      return(
        <View style={styles.perfilContainer}>
          <View style={styles.pageBodyOnLoading} >
            <ActivityIndicator size="large" color={commonStyles.colors.primary}/>
          </View>
        </View>
      )
    }else{
      return(
        <KeyboardShift>
        {() => (
          <View style={styles.loginContainer}>
            <Image style={styles.loginLogo} source={require('../assets/logo-login.png')}></Image>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigate('PIN')}>
                <Icon style={styles.loginButtonIcon} name="key" color="#fff" size={20}/>
                <Text style={styles.loginButtonText}> Entrar com o PIN! </Text>
            </TouchableOpacity>

            <View style={styles.groupInputBtn}>
              <TextInput style={styles.leftedInputText} onChangeText={text => this.setState({email: text})} value="isaquecostaa@gmail.com" placeholder={'E-mail'} keyboardType={'email-address'}></TextInput>

              <TouchableOpacity style={styles.rightedGoBtn} onPress={this.loginWithEmail}>
                <Icon style={styles.loginButtonIcon} name="sign-in" color="#fff" size={20}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.aboutButton} onPress={() => navigate('appInfo')}>
              <Text style={styles.aboutButtonText}> Quem somos </Text>
            </TouchableOpacity>
          </View>
        )}</KeyboardShift>
      )
    }
  }

  loginWithEmail = () => {      
    console.log('RUNNING => @loginWithEmail()')

    this.setState({ isLoading: true })

    if(!globalState.alunoInfo.email_aluno)
      globalState.alunoInfo.email_aluno = this.state.email

    loginOnWebservice(this._finishLoginToRedirect)
  }

  _getLocalLoginInfo = (loginData) => {      
    console.log('RUNNING => @_getLocalLoginInfo()')

    if (loginData.pin_aluno != null || loginData.email_aluno != null) {
      globalState.alunoInfo = loginData
      loginOnWebservice(this._finishLoginToRedirect)
    }else{
      this.setState({ isLoading: false })
    }
  }

  _finishLoginToRedirect = (result) => {
    console.log('RUNNING => @_finishLoginToRedirect()')

    this.setState({ isLoading: false })
    
      globalState.alunoInfo.id_aluno = result.id_aluno
      _storeLoginData('id_aluno', globalState.alunoInfo.id_aluno)

      _storeLoginData('email_aluno', globalState.alunoInfo.email_aluno)

      globalState.alunoInfo.registro_aula = result.registro_aula
      _storeLoginData('registro_aula', globalState.alunoInfo.registro_aula)

    const { navigate } = this.props.navigation
    navigate('Welcome')
  }
}

// LogIn Webservice: Faz a requisição ao webservice para logar ou atualizar as listas de aulas.
async function loginOnWebservice( callback ) {
  console.log('RUNNING => @loginOnWebservice()')

  if (globalState.alunoInfo.pin_aluno)
  {
    await fetch('https://viaprime.sige.pro/app/login_facebook.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pin: globalState.alunoInfo.pin_aluno
      }),
    }).then((response) => {        
     return response.json()
    }).then((responseJson) => {
        callback(responseJson)
      })
      .catch((error) => {
        console.error(error)
    });
  }else{
    await fetch('https://viaprime.sige.pro/app/login_facebook.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: globalState.alunoInfo.email_aluno
      }),
    }).then((response) => {        
     return response.json()
    }).then((responseJson) => {
        callback(responseJson)
      })
      .catch((error) => {
        console.error(error)
    });
  }
};

// LOCAL STORAGE
_storeLoginData = async (key, value) => {
  console.log('RUNNING => @_storeLoginData()', key + ' = ' + value)
  try {
    await AsyncStorage.setItem('crossfitLogin_'+key, value.toString())
  } catch (error) {
    console.log('Error storing data: ', error)
  }
}

_retrieveLoginData = async (callback) => {
  console.log('RUNNING => @_retrieveLoginData()')
  try {
    let values = {
      pin_aluno:          await AsyncStorage.getItem('crossfitLogin_pin_aluno'),
      id_aluno:           await AsyncStorage.getItem('crossfitLogin_id_aluno'),
      email_aluno:        await AsyncStorage.getItem('crossfitLogin_email_aluno'),
    }
    values.nome_aluno = values.nome_aluno ? values.nome_aluno : 'Aluno'

    if (values !== null) {
      console.log('Retrived crossfitLogin_ => ', values)
      callback(values)
    }
   } catch (error) {
     console.log('Error retrieving data: ', error)
     return null
   }
}