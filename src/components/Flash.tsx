import React, { useContext, useEffect, useState } from 'react';
import { DecoderStatus, MyLapsContext, TMylapsStore } from "../models/index";
import { useObserver } from "mobx-react-lite";

interface IFlashProperties {
    duration: number
}

const Flash = (props: IFlashProperties) => {
    const mylapsStore = useContext<TMylapsStore>(MyLapsContext);

    var [active, setActive] = useState(false);

    useEffect(() => {

        setActive(true);
        let timer = setTimeout(() => setActive(false), props.duration);

        return () => {
            clearTimeout(timer);
        };
    }, [mylapsStore.statusMessages.length, mylapsStore.passingMessages.length])

    return useObserver(() => (
        <div>{active ? "●" : ""}</div>
    ));
}

export default Flash;