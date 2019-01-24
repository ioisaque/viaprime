import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';

import moment from 'moment'
import 'moment/locale/pt-br'

import styles from '../../assets/styles/otherStyles';
import { globalState } from '../../App';

export default props => {
    
    getActionText = (s, v) => {
        if(s)
          return 'Desmarcar'
        else if (s == 0 && v > 0)
          return 'Agendar'
        else
          return 'Indisponível'
    }

    getStatusText = (s, v) => {
        if(s)
            return 'Agendada'
        else if (s == 0 && v > 0)
            return 'Disponível'
        else
            return 'Lotada'
    }

    getBtnColor = (s, v) => {
        if(s)
            return styles.desmarcarBtn
        else if (s == 0 && v > 0)
            return styles.agendarBtn
        else
            return styles.disabledBtn
    }    

    if (globalState.alunoInfo.registro_aula)
        return (
            <View>
                <View style={styles.componente}>
                    <View style={styles.horaio}>
                        <Text style={styles.modalidade}>{props.modalidade}</Text>
                        <Text style={styles.info}>Horário: {moment(props.data_aula + ' ' + props.hora_aula).format('HH:mm')}</Text>
                        <Text style={styles.prof}>Professor: {props.professor}</Text>
                        <Text style={styles.info}>Vagas: {props.vagas}</Text>
                    </View>
                    <View>
                        <Text style={styles.status}>{this.getStatusText(props.aluno_ativo, props.vagas)}</Text>
                        <View style={styles.componente}>
                            <TouchableOpacity onPress={() => toggleAreYouSureDialog(props)} style={getBtnColor(props.aluno_ativo, props.vagas)}>
                                <Text style={styles.btnTxt}>{this.getActionText(props.aluno_ativo, props.vagas)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.linha}></View>
            </View>
        )
    else
        return (
            <View>
                <View style={styles.componente}>
                    <View style={styles.horaio}>
                        <Text style={styles.modalidade}>{props.modalidade}</Text>
                    </View>
                    <View style={styles.horaio}>
                        <Text style={styles.info}>Horário: {moment(props.data_aula + ' ' + props.hora_aula).format('HH:mm')}</Text>
                    </View>
                    <View style={styles.horaio}>
                        <Text style={styles.info}>Vagas: {props.vagas}</Text>
                    </View>
                </View>
                <View style={styles.linha}></View>
            </View>
        )
}