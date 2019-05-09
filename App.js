/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import waait from 'waait';

type Props = {};
const normalMS = 300;
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
      return Promise.resolve(false);
    },
    timer: () => { },
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

    let response = await firstItem();
    if (response)
      this.setState({ text: 'firstItem' })
    response = await secondItem();
    if (response)
      this.setState({ text: 'secondItem' })
    response = await thirdItem();
    if (response)
      this.setState({ text: 'thirdItem' })
  }

  handleTick = async () => {
    const { percent, text, intervalMS } = this.state;
    if (percent < 99 && text !== 'thirdItem' && intervalMS === normalMS) {
      this.setState(prevState => ({ percent: prevState.percent + 1 }))
    }
    else if (percent < 99 && text === 'thirdItem' && intervalMS !== minMS) {
      await this.handleSetInterval(minMS);
    }
    else if (percent < 99 && text === 'thirdItem' && intervalMS === minMS) {
      this.setState(prevState => ({ percent: prevState.percent + 1 }));
    }
    else if (percent === 99 && text === 'thirdItem') {
      await this.setState({ percent: 100, text: '..Completado..' });
      await this.handleClearInterval();
    }
  }

  handleSetInterval = (ms) => {
    const { timer: forClear } = this.state;
    const identifier = forClear;
    const timer = setInterval(this.handleTick, ms);
    this.setState(prevState => ({ timer, intervalMS: ms }), () => clearInterval(identifier)); // algo extraño pasa con esto
  }

  handleClearInterval = () => {
    const { timer } = this.state;
    clearInterval(timer);
  }

  render() {
    const { percent, text } = this.state;
    return (
      <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={this.init} title="Iniciar" />
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
        <Button onPress={() => this.setState({ text: 'thirdItem' })} title="Completar" />
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
