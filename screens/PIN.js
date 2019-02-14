import React, {Component} from 'react'
import PinView from 'react-native-pin-view'
import { View, Text, AsyncStorage } from 'react-native'

import { globalState } from '../App'
import styles from '../assets/styles/otherStyles'
import commonStyles from '../assets/styles/commonStyles';

export default class PIN extends Component {  
  static navigationOptions = {
    header: null,
    title: 'PIN'
  }

  constructor(props){
    super(props)
    
    this.state = {
      msgFeedBack: '',
      feedBackColor: commonStyles.colors.black
    }
  }

  render () {
    console.log('#=> Navigated to PIN.')
      return(
        <View style={styles.pinContainer}>
          <Text style={styles.PINfeedback} color={this.state.feedBackColor}>{this.state.msgFeedBack}</Text>
            <PinView
              pinLength={5}
              returnType={'string'}
              onComplete={ (val, clear) => {
                this.setState({msgFeedBack: 'Avaliando...', feedBackColor: commonStyles.colors.warning})
                loginOnWebservice(val, clear, this.handleWebserviceResponse)
              } }
            />
        </View>
      )
  }

  handleWebserviceResponse = (response, clear) => {
    console.log('Webservice response => ', response)
    
    if(!response.id_aluno)
    {
      this.setState({msgFeedBack: 'PIN Incorreto.', feedBackColor: commonStyles.colors.danger})
      return clear()
    }

    this.setState({msgFeedBack: 'Sucesso!', feedBackColor: commonStyles.colors.success})

    globalState.alunoInfo.pin_aluno = response.json.replace(/[^\d]/g, '')
    _storeLoginData('pin_aluno', globalState.alunoInfo.pin_aluno)

    globalState.alunoInfo.id_aluno = response.id_aluno
    _storeLoginData('id_aluno', globalState.alunoInfo.id_aluno)

    globalState.alunoInfo.registro_aula = response.registro_aula
    _storeLoginData('registro_aula', globalState.alunoInfo.registro_aula)

    const { navigate } = this.props.navigation
    navigate('Welcome')
  }
}

async function loginOnWebservice( PIN = '00000', clear, callback ) {
  console.log('RUNNING => @loginOnWebservice()', `[${PIN}]`)

  await fetch('http://fabriciano.crossfitweb.com.br/app/login_facebook.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pin: PIN
    }),
  }).then((response) => {        
   return response.json()
  }).then((responseJson) => {
      callback(responseJson, clear)
    })
    .catch((error) => {
      console.error(error)
  });
}

// LOCAL STORAGE
_storeLoginData = async (key, value) => {
  //console.log('RUNNING => @_storeLoginData()', key + ' = ' + value)
  try {
    await AsyncStorage.setItem('crossfitLogin_'+key, value.toString())
  } catch (error) {
    console.log('Error storing data: ', error)
  }
}