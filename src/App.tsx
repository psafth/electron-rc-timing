import React from 'react';
import ReactDom from 'react-dom';
import { Provider, observer } from 'mobx-react';
import { AppStore } from "../models"
import 'mobx-react-lite/batchingForReactDom'
import StatusWindow from '../components/StatusWindow';
import Timer from '../components/Timer';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const { ipcRenderer, session } = window.require("electron");

const App = observer(() => {



    ipcRenderer.on('amb-status', (event, msg) => {
        AppStore.addStatus({
            time: new Date(),
            decoderId: msg.decoderId ?? "",
            noise: msg.noiseLevel,
            temperature: msg.temperature,
            voltage: msg.inputVoltage
        })
    });

    ipcRenderer.on('amb-connected', (event, msg) => {
        AppStore.setConnected();
    })

    ipcRenderer.on('amb-disconnected', (event, msg) => {
        AppStore.setDisconnected();
    })

    ipcRenderer.on('amb-passing', (event, msg) => {
/*
      decoderId: msg.decoderId,
      passingTimeRTC: msg.passingTimeRTC ? msg.passingTimeRTC.getTime() : undefined,
      passingTimeUTC: msg.passingTimeUTC ? msg.passingTimeUTC.getTime() : undefined,
      signalHits: msg.signalHits,
      signalStrength: msg.signalStrength,
      transponderId: msg.transponderId,
      transponderTemperature: msg.transponderTemperature,
      transponderVoltage: msg.transponderVoltage
*/

        AppStore.addPassing({
            hits: msg.signalHits,
            signalStrength: msg.signalStrength,
            temperature: msg.transponderTemperature,
            time: msg.passingTimeRTC,
            transponderId: msg.transponderId,
            voltage: msg.transponderVoltage
        })
    })


    return (
        <Provider store={AppStore}>
            <h1>
                <Timer />
            </h1>
            <StatusWindow store={AppStore} />
        </Provider>
    )
});

ReactDom.render(<App />, mainElement);