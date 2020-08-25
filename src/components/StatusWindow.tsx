import React, { useContext } from 'react';
import { MyLapsContext, TMylapsStore } from "../models/index";
import { useObserver } from "mobx-react-lite";

// const StatusWindow: React.FunctionComponent = observer((props) => {
//     return <React.Fragment>{props.store.statuses.map(status =>(
//     <div key={status.time.toUTCString()}>{status.temperature} °C | {status.noise} dB | {status.voltage}v</div>
//     ))}</React.Fragment>
// });

const StatusWindow = () => {
    const mylapsStore = useContext<TMylapsStore>(MyLapsContext);

    return useObserver(() => (
        <>
            {mylapsStore.statusMessages.map(status => (
                <div key={status.time.toUTCString()}>{status.temperature} °C | {status.noise} dB | {status.voltage}v</div>
            ))}
        </>
    ));
}

export default StatusWindow;