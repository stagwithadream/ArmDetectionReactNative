import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as posenet from '@tensorflow-models/posenet';


const TensorCamera = cameraWithTensors(Camera);

const initialiseTensorflow = async () => {
  await tf.ready();
  tf.getBackend();
  console.log("tf is ready")
}

const textureDims = Platform.OS === 'ios' ?
{
  height: 1920,
  width: 1080,
} :
{
  height: 1200,
  width: 1600,
};



export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [net, setNet] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      await initialiseTensorflow();
            // load the model
            console.log(" initialiseTensorflow ");
      setNet(await posenet.load());

      console.log(" loaded tf ");

    })();
  }, []);



  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>

    <TensorCamera

        style={styles.camera}
        type={Camera.Constants.Type.back}
        onReady={() => {const handleCameraStream =(images) => {
            console.log("hi");
              const loop = async () => {
                 if(net) {
                    const nextImageTensor = images.next().value;
                   if(nextImageTensor) {
                      const objects = await net.estimateSinglePose(nextImageTensor);
                      console.log(objects);
                      console.log("helo");
                     tf.dispose([nextImageTensor]);
                   }
                 }
                  requestAnimationFrame(loop);
              }
              loop();
          }}}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        autorender={true}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
     />

    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
