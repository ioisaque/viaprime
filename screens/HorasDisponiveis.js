import React, {Component} from 'react'
import Dialog, { DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog';
import { View, Image, ScrollView, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import moment from 'moment'
import 'moment/locale/pt-br'

import {globalState} from '../App'
import AulaInfo from './components/AulaInfo'
import HoraAula from './components/HoraAula'
import BottomNav from './components/BottomNav'
import styles from '../assets/styles/otherStyles';
import commonStyles from '../assets/styles/commonStyles';

export default class Horas extends Component{
  static navigationOptions = {
    headerLeft: (
      <Image
        source={require('../assets/icon.png')}
        style={styles.headerLOGO}
      />
    ),
    headerTitle: (null),
    headerRight: (
      <Text style={styles.headerRightText}>Horários Disponíveis.</Text>
    )
  } 

  constructor(props){
    super(props)

    this.state = {
      isLoading: true,
      isDetailDialogVisible: false,

      dialogTitle: 'undefined',
      dialogMessage: 'undefined',
      dialogCurrentItem: null,
      isRYouSureDialogVisible: false
    } 

    toggleDetailDialog = this.toggleDetailDialog.bind(this)
    toggleAreYouSureDialog = this.toggleAreYouSureDialog.bind(this)
  }

  killDialogs = () => {
    this.setState({ isDetailDialogVisible: false, isRYouSureDialogVisible: false });
  }

  toggleDetailDialog = (aula) => {
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

  toggleAreYouSureDialog = (item) => {
    if (item.aluno_ativo == 0 && item.vagas == 0)
      return

    if (item.aluno_ativo)
      this.setState({
        dialogTitle: 'DESMARCAR',
        dialogMessage: 'Tem certeza que deseja DESMARCAR esta aula?',
        dialogCurrentItem: item,
      })
    else
      this.setState({
        dialogTitle: 'AGENDAR',
        dialogMessage: 'Tem certeza que deseja AGENDAR esta aula?',
        dialogCurrentItem: item,
      })

    this.setState({ isRYouSureDialogVisible: !this.state.isRYouSureDialogVisible })
    //console.log('EXECUTED => @toggleAreYouSureDialog()')
  }

  _UpdateHorariosDisponiveis() {
    //console.log('RUNNING => @_UpdateHorariosDisponiveis()')

    //Separando datas disponíveis na global 'datasDisponiveis'
    globalState.horariosDisponiveis = globalState.aulasDisponiveis.filter((e) => e.data_aula == globalState.dataSelecionada)
    //console.log('UPDATED => @globalState.horariosDisponiveis.')

    this.setState({isLoading : false})
  }
    
    render () {
      if (this.state.isLoading == true) {
        //console.log('#=> Navigated to Horários.')
        globalState.navBar.navigation = this.props.navigation
        globalState.navBar.firstLink = {
          screen: 'Dias',
          icon: 'arrow-round-back',
          title: 'Voltar' 
        }
        globalState.navBar.secondLink.state = 0
        globalState.navBar.thirdLink.state = 1

        this._UpdateHorariosDisponiveis()

        return(
          <View style={styles.perfilContainer}>    

            <View style={styles.topHeader}>
              <Text style={styles.welcomeSubText}>{moment(globalState.dataSelecionada).format('dddd, DD [de] MMMM')}.</Text>
            </View>  

            <View style={styles.pageBodyOnLoading} >
              <ActivityIndicator size="large" color={commonStyles.colors.primary}/>
            </View>
          </View>
        )  
      }else{         
        return(
        <View style={styles.perfilContainer}>
          <View style={styles.topHeader}>
            <Text style={styles.welcomeSubText}>{moment(globalState.dataSelecionada).format('dddd, DD [de] MMMM')}.</Text>
          </View>  

          <View style={styles.pageBody}>
            <FlatList data={globalState.horariosDisponiveis}
            extraData={this.state}
            keyExtractor={item => `${item.id_aula}`}
            renderItem={({ item }) => <TouchableOpacity onPress={ () => this.toggleDetailDialog(item) }><HoraAula {...item}/></TouchableOpacity>}/>
          </View>

          <BottomNav {...globalState.navBar}/>

          <Dialog
            visible={this.state.isDetailDialogVisible}
            width={'90%'}
            height={'65%'}
            onTouchOutside={ () => {this.toggleDetailDialog()} }
            dialogTitle={<DialogTitle title={(<Text style={styles.status}>Detalhes da aula</Text>)}/>}
            actions={<DialogButton style={styles.info} text="OK"  onPress={() => { this.setState({ isDetailDialogVisible: false }) }}/>}
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

          <Dialog
              dialogTitle={<DialogTitle title={this.state.dialogTitle}/>}
              dialogStyle={styles.defaultDialog}
              visible={this.state.isRYouSureDialogVisible}
              onTouchOutside={ () => {this.killDialogs()} }
              actions={[
                <DialogButton text="SIM" style={styles.successBtn} onPress={ () => {this._handleUserRequest()}} textStyle={{color: commonStyles.colors.white}}/>,
                <DialogButton text="NÃO" style={styles.dangerBtn} onPress={ () => {this.killDialogs()}} textStyle={{color: commonStyles.colors.white}}/>
              ]}
              actionsBordered={false}
            >
            <DialogContent>
              <AulaInfo {...this.state.dialogCurrentItem}/>
              <Text style={styles.dialogTitle}>{this.state.dialogMessage}</Text>
            </DialogContent>
          </Dialog>
        </View>
        )
      }
    }

    _handleWebserviceResponse = (result) => {
      //console.log('RUNNING => @_handleWebserviceResponse()')
      if (result.registro_aula == 1)
      {
        //console.log('\nSUCESSO: ', result)
        const { navigate } = this.props.navigation;
        updateState(true)
        navigate('Welcome')
      }else{
        //console.log('\nERROR: ', result.status)
      }
    }

  _handleUserRequest = () => {
    //console.log('RUNNING => @_handleUserRequest()')
    this.killDialogs()

    let item = this.state.dialogCurrentItem

    changeAulaStatusTo(!item.aluno_ativo, item.id_aula, globalState.alunoInfo.id_aluno, this._handleWebserviceResponse)
  } 

};

async function changeAulaStatusTo( id, aula_id, aluno_id, callback ) {
  //console.log('RUNNING => @changeAulaStatusTo()')

  let result = await fetch('https://viaprime.sige.pro/app/aulas.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_aula: aula_id,
      id_aluno: aluno_id,
      acao: id
    })
  }).then((response) => {  
    return response.json()
  }).then((responseJson) => {
      callback(responseJson)
    })
    .catch((error) => {
      console.error(error)
  });
  
  return result
};  