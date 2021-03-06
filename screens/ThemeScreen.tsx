import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { db } from '../src/config.jsx';
import { red100 } from 'react-native-paper/lib/typescript/src/styles/colors';

export default class HomeScreen extends Component {

constructor() {
  super();
  this.state = {
	title: "Pick a category",
    data: {},
    categories: []
  };

  this.handleQuestionChange = this.handleQuestionChange.bind(this);
  this.handleCategoryChange = this.handleCategoryChange.bind(this);
}

  handleQuestionChange (e) {
    this.setState({ question: e.nativeEvent.text });
  }

  handleCategoryChange (e) {
    this.setState({ category: e.nativeEvent.text });
  }

componentDidMount = async() => {
  await this.fetchData()
}

componentDidUpdate = () => {
  if(this.state.categories.length < 1 && this.state.data) this.setCategories()
}

setCategories = () => {
  const values = []
  for(let [key, value] of Object.entries(this.state.data)) {
    const item = value.category
    if ( values.indexOf(value.category) === -1 ) values.push(value.category)
  }

  this.setState({
    categories: values
  })
}


handlePress = async(value) => {
  const { navigation } = this.props;
  try {
    const response = await AsyncStorage.setItem('category', value)
    const category = await AsyncStorage.getItem('category')
    navigation.reset({
      index: 1,
      routes: [{ name: 'Game' }],
    });
    navigation.navigate("Game");
  } catch (error) {
    console.log(error)
  }
}

fetchData = async() => {
  const ref = db.ref('/questions')
  await ref.on('value', (snapshot) => { this.setState({
    data: snapshot.val()
  }) }, (err: string) => console.log(err))
}

render() {
  const { navigation } = this.props;
  const { categories} = this.state;
    return (
        <View>
        <Text style={styles.title}>
          {this.state.title}
        </Text>
          {categories.map((item, i) =><View key = {i}><Button
                icon="rocket"
                mode="contained"
                onPress={() => this.handlePress(item)}
                >
                    {item}
            </Button></View>)}
           
        </View>
    );
  }
}

const styles = StyleSheet.create({
    input: {
        marginTop: 20,
        width: 300,
        alignSelf: "center"
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		marginTop: 20
  }
});