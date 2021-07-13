import React, { useContext } from 'react';
import { MyLapsContext, TMylapsStore } from "../models/index";
import { useObserver } from "mobx-react-lite";

const NoiseIndicator = () => {
    const mylapsStore = useContext<TMylapsStore>(MyLapsContext);

    const getColorState = (value: number): string => {
        if (value < 40)
            return "low";
        else if (value >= 40 && value < 60)
            return "medium";
        else
            return "high";
    }

    return useObserver(() => (
        <div className="noiseIndicator" title={`Noise: ${mylapsStore.noise}dB`}>
            <div className={`bar ${getColorState(mylapsStore.noise ? mylapsStore.noise : 0)}`} style={{ width: `${mylapsStore.noise}%` }}></div>
        </div>
    ));
}

export default NoiseIndicator;