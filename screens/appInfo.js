import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native'

import styles from '../assets/styles/otherStyles'

export default class About extends Component {
  
  static navigationOptions = {
    header: null,
    title: 'About Us'
  }

  constructor(props){
    super(props)
  }

  render () {
    const { navigate } = this.props.navigation
    console.log('#=> Navigated to About.')

      return(
        <ScrollView style={{backgroundColor: '#FFF'}} contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.loginContainer}>
            <Text style={styles.aboutTitle}>Sobre o App</Text>
            <Text style={styles.aboutText}>Desenvolvido para atender a academia Viaprime no valedo aço com a gestão das aulas de seus alunos.</Text>

            <Text style={styles.aboutTitle}>Quem Somos</Text>
            <Text style={styles.aboutText}>Desenvolvemos soluções personalizadas em sistemas de gestão para cada cliente, tratando suas necessidades e objetivos de forma única, visando a implantação que realmente lhe possibilitem atingir resultados satisfatórios e de gestão completa da sua empresa.</Text>

            <Image style={styles.aboutLogo} source={require('../assets/logo-sige.png')}></Image>
            <Text style={styles.devByText}> www.sige.pro.br - 31 3829 1950 </Text>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigate('Login')}>
                  <Icon style={styles.loginButtonIcon} name="arrow-left" color="#fff" size={20}/>
                  <Text style={styles.loginButtonText}> Voltar </Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      )
    }
}