import React, {Component} from 'react'
import Dialog, { DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog'
import { View, StatusBar, Text, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br'
import AulaInfo from './components/AulaInfo'
import MinhaAula from './components/MinhaAula'

import Icon from 'react-native-vector-icons/FontAwesome'

import {globalState} from '../App'
import BottomNav from './components/BottomNav'
import styles from '../assets/styles/otherStyles'
import commonStyles from '../assets/styles/commonStyles'

export default class Welcome extends Component{
    
    static navigationOptions = {
      header: null,
      headerLeft: (null),
      headerTitle: (null),
      headerRight: (null)
    }

    constructor(props) {
      super(props)

      this.state = {
        isLoading: true,

        dialogTitle: 'undefined',
        dialogMessage: 'undefined',
        dialogCurrentItem: null,
        isConfirmationDialogVisible: false
      }
      updateState = this.updateLoadingState.bind(this)
      _handleLogOut = this._handleLogOut.bind(this)
      toggleConfirmationDialog = this.toggleConfirmationDialog.bind(this)
    }

    updateLoadingState = (value) => {
      this.setState({ isLoading: value });
    }  

    render () {     
      console.log('#=> Navigated to Welcome.', globalState.alunoInfo)
      
      const { navigate } = this.props.navigation
      globalState.navBar.navigation = this.props.navigation
      globalState.navBar.firstLink = {
        screen: 'Logout',
        icon: 'power',
        title: 'Sair' 
      }

      if (this.state.isLoading == true) {
        logInWebservice(globalState.alunoInfo.email_aluno, globalState.alunoInfo.nome_aluno, globalState.alunoInfo.foto_aluno, this._UpdateAulasAgendadas)
        
        return(
          <View style={styles.perfilContainer}>
           <StatusBar barStyle="light-content" />     

            <View style={styles.topHeader}>

              <View style={styles.inlineFlexRowBetween} marginTop={25}>
                <Image style={styles.headerLogoVA} source={require('../assets/logoVA.png')}/>

                <View style={styles.inlineFlexRowUserInfo}>
                  <Image style={styles.profilePic} source={{uri: globalState.alunoInfo.foto_aluno}}/>
                  <Text style={styles.welcomeText}> Olá, {globalState.alunoInfo.nome_aluno.split(' ', 1)}! </Text>
                </View>
              </View>

              <View style={styles.inlineFlexRowBetween}>
                <Text style={styles.welcomeSubText}>Minhas Aulas</Text>

                <TouchableOpacity style={styles.refreshButton} onPress={() => this._handlelogInWebservice} >
                  <Icon name="refresh" color={commonStyles.colors.white} size={20}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pageBodyOnLoading} >
              <ActivityIndicator size="large" color={commonStyles.colors.primary}/>
            </View>

            <BottomNav {...globalState.navBar}/>

          </View>
        )
      }else{
        return( 
        <View style={styles.perfilContainer}>
            <StatusBar barStyle="light-content" />      

            <View style={styles.topHeader}>

              <View style={styles.inlineFlexRowBetween}>
                <Image style={styles.headerLogoVA} source={require('../assets/logoVA.png')}/>

                <View style={styles.inlineFlexRowUserInfo}>
                  <Image style={styles.profilePic} source={{uri: globalState.alunoInfo.foto_aluno}}/>
                  <Text style={styles.welcomeText}> Olá, {globalState.alunoInfo.nome_aluno.split(' ', 1)}! </Text>
                </View>
              </View>

              <View style={styles.inlineFlexRowBetween}>
                <Text style={styles.welcomeSubText}>Minhas Aulas</Text>

                <TouchableOpacity style={styles.refreshButton} onPress={this._handlelogInWebservice} >
                    <Icon name="refresh" color={commonStyles.colors.white} size={20}/>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.pageBody}>
              <FlatList data={globalState.aulasAgendadas}
                extraData={this.state}
                keyExtractor={item => `${item.id_aula}`}
                renderItem={({ item }) => <TouchableOpacity onPress={() => this.toggleDetailDialog(item)}><MinhaAula {...item}/></TouchableOpacity>}/>
            </View>

            <BottomNav {...globalState.navBar}/>

          <Dialog
            dialogTitle={<DialogTitle title={this.state.dialogTitle}/>}
            dialogStyle={styles.defaultDialog} 
            visible={this.state.isConfirmationDialogVisible}
            onTouchOutside={ () => { this.setState({ isConfirmationDialogVisible: false }) } }
            actions={[
              <DialogButton text="SIM" style={styles.successBtn} onPress={ () => {this._handleDialogResponse()}} textStyle={{color: commonStyles.colors.white}}/>,
              <DialogButton text="NÃO" style={styles.dangerBtn} onPress={ () => { this.setState({ isConfirmationDialogVisible: false }) }} textStyle={{color: commonStyles.colors.white}}/>
            ]}
            actionsBordered={false}
          >
            <DialogContent>
              <AulaInfo {...this.state.dialogCurrentItem}/>
              <Text style={styles.dialogTitle}>{this.state.dialogMessage}</Text>
            </DialogContent>
          </Dialog>

          <Dialog
            visible={this.state.isDetailDialogVisible}
            style={styles.defaultDialog}
            width={'90%'}
            height={'65%'}
            onTouchOutside={ () => {this.toggleDetailDialog()} }
            dialogTitle={<DialogTitle title={(<Text style={styles.status}>Detalhes da aula</Text>)}/>}
            actions={<DialogButton style={styles.info} text="OK"  onPress={() => this.setState({ isDetailDialogVisible: false }) }/>}
          >                        
            <ScrollView>
              {
                this.state.dialogModalidade ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Modalidade: </Text>
                      <Text style={styles.details}>{this.state.dialogModalidade}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogData ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Data: </Text>
                      <Text style={styles.details}>{this.state.dialogData}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogHorario ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Horário: </Text>
                      <Text style={styles.details}>{this.state.dialogHorario}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogProfessor ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Professor: </Text>
                      <Text style={styles.details}>{this.state.dialogProfessor}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogDeatalhes ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Detalhes: </Text>
                      <Text style={styles.details}>{this.state.dialogDeatalhes}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogAquecimento ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Aquecimento: </Text>
                      <Text style={styles.details}>{this.state.dialogAquecimento}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogTecnica ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Técnica: </Text>
                      <Text style={styles.details}>{this.state.dialogTecnica}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogWOD ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>WOD: </Text>
                      <Text style={styles.details}>{this.state.dialogWOD}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }

              {
                this.state.dialogVagas ?
                  <View>
                    <View style={styles.detailLine}></View>

                    <View style={styles.detailInlineText}>
                      <Text style={styles.detailSubTitle}>Vagas: </Text>
                      <Text style={styles.details}>{this.state.dialogVagas}</Text>
                    </View>
                  </View>
                : 
                  <View></View>
              }
            </ScrollView>
          </Dialog>
        </View>
        ) 
      }  
    }   

    killDialogs = () => {
      this.setState({ isDetailDialogVisible: false, isConfirmationDialogVisible: false });
    }
  
    toggleDetailDialog = (aula) => {
      console.log('EXECUTED => @toggleDetailDialog()')

      if (aula)
        this.setState({
          dialogModalidade:     aula.modalidade,
          dialogData:           moment(aula.data_aula).format('dddd, DD[/]MM'),
          dialogHorario:        moment(aula.data_aula + ' ' + aula.hora_aula).format('HH:mm'),
          dialogProfessor:      aula.professor,
          dialogAquecimento:    aula.aquecimento,
          dialogTecnica:        aula.tecnica,
          dialogWOD:            aula.wod,
          dialogVagas:          aula.vagas,
          dialogDeatalhes:      aula.detalhes
        })
      else
        this.setState({
          dialogModalidade:   null,
          dialogData:         null,
          dialogHorario:      null,
          dialogProfessor:    null,
          dialogAquecimento:  null,
          dialogTecnica:      null,
          dialogWOD:          null,
          dialogVagas:        null,
          dialogDeatalhes:    null
        })

      this.setState({ isDetailDialogVisible: !this.state.isDetailDialogVisible })
    }

    toggleConfirmationDialog = (item) => {
      if (item)
        this.setState({
          dialogTitle: 'DESMARCAR',
          dialogMessage: 'Tem certeza que deseja DESMARCAR esta aula?',
          dialogCurrentItem: item,
        })
      else
        this.setState({
          dialogTitle: 'SAIR',
          dialogMessage: 'Tem certeza que deseja SAIR?',
          dialogCurrentItem: undefined
        })

      this.setState({ isConfirmationDialogVisible: !this.state.isConfirmationDialogVisible })

      console.log('EXECUTED => @toggleConfirmationDialog()')
    }

    _handleDialogResponse = () => {
      console.log('RUNNING => @_handleDialogResponse()')
      if (this.state.dialogTitle == 'SAIR')
        this._handleLogOut(1)

      if (this.state.dialogTitle == 'DESMARCAR')
        DesmarcarAula(this.state.dialogCurrentItem.id_aula, globalState.alunoInfo.id_aluno, this._handleAulaDesmarcada)

      this.killDialogs()
    }

    _handleLogOut = (action) => {
      console.log('RUNNING => @_handleLogOut()')
      if (action) {
        this.setState({ isConfirmationDialogVisible: false })
        const { navigate } = this.props.navigation
        navigate('Logout')
      }else
        this.setState({
          dialogTitle: 'SAIR',
          dialogMessage: 'Tem certeza que deseja sair?',
          dialogCurrentItem: undefined,
          isConfirmationDialogVisible: true
        })
    }

    _handlelogInWebservice = () => {
      console.log('RUNNING => @_handlelogInWebservice()')
      this.setState({ isLoading : true })

      logInWebservice(globalState.alunoInfo.email_aluno, globalState.alunoInfo.nome_aluno, globalState.alunoInfo.foto_aluno, this._UpdateAulasAgendadas)
    }

    _RemoverDatasDuplicadas(lista) {
      console.log('RUNNING => @_RemoverDatasDuplicadas()')
      let lastDate = null

      lista.forEach(element => {
        if (element.data_aula == lastDate) {
          lista = [...lista]
          lista.splice(lista.indexOf(element), 1)
        }

        lastDate = element.data_aula
      });

      return lista
    };

    _UpdateAulasAgendadas = (result) => {
      console.log('RUNNING => @_UpdateAulasAgendadas()')

      const stripHtmlTags = oldHtml => {        
        return oldHtml
        .replace(/&lt;/g,"<")
        .replace(/&gt;/g,">")
        .replace(/<br>/g,'\n')
        .replace(/<[^>]*>/g,"")
      }

      result.aulas = result.aulas.map( item => {
        item.aquecimento  = item.aquecimento ? stripHtmlTags(item.aquecimento) : null
        item.tecnica      = item.tecnica ? stripHtmlTags(item.tecnica) : null
        item.wod          = item.wod ? stripHtmlTags(item.wod) : null
        return item
      })

      const data = new Date().getFullYear() +'-'+ (parseInt(new Date().getMonth())+1).toString().padStart(2, "0") +'-'+ new Date().getDate().toString().padStart(2, "0")
      const hora = new Date().getHours().toString().padStart(2, "0") +':'+ new Date().getMinutes().toString().padStart(2, "0") + ':00'
      const nowTimestamp = data + ' ' + hora
      console.log("\n=> NOW: ", nowTimestamp + '\n')

      const classWillHappen = (item) => {
        const classTimestamp = `${item.data_aula} ${item.hora_aula}`
        //console.log("CLASS: ", classTimestamp)
        return classTimestamp > nowTimestamp
      }
      result.aulas = result.aulas.filter(classWillHappen)

      //Separando aulas com vagas na global 'aulasDisponiveis'
      globalState.aulasDisponiveis = result.aulas
      console.log('UPDATED => @globalState.aulasDisponiveis')

      //Separando aulas agendadas na global 'aulasAgendadas'
      globalState.aulasAgendadas = result.aulas.filter((item) => item.aluno_ativo == 1)
      console.log('UPDATED => @globalState.aulasAgendadas.')

      //Separando datas disponíveis na global 'datasDisponiveis'
      globalState.datasDisponiveis = globalState.aulasDisponiveis.map(a => ({data_aula: a.data_aula, aluno_ativo: a.aluno_ativo, vagas: a.vagas}))
      globalState.datasDisponiveis = this._RemoverDatasDuplicadas(globalState.datasDisponiveis)
      console.log('UPDATED => @globalState.datasDisponiveis.')

      this.setState({isLoading: false})
    }

    _handleAulaDesmarcada = (result) => {
      console.log('RUNNING => @_handleAulaDesmarcada()')
      if (result.registro_aula == 1)
      {
        console.log('\nSUCESSO: Aula desmarcada!')
        this._handlelogInWebservice()
      }else{
        console.log('\nERROR: ', result.status)
      }
    }
};

// Desmarcar Aula: Faz a requisição ao webservice para desmarcar a aula.
async function DesmarcarAula(aula_id, aluno_id, callback ) {
  console.log('RUNNING => @DesmarcarAula()')

  let result = await fetch('http://fabriciano.crossfitweb.com.br/app/aulas.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_aula: aula_id,
      id_aluno: aluno_id,
      acao: 0
    })
  }).then((response) => {
    return response.json()
  }).then((responseJson) => {
      callback(responseJson)
    })
    .catch((error) => {
      console.error(error)
  });

  this.setState({ isLoading : true })

  return result
};

// LogIn Webservice: Faz a requisição ao webservice para logar ou atualizar as listas de aulas.
async function logInWebservice( sEmail = '', sNome = '', sFoto = '', callback ) {
  console.log('RUNNING => @logInWebservice()')

  await fetch('http://fabriciano.crossfitweb.com.br/app/login_facebook.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: sEmail,
      nome: sNome,
      foto: sFoto
    }),
  }).then((response) => {        
   return response.json()
  }).then((responseJson) => {
      callback(responseJson)
    })
    .catch((error) => {
      console.error(error)
  });
};