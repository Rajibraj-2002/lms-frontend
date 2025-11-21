// src/components/Clock.jsx
import React, { useState, useEffect } from 'react';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Update the time every second
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(timerId);
    }, []);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="clock-container">
            <div className="clock-time">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="clock-date">
                {time.toLocaleDateString(undefined, options)}
            </div>
        </div>
    );
};

export default Clock;