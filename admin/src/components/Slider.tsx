import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 8px;
    user-select: none;
    border-radius: 4px;
    position: relative;
    margin-bottom: 1rem;
    background-color: #4A4A6A;

    .slider-foreground
    {
        top: 0px;
        left: 0px;
        height: 100%;
        border-radius: 4px;
        position: absolute;
        background-color: #7B79FF;
    }
    
    .slider-handle
    {
        top: 50%;
        width: 18px;
        height: 18px;
        cursor: pointer;
        position: absolute;
        border-radius: 50%;
        transform: translate3d(-50%, -50%, 0px);

        background-color: #7B79FF;
    }
`;

/**
 * @callback OnChangeCallback
 * @param {Number} value The new slider value.
 */

/**
 * Custom slider component.
 * 
 * @example
 * const [value, setValue] = React.useState(0);
 * <Slider value={value} onChange={setValue} min={1} max={100} />
 * 
 * @param [props] 
 * @returns {JSX.Element}
 */
const Slider = ({value, min = 0, max = 1, onChange}: {value: number, min: number, max: number, onChange: Function})=>
{
    const ref = React.useRef<HTMLDivElement>();

    /**
     * Is the user currently holding the slider handle.
     */
    const [isDown, setDown] = React.useState(false);
 
    /**
     * Callback when the slider handle is hold down.
     */
    const onPointerDown = ()=>
        setDown(true);

    /**
     * Callback when pointer is let go anywhere in the window.
     */
    const onPointerUp = ()=>
        setDown(false);

    /**
     * Callback when the window is touched.
     * Used to prevent touch devices to move the screen instead of the slider.
     * 
     * @param {TouchEvent} e 
     */
    const onTouchMove = e=>
        e.preventDefault();

    /**
     * Calculate the slider value at the pointer position and update the value.
     */
    const onPointerMove = (e: any)=>
    {
        if (!ref.current)
            return;

        if(((e as PointerEvent).pointerType === "mouse" || (e as PointerEvent).pointerType === "touch") && !isDown)
            return;

        e.preventDefault();
        
        const rects = ref.current.getClientRects();
        let offsetLeft: number;
        if(rects.length > 0)
            offsetLeft = rects.item(0)?.left ?? 0;
        else
            offsetLeft = ref.current.offsetLeft;
        
        const {clientWidth} = ref.current;
        const x = e.clientX;
        const delta = x - offsetLeft;
        let val = delta / clientWidth;

        if(val < 0)
            val = 0;
        else if(val > 1)
            val = 1;
        
        onChange(min + val * (max - min));
    };

    React.useEffect(()=>
    {
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("touchmove", onTouchMove, {passive: false});
        return ()=>
        {

            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("pointermove", onPointerMove);
        };
    });

    const percentage = `${(value - min) / (max - min) * 100}%`;
    return (
        <Container ref={ref} className="slider" onClick={onPointerMove}>
            <div className="slider-foreground" style={{width: percentage}} />
            <div className="slider-handle" onPointerDown={onPointerDown} style={{left: percentage}} />
        </Container>
    );
};

Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Slider;