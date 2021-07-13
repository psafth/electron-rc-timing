import React, { useContext, useEffect } from 'react';
import { DecoderStatus, MyLapsContext, TMylapsStore } from "../models/index";
import { useObserver } from "mobx-react-lite";
import Flash from './Flash';
import NoiseIndicator from './NoiseIndicator';

const StatusBar = () => {
    const mylapsStore = useContext<TMylapsStore>(MyLapsContext);

    useEffect(() => {
        console.debug("Status", mylapsStore.decoder.status)
    }, [mylapsStore.decoder, mylapsStore.statusMessages.length])

    return useObserver(() => (
        <div className="Statusbar">
            <div className="container" style={mylapsStore.decoder.status == DecoderStatus.Connected ? { visibility: "visible" } : { visibility: "hidden" }}>
                <div className="item">
                    <Flash duration={200} />
                </div>
                <div className="item">{`${mylapsStore.temperature} °C`}</div>
                <div className="item">{`${mylapsStore.voltage ? mylapsStore.voltage.toFixed(1) : ''}V`}</div>
                <div className="item">
                    <NoiseIndicator />
                </div>
            </div>
            <div className="container" style={mylapsStore.decoder.status == DecoderStatus.Disconnected ? { visibility: "visible" } : { visibility: "hidden" }}>
                <div className="item">Not connected</div>
            </div>
        </div>
    ));
}

export default StatusBar;