import { types, SnapshotIn, onSnapshot } from 'mobx-state-tree'

export const Passing = types.model({
    time: types.Date,
    transponderId: types.number,
    signalStrength: types.maybeNull(types.number),
    hits: types.maybeNull(types.number),
    voltage: types.maybeNull(types.number),
    temperature:  types.maybeNull(types.number)
});

export const Status = types.model({
    time: types.Date,
    decoderId: types.string,
    noise: types.number,
    voltage: types.number,
    temperature: types.number
})

export const App = types.model({
    decoderStatus: types.enumeration(["NOT_CONNECTED", "CONNECTED"]),
    passings: types.array(Passing),
    statuses: types.array(Status)
})
    .actions(app => ({
        addPassing(passing: SnapshotIn<typeof Passing>) {
            app.passings.push(passing);
        },
        addStatus(status: SnapshotIn<typeof Status>) {
            app.statuses.push(status);
        },
        setConnected(){
            app.decoderStatus = "CONNECTED";
        },
        setDisconnected(){
            app.decoderStatus = "NOT_CONNECTED"
        }
    }))

export const AppStore = App.create({
    passings: [],
    statuses: [],
    decoderStatus: "NOT_CONNECTED"
})

onSnapshot(AppStore, snapshot => {
    console.debug("Snapshot updated:", snapshot)
})