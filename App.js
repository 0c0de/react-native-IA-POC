
import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, PermissionsAndroid, ToastAndroid } from 'react-native';
import { NavigationBar, Screen, Title, Button, Icon, Text } from '@shoutem/ui';
import ImagePicker from 'react-native-image-picker';
import RNMlKit from 'react-native-firebase-mlkit';

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      detectedText: ''
    }
  }

  render() {

    /*const textDecodedFromImage = (
      <Text style={{color: '#ffffff', fontSize: 18}}>{this.state.textDecoded}</Text>
    );*/

    return (
      <Screen fullScreen style={{backgroundColor: '#3ab0ff', flex: 1, justifyContent: 'center', alignItems: 'center'}} >
        <StatusBar backgroundColor="#3ab0ffff" barStyle="light-content" animated />
        <NavigationBar styleName="clear" style={{paddingTop: 90}} hasStory centerComponent={<Title>Text Scanner</Title>} />
        <Button styleName="stacked clear" onPress={() => this.grabImage()}>
          <Icon name="take-a-photo" style={{fontSize:90, color:'#ffffff'}}/>
          <Text style={{color:'#ffffff', fontSize: 20, width: 500}}>SELECT AN IMAGE</Text>
        </Button>
        <Text style={{color:'#ffffff', fontSize: 20, width: 500}}>Text decoded:{this.state.detectedText}</Text>
      </Screen>
    );
  }

  grabImage(){
    const options = {
      title: "Select an image to scan",
      storageOptions:{
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if(response.error){
        ToastAndroid.showWithGravity(response.error, 20, ToastAndroid.BOTTOM);
      }else if(response.didCancel){
        ToastAndroid.showWithGravity("Opration canceled", 10, ToastAndroid.BOTTOM);
      }else{
        const uri = response.uri;
        const textDecoded = RNMlKit.deviceTextRecognition(uri).then((callback) => {
          this.setState({detectedText:callback[0].resultText});
          console.log(this.state.detectedText);
        }).catch((e) => {
          console.log(e);
        });
        console.log("Image loaded: " + response.type + "Image data: " + response.data);
        //this.setState({textDecoded: text});
        return;
      }
    });
  }
}

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Cool Photo App Camera Permission',
        'message': 'Cool Photo App needs access to your camera ' +
                   'so you can take awesome pictures.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
