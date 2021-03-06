import React, { Component } from 'react'
import { Picker, Alert, View, Button } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Moment from 'moment'
import { FormLabel, FormInput } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'

import styles from './UsersList.style.js'

@observer
export default class UserView extends Component {
  @observable editing = false
  @observable email = ''
  @observable password = ''
  @observable role = ''

  constructor (props) {
    super(props)

    this.userService = props.app.service('users')

    if (props.user) {
      this.editing = true
      this.email = props.user.email
      if (props.user.roles) {
        this.role = props.user.roles[0]
      }
    }
  }

  add () {
    this.userService.create({
      email: this.email,
      password: this.password,
      roles: [this.role]
    }).then((res) => {
      Actions.pop()
    })
  }

  save () {
    this.userService.patch(this.props.user._id, {
      email: this.email,
      roles: [this.role]
    }).then((res) => {
      Actions.pop()
    })
  }

  delete () {
    Alert.alert(
      'Delete this user',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => {
          this.userService.remove(this.props.user._id)
            .then((res) => {
              Actions.pop()
            })
        }},
        {text: 'Cancel', onPress: () => {}, style: 'cancel'}
      ]
    )
  }

  render () {
    let dateText = Moment(this.date).format('DD/MM/YY')
    let timeText = Moment(this.date).format('HH:mm')

    return (
      <View style={styles.container}>
        <FormLabel>Role</FormLabel>
        <Picker
          selectedValue={this.role}
          onValueChange={(t) => { this.role = t }}>
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Manager" value="manager" />
          <Picker.Item label="User" value="user" />
        </Picker>

        <FormLabel>Email</FormLabel>
        <FormInput value={this.email}
          onChangeText={(t) => { this.email = t }} />

        { this.editing ? this.renderEditButtons() : this.renderAddButton()}

      </View>
    )
  }

  renderAddButton () {
    return (
      <View>
        <FormLabel>Password</FormLabel>
        <FormInput value={this.password}
          secureTextEntry
          onChangeText={(t) => { this.password = t }} />

        <Button title='Add'
          onPress={() => this.add()} />
      </View>
    )
  }

  renderEditButtons () {
    return (
      <View>
        <Button title='Save'
          onPress={() => this.save()} />
        <Button title='Delete'
          color='red'
          onPress={() => this.delete()} />
      </View>
    )
  }
}
