import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker'; // Importing Picker

const { width } = Dimensions.get('window');
const BAR_WIDTH = width > 600 ? 20 : 10;
const MAX_BARS = Math.floor((width - 80) / (BAR_WIDTH + 2)); // Reduced to accommodate Y-axis
const GRAPH_HEIGHT = 300;
const AXIS_WIDTH = 40;

const AlgorithmVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(500);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('Bubble Sort');

  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: MAX_BARS }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsSorting(false);
    setIsStopped(false);
  }, []);

  const bubbleSort = (inputArray: number[]) => {
    let arr = [...inputArray];
    let stepsArray: number[][] = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
          stepsArray.push([...arr]); // Save the current step
        }
      }
    }
    setSteps(stepsArray); // Update steps with each step in sorting process
  };

  const startSorting = () => {
    switch (selectedAlgorithm) {
      case 'Bubble Sort':
        bubbleSort(array);
        break;
      // Add other algorithms here
    }
    setIsSorting(true);
    setIsStopped(false);
  };

  useEffect(() => {
    if (isSorting && !isStopped && currentStep < steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep((prev) => prev + 1), speed);
      return () => clearTimeout(timer);
    }
  }, [isSorting, isStopped, currentStep, steps, speed]);

  const stopSorting = () => {
    setIsStopped(true);
    setIsSorting(false);
  };

  const resetVisualization = () => {
    setIsSorting(false);
    setIsStopped(false);
    setCurrentStep(0);
    generateArray();
  };

  const renderYAxis = () => {
    const yAxisValues = [0, 25, 50, 75, 100];
    return (
      <View style={styles.yAxis}>
        {yAxisValues.map((value, index) => (
          <Text key={index} style={styles.axisLabel}>
            {value}
          </Text>
        ))}
      </View>
    );
  };

  const renderXAxis = () => {
    const xAxisValues = Array.from({ length: 5 }, (_, i) => Math.floor(i * (MAX_BARS / 4)));
    return (
      <View style={styles.xAxis}>
        {xAxisValues.map((value, index) => (
          <Text key={index} style={styles.axisLabel}>
            {value}
          </Text>
        ))}
      </View>
    );
  };

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bubble Sort Visualizer</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={generateArray}>
          <Text style={styles.buttonText}>New Array</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={startSorting} disabled={isSorting}>
          <Text style={styles.buttonText}>{isSorting ? 'Sorting...' : 'Start Sort'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          disabled={currentStep <= 0 || !isSorting}
        >
          <Text style={styles.buttonText}>Previous Step</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
          disabled={currentStep >= steps.length - 1 || !isSorting}
        >
          <Text style={styles.buttonText}>Next Step</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopSorting} disabled={!isSorting}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetVisualization}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <Picker
          selectedValue={selectedAlgorithm}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => handleAlgorithmChange(itemValue)}
        >
          <Picker.Item label="Bubble Sort" value="Bubble Sort" />
          <Picker.Item label="Insertion Sort" value="Insertion Sort" />
          {/* Add other sorting algorithms here */}
        </Picker>
      </View>
      <View style={styles.sliderContainer}>
        <Text>Speed: {Math.round(1000 - speed)}ms</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={900}
          value={1000 - speed}
          onValueChange={(value) => setSpeed(1000 - value)}
        />
      </View>
      <View style={styles.graphContainer}>
        {renderYAxis()}
        <View style={styles.visualizer}>
          {(steps[currentStep] || array).map((value, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                { height: (value / 100) * GRAPH_HEIGHT, backgroundColor: isSorting ? '#4CAF50' : '#2196F3' },
              ]}
            />
          ))}
        </View>
      </View>
      {renderXAxis()}
      <Text style={styles.axisTitle}>Array Index</Text>
      <Text style={[styles.axisTitle, styles.yAxisTitle]}>Value</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sliderContainer: {
    alignItems: 'stretch',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: GRAPH_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
  },
  visualizer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: GRAPH_HEIGHT,
  },
  bar: {
    width: BAR_WIDTH,
    marginHorizontal: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transitionProperty: 'height',  // This is for web; React Native animations may vary.
    transitionDuration: '200ms',
  },
  
  yAxis: {
    width: AXIS_WIDTH,
    height: GRAPH_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: AXIS_WIDTH,
    paddingTop: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  axisTitle: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  yAxisTitle: {
    position: 'absolute',
    left: -10,
    top: GRAPH_HEIGHT / 2,
    transform: [{ rotate: '-90deg' }],
  },
});

export default AlgorithmVisualizer;
