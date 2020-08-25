import React from 'react';
import { observer } from 'mobx-react'
import { AppStore } from '../models'

type StatusWindowProperties = {
    store: typeof AppStore
}

const StatusWindow: React.FunctionComponent<StatusWindowProperties> = observer((props) => {
    return <React.Fragment>{props.store.statuses.map(status =>(
    <div key={status.time.toUTCString()}>{status.temperature} °C | {status.noise} dB | {status.voltage}v</div>
    ))}</React.Fragment>
});

export default StatusWindow;