import React from 'react'

const BlurCircle = ({ top, right, bottom, left, size = '400px', opacity = '0.3' }) => {
    const style = {
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(248, 69, 101, 0.2) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        opacity: opacity,
        ...(top && { top: top }),
        ...(right && { right: right }),
        ...(bottom && { bottom: bottom }),
        ...(left && { left: left }),
    }

    return <div style={style} className="blur-circle-element" />
}

export default BlurCircle