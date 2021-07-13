import React, { createContext } from "react";
import { useLocalStore } from "mobx-react-lite";

export enum DecoderStatus {
    Disconnected,
    Connected
}

export type StatusMessage = {
    time: Date,
    decoderId: string
    noise: number
    voltage: number,
    temperature: number
}
export type PassingMessage = {
    rtcTime: Date,
    utcTime: Date,
    transponderId: number,
    signalStrength: number,
    hits: number,
    voltage: number,
    temperature: number
}

export type TMylapsStore = {
    decoder: {
        id: string,
        status: DecoderStatus
    },
    statusMessages: StatusMessage[],
    passingMessages: PassingMessage[],
    addStatus(msg: StatusMessage): void,
    addPassing(msg: PassingMessage): void,
    totalPassings: number | undefined,
    noise: number | undefined,
    temperature: number | undefined,
    voltage: number | undefined
}

export const MyLapsProvider = ({ children }) => {
    const mylapsStore: TMylapsStore = useLocalStore<TMylapsStore>(() => ({
        decoder: {
            id: '',
            status: DecoderStatus.Disconnected,
        },
        statusMessages: [] as StatusMessage[],
        passingMessages: [] as PassingMessage[],
        addStatus(msg: StatusMessage) {
            mylapsStore.statusMessages.push(msg);
        },
        addPassing(msg: PassingMessage) {
            mylapsStore.passingMessages.push(msg);
        },
        get totalPassings() {
            return mylapsStore?.passingMessages?.length;
        },
        get noise() {
            return mylapsStore.statusMessages.length > 0 ? mylapsStore.statusMessages[mylapsStore.statusMessages.length - 1].noise : undefined;
        },
        get temperature() {
            return mylapsStore.statusMessages.length > 0 ? mylapsStore.statusMessages[mylapsStore.statusMessages.length - 1].temperature : undefined;
        },
        get voltage() {
            return mylapsStore.statusMessages.length > 0 ? mylapsStore.statusMessages[mylapsStore.statusMessages.length - 1].voltage : undefined;
        }
    }));

    return <MyLapsContext.Provider value={mylapsStore}>{children}</MyLapsContext.Provider>;
};
export const MyLapsContext = createContext({} as TMylapsStore);



// import { types, SnapshotIn, onSnapshot } from 'mobx-state-tree'

// export const Passing = types.model({
//     time: types.Date,
//     transponderId: types.number,
//     signalStrength: types.maybeNull(types.number),
//     hits: types.maybeNull(types.number),
//     voltage: types.maybeNull(types.number),
//     temperature: types.maybeNull(types.number)
// });

// export const Status = types.model({
//     time: types.Date,
//     decoderId: types.string,
//     noise: types.number,
//     voltage: types.number,
//     temperature: types.number
// })

// export const App = types.model({
//     decoderStatus: types.enumeration(["NOT_CONNECTED", "CONNECTED"]),
//     passings: types.array(Passing),
//     statuses: types.array(Status)
// })
//     .actions(app => ({
//         addPassing(passing: SnapshotIn<typeof Passing>) {
//             app.passings.push(passing);
//         },
//         addStatus(status: SnapshotIn<typeof Status>) {
//             app.statuses.push(status);
//         },
//         setConnected() {
//             app.decoderStatus = "CONNECTED";
//         },
//         setDisconnected() {
//             app.decoderStatus = "NOT_CONNECTED"
//         }
//     }))

// export const AppStore = App.create({
//     passings: [],
//     statuses: [],
//     decoderStatus: "NOT_CONNECTED"
// })

// onSnapshot(AppStore, snapshot => {
//     console.debug("Snapshot updated:", snapshot)
// })