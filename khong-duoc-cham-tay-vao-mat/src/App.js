import React, { useEffect, useRef } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import '@tensorflow/tfjs-backend-cpu';
// import { Howl } from 'howler';
import './App.css';
// import soundURL from './assets/hey_sondn.mp3';

// var sound = new Howl({
//   src: [soundURL]
// });
// sound.play();

const NOT_TOUCH_LABEL = 'not_touch';
const TOUCHED_LABEL = 'touched';
const TRAINING_TIMES = 50;

function App() {
  const video = useRef();
  const classifier = useRef();
  const mobilenetModule = useRef();

  const init = async () => {
    console.log('init...');
    await setupCamera();
    alert('Hello Bùi Tiến Hòa wellcome here')
    classifier.current = knnClassifier.create();
    mobilenetModule.current = await mobilenet.load();
    console.log('setup done');
    console.log('Không chạm tay lên mặt và bấm Train 1');

  }

  const setupCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
          navigator.getUserMedia(
            { video: true },
            stream => {
              video.current.srcObject = stream;
              video.current.addEventListener('loadeddata', resolve);
            },
            error => reject(error)
          );
        } else {
          reject();
        }
    });
  }

  const train = async label => {
    console.log(`[${label}] Đang trin cho máy mặt đẹp trai của bạn...`);
    for (let i = 0; i < TRAINING_TIMES; ++i) {
      console.log(`Progress ${parseInt((i+1) / TRAINING_TIMES * 100)}%`);

      await training(label);
    }
  }
  
  const training = label => {
    return new Promise((async resolve => {
      const embedding = mobilenetModule.current.infer(
        video.current,
        true
      );
      classifier.current.addExample(embedding, label);
      await sleep(100);
      resolve();
    });
  }
  const sleep = (ms = 0) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


  useEffect(() => {
    init();
    return () => {

    }

  }, []);

  return (
    <div className="main">
      <h1 className="html"><b>Don't touch your face</b></h1>
      <video
        ref={video}
        className="video"
        autoPlay
      />
    <div className="control">
      <button className="btn" onClick={() => train(NOT_TOUCH_LABEL)}>Train 1</button>
      <button className="btn" onClick={() => train(TOUCHED_LABEL)}>Train 2</button>
      <button className="btn" onClick={() => {}}>Run</button>
    </div>
    </div>
  );
}

export default App;
