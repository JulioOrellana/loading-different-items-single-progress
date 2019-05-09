/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, SafeAreaView} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'
import waait from 'waait';

type Props = {};
const normalMS = 500;
const minMS = 10;

export default class App extends Component<Props> {
  state = {
    percent: 0,
    firstItem: async () => {
      await waait(3000);
      return Promise.resolve(true);
    },
    secondItem: async () => {
      await waait(2000);
      return Promise.resolve(true);
    },
    thirdItem: async () => {
      await waait(4000);
      return Promise.resolve(true);
    },
    timer: () => {},
    text: 'noItem',
    intervalMS: normalMS,
  }

  init = async () => {
    const { intervalMS } = this.state;
    this.setState({ percent: 0 });
    await this.handleSetInterval(intervalMS);
    await this.initItems();
  }

  initItems = async () => {
    const { firstItem, secondItem, thirdItem } = this.state;
    
    await firstItem();
    this.setState({ text: 'firstItem'})
    await secondItem();
    this.setState({ text: 'secondItem'})
    await thirdItem();
    this.setState({ text: 'thirdItem'})
  }

  handleTick = () => {
    const { percent, text, intervalMS } = this.state;
    if(percent < 100 && text !== 'thirdItem'){
      this.setState(prevState => ({ percent: prevState.percent + 1 }))
    }
    else if(percent < 100 && text === 'thirdItem' && intervalMS !== minMS){
      // this.handleClearInterval();
      this.handleSetInterval(minMS);
    }
    else if(percent < 100 && text === 'thirdItem' && intervalMS === minMS){
      this.setState(prevState => ({ percent: prevState.percent + 1 }));
    }
    else if(percent === 100 && text === 'thirdItem'){
      this.handleClearInterval();
      this.setState({ text: '..Completado..'});
    }
  }

  handleSetInterval = (ms) => {
    const { timer: forClear } = this.state;
    const identifier = forClear;
    const timer = setInterval(this.handleTick, ms);
    this.setState({ timer, text: '' }, () => clearInterval(identifier)); // algo extraño pasa con esto
  }

  handleClearInterval = () => {
    const { timer } = this.state;
    clearInterval(timer);
  }

  render() {
    const { percent, text } = this.state;
    return (
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center'}}>
        <Button onPress={this.init} title="Iniciar"/>
        <ProgressCircle
              percent={percent}
              radius={150}
              borderWidth={8}
              color="#3399FF"
              shadowColor="#999"
              bgColor="#fff"
          >
            <Text style={{ fontSize: 18 }}>{percent}%</Text>
        </ProgressCircle>
        <Text style={{ marginTop: 20, color: 'black' }}>{text}</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
