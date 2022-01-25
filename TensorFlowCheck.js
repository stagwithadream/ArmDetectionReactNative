import React from 'react';
import { Text } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';



export default class TensorFlowCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: false,
        };
    }

    async componentDidMount() {
        // Wait for tf to be ready.
        await tf.ready();
        console.log("TF ready")
        // Signal to the app that tensorflow.js can now be used.
        this.setState({
            isTfReady: true,
        });
    }

    render() {
        return <Text>Tensorflow is configured and ready!</Text>;
    }
}
