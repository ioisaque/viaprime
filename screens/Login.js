import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert, AsyncStorage, View, Text, TouchableOpacity, Image, ActivityIndicator, } from 'react-native';

import styles from '../assets/styles/otherStyles';
import commonStyles from '../assets/styles/commonStyles';

import 'expo';
import { globalState } from '../App';

export default class Login extends Component {
  
  static navigationOptions = {
    header: null,
    title: 'Login'
  }

  constructor(props){
      super(props)
  }
  
  state = {
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
        <View style={styles.loginContainer}>
            <Image style={styles.loginLogo} source={require('../assets/logo-login.png')}></Image>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigate('PIN')}>
                <Icon style={styles.loginButtonIcon} name="key" color="#fff" size={20}/>
                <Text style={styles.loginButtonText}> Entrar com o PIN! </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => callFacebookGraph(this._handleFacebookResponse)}>
                <Icon style={styles.loginButtonIcon} name="facebook-f" color="#fff" size={20}/>
                <Text style={styles.loginButtonText}> Entrar com o Facebook! </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.aboutButton} onPress={() => navigate('appInfo')}>
              <Text style={styles.aboutButtonText}> Quem somos </Text>
            </TouchableOpacity>
        </View>
      )
    }
  }

  _getLocalLoginInfo = (loginData) => {      
    //console.log('RUNNING => @_getLocalLogin()', loginData)
    
    console.log(loginData)

    if (loginData.pin_aluno != null || loginData.email_aluno != null) {
      globalState.alunoInfo = loginData
      loginOnWebservice(this._finishLoginToRedirect)
    }else{
      this.setState({ isLoading: false })
    }
  }

  _finishLoginToRedirect = (result) => {
    //console.log('RUNNING => @_finishLoginToRedirect()')
    
      globalState.alunoInfo.id_aluno = result.id_aluno
      _storeLoginData('id_aluno', globalState.alunoInfo.id_aluno)

      globalState.alunoInfo.registro_aula = result.registro_aula
      _storeLoginData('registro_aula', globalState.alunoInfo.registro_aula)

    const { navigate } = this.props.navigation
    navigate('Welcome')
  }
  
  _handleFacebookResponse = (result) => {
    //console.log('RUNNING => @_handleFacebookResponse')

      this.setState({ isLoading: true })

      globalState.alunoInfo.facebookID_aluno = result.id
      globalState.alunoInfo.nome_aluno = result.name
      globalState.alunoInfo.email_aluno = result.email
      globalState.alunoInfo.foto_aluno = 'https://graph.facebook.com/'+ result.id +'/picture?type=large'

      _storeLoginData('email_aluno', globalState.alunoInfo.email_aluno)
      _storeLoginData('nome_aluno',  globalState.alunoInfo.nome_aluno)
      _storeLoginData('foto_aluno',  globalState.alunoInfo.foto_aluno)
      _storeLoginData('facebookID_aluno', globalState.alunoInfo.facebookID_aluno)
  
      loginOnWebservice(this._finishLoginToRedirect)      
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
        email: globalState.alunoInfo.email_aluno,
        nome: globalState.alunoInfo.nome_aluno,
        foto: globalState.alunoInfo.foto_aluno
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

async function callFacebookGraph( callback ) {
  //console.log('RUNNING => @callFacebookGraph()')
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('354176225132574', {
    // behavior: 'web',
    permissions: ['public_profile', 'email'], 
  });

  if (type === 'success') {
    let result = await fetch('https://graph.facebook.com/me?access_token='+token+'&fields=id,name,email,about,picture')
    .then((response) => {  
     return response.json()
    }).then((responseJson) => {
        callback(responseJson)
      })
      .catch((error) => {
        console.error(error)
    });
    
    return result
  }else{
    console.log('Login Error => ', type)  
  }
};

// LOCAL STORAGE
_storeLoginData = async (key, value) => {
  //console.log('RUNNING => @_storeLoginData()', key + ' = ' + value)
  try {
    await AsyncStorage.setItem('crossfitLogin_'+key, value.toString())
  } catch (error) {
    console.log('Error storing data: ', error)
  }
}

_retrieveLoginData = async (callback) => {
  //console.log('RUNNING => @_retrieveLoginData()')
  try {
    let values = {
      pin_aluno:          await AsyncStorage.getItem('crossfitLogin_pin_aluno'),
      id_aluno:           await AsyncStorage.getItem('crossfitLogin_id_aluno'),
      nome_aluno:         await AsyncStorage.getItem('crossfitLogin_nome_aluno'),
      email_aluno:        await AsyncStorage.getItem('crossfitLogin_email_aluno'),
      foto_aluno:         await AsyncStorage.getItem('crossfitLogin_foto_aluno'),
      facebookID_aluno:   await AsyncStorage.getItem('crossfitLogin_facebookID_aluno')
    }
    values.nome_aluno = values.nome_aluno ? values.nome_aluno : 'Aluno'

    if (values !== null) {
      //console.log('Retrived crossfitLogin_ => ', values)
      callback(values)
    }
   } catch (error) {
     console.log('Error retrieving data: ', error)
     return null
   }
}