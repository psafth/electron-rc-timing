import React, { useContext } from 'react';
import ReactDom from 'react-dom';
import { useObserver } from "mobx-react-lite";
import { MyLapsProvider, MyLapsContext, TMylapsStore, DecoderStatus } from "./models"
import 'mobx-react-lite/batchingForReactDom'
import StatusWindow from './components/StatusWindow';
import Timer from './components/Timer';
import StatusBar from './components/StatusBar';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const { ipcRenderer } = window.require("electron");

const App = () => {
    const mylapsStore = useContext<TMylapsStore>(MyLapsContext);

    ipcRenderer.on('amb-status', (event, msg) => {
        mylapsStore.addStatus({
            time: new Date(),
            decoderId: msg.decoderId ?? "",
            noise: msg.noiseLevel,
            temperature: msg.temperature,
            voltage: msg.inputVoltage
        })
    });

    ipcRenderer.on('amb-connected', (event, msg) => {
        console.debug("Connected, app");
        mylapsStore.decoder.status = DecoderStatus.Connected;
    })


    ipcRenderer.on('amb-disconnected', (event, msg) => {
        console.debug("Disconnected, app");
        mylapsStore.decoder.status = DecoderStatus.Disconnected;
    })


    ipcRenderer.on('amb-passing', (event, msg) => {
        mylapsStore.addPassing({
            hits: msg.signalHits,
            signalStrength: msg.signalStrength,
            temperature: msg.transponderTemperature,
            rtcTime: msg.passingTimeRTC,
            utcTime: msg.passingTimeUTC,
            transponderId: msg.transponderId,
            voltage: msg.transponderVoltage
        })
    })


    return useObserver(() => (
        <>
            <StatusBar />

            <h1>
                <Timer />
            </h1>

            <StatusWindow />

        </>
    ));
}

ReactDom.render(<MyLapsProvider><App /></MyLapsProvider>, mainElement);