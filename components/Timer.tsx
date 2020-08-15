import React, { useState, useEffect } from 'react'

const Timer: React.FunctionComponent = () => {

    function msToTime(s) {

        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
          z = z || 2;
          return ('00' + n).slice(-z);
        }
      
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;
      
        return pad(hrs, 2) + ':' + pad(mins, 2) + ':' + pad(secs, 2) + '.' + pad(ms, 3);
      }

    const [time, setTime] = useState<number>();

    useEffect(() => {
        const startTime = new Date();

        setInterval(() => {
            const currentTime = new Date();
            const span = (currentTime.getTime() - startTime.getTime());
            setTime(span)
        }, 100);
    }, [])

    return <React.Fragment>{msToTime(time)}</React.Fragment>
}

export default Timer;