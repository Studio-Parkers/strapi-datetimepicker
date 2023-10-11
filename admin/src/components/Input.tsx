import styled from "styled-components";
import {IconButton} from "@strapi/design-system";
import {ArrowLeft, ArrowRight} from "@strapi/icons";
import React, {useState, useRef, useEffect, MouseEvent} from "react";

// Types
import type {JSX} from "react";

// Components
import Slider from "./Slider";

const Container = styled.div`
    position: relative;
`;

const Label = styled.label`
    display: flex;
    color: #FFFFFF;
    font-weight: 600;
    line-height: 1.33;
    font-size: 0.75rem;
    margin-bottom: 4px;
    align-items: center;
    text-transform: capitalize;
`;

const DateTimePreview = styled.div`
    gap: 0.5rem;
    display: flex;
    align-items: center;
`;

const DateTimePreviewItem = styled.label`
    color: #FFFFFF;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #4A4A6A;
    padding: 0.65625rem 1rem 0.65625rem;
`;

const DateTimeModal = styled.div`
    top: 0px;
    left: 0px;
    z-index: 9;
    right: 0px;
    max-width: 400px;
    position: absolute;
    border-radius: 10px;
    background-color: #212134;
    border: 1px solid rgb(74, 74, 106);
    box-shadow: 1px 1px 10px rgba(3,3,5,0.35);
`;

const Row = styled.div`
    gap: 0.5rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: center;

    svg path {fill: #7B79FF}
    p
    {
        width: 80px;
        color: #FFFFFF;
        text-align: center;
    }
`;

const DateTable = styled.table`
    width: 100%;
    table-layout: fixed;

    th
    {
        color: #7B79FF;
        font-size: 14px;
    }

    tbody
    {
        td
        {
            text-align: center;

            button
            {
                width: 34px;
                border: none;
                outline: none;
                color: #FFFFFF;
                aspect-ratio: 1;
                cursor: pointer;
                background: none;

                &.active
                {
                    border-radius: 50%;
                    background-color: #7B79FF;

                    p {line-height: 1}
                }
            }
        }     
    }
`;

const TimeLabel = styled.p`
    color: #FFFFFF;
    font-size: 1.2rem;
    text-align: center;
`;

const SliderLabel = styled.label`
    color: #FFFFFF;
    display: block;
    margin-bottom: 0.5rem;
`;


const getWeekDays = (locale: string): string[]=>
{
    const baseDate = new Date(Date.UTC(2017, 0, 2));
    const weekDays: string[] = [];
    for(let i = 0; i < 7; i++)
    {       
        weekDays.push(baseDate.toLocaleDateString(locale, {weekday: "long"}));
        baseDate.setDate(baseDate.getDate() + 1);       
    }

    return weekDays;
}

export default ({name, attribute, onChange, value})=>
{
    const locale = attribute.options.locale;
    const dayNames = getWeekDays(locale);

    const ref = useRef<HTMLDivElement>(null);
    const [selectorActive, setSelectorActive] = useState<boolean>(false);

    const date = !!value ? new Date(value) : new Date();
    const formatedDate = date.toLocaleDateString(locale, {
        formatMatcher: "best fit"
    });

    const formatedTime = date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit"
    });

    const updateValue = (date: Date)=>
    {
        date.setSeconds(0, 0);
        onChange({
            target: {
                name: name,
                type: attribute.type,
                value: date.toISOString()
            }
        });
    };

    const onDateButtonClicked = (event: MouseEvent, newDate: number)=>
    {
        event?.preventDefault();
        const d = new Date(date);
        d.setDate(newDate);
        updateValue(d);
    };

    const renderRows = ()=>
    {
        let dayIndex = 1;
        const currentMonth = date.getMonth();
        const monthInfo = new Date(date.getFullYear(), currentMonth + 1, 0);
        const len = Math.ceil(monthInfo.getDate() / 6);

        const rows: JSX.Element[] = [];
        for(let i = 0; i < len; i++)
        {
            const columns: JSX.Element[] = [];
            for(let j = 0; j < 7; j++)
            {
                const d = new Date(monthInfo);
                d.setDate(dayIndex);

                let dayNameIndex = j + 1;
                if(dayNameIndex > dayNames.length - 1)
                    dayNameIndex = 0;
                
                const index = i * 7 + (j + 1);
                if(d.getMonth() !== currentMonth || d.getDay() !== dayNameIndex)
                    columns.push(<td key={`dtp-day-${index}`}></td>);
                else
                {
                    const currentDay = d.getDate();
                    const isActive = date.getDate() === currentDay && date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
                    columns.push(
                        <td key={`dtp-day-${index}`}>
                            <button onClick={(e: MouseEvent)=> onDateButtonClicked(e, currentDay)} className={isActive ? "active" : ""}>
                                <p>{currentDay}</p>
                            </button>
                        </td>
                    );
                    dayIndex++;
                }
            }

            rows.push(<tr key={`dtp-row-${i}`}>{columns}</tr>);
        }

        return rows;
    };

    /**
     * Update the date with the delta amount of years.
     * 
     * @param delta The delta to change the month with.
     */
    const changeMonth = (delta: number)=>
    {
        const tmp = new Date(date);
        const newMonthIndex = tmp.getMonth() + delta;

        const maxDays = new Date(tmp.getFullYear(), newMonthIndex + 1, 0).getDate();
        if(maxDays < tmp.getDate())
            tmp.setDate(1);

        tmp.setMonth(newMonthIndex);
        updateValue(tmp);
    };

    /**
     * Update the date with the delta amount of months.
     * 
     * @param delta The delta to change the year with.
     */
    const changeYear = (delta: number)=>
    {
        const tmp = new Date(date);
        tmp.setFullYear(tmp.getFullYear() + delta);
        updateValue(tmp);
    };
    
    const handleClickOutside = (event: PointerEvent) =>
    {
        if (ref.current && event.target && !ref.current.contains(event.target as Node))
            setSelectorActive(false);
    };

    const onMounted = ()=>
    {
        updateValue(date);
        document.addEventListener("pointerdown", handleClickOutside, true);
        return ()=> document.removeEventListener("pointerdown", handleClickOutside, true);
    };

    useEffect(onMounted, []);

    return (
        <Container ref={ref}>
            <div onClick={()=> setSelectorActive(true)}>
                <Label>{name}</Label>
                <DateTimePreview>
                        <DateTimePreviewItem>{formatedDate}</DateTimePreviewItem>
                        <DateTimePreviewItem>{formatedTime}</DateTimePreviewItem>
                </DateTimePreview>
            </div>

            {
                selectorActive &&
                <DateTimeModal>
                    <div style={{borderBottom: "1px solid #4A4A6A", paddingTop: "0.5rem"}}>
                        <Row>
                            <IconButton onClick={()=> changeYear(-1)} label="back" icon={<ArrowLeft />} />
                            <p>{date.toLocaleDateString(locale, {year: "numeric"})}</p>
                            <IconButton onClick={()=> changeYear(1)} label="forward" icon={<ArrowRight />} />
                        </Row>

                        <Row>
                            <IconButton onClick={()=> changeMonth(-1)} label="back" icon={<ArrowLeft />} />
                            <p>{date.toLocaleDateString(locale, {month: "long"})}</p>
                            <IconButton onClick={()=> changeMonth(1)} label="forward" icon={<ArrowRight />} />
                        </Row>
                    </div>

                    <div style={{padding: "0.75rem"}}>
                        <DateTable>
                            <thead>
                                <tr>
                                    {dayNames.map((day, i)=> <th key={`dtp-th-${i}`}>{day.substring(0, 3)}</th>)}
                                </tr>
                            </thead>

                            <tbody>
                                {renderRows()}
                            </tbody>
                        </DateTable>
                    </div>

                    <div style={{padding: "0.5rem"}}>
                        <TimeLabel>{date.getHours().toString().padStart(2, "0")}:{date.getMinutes().toString().padStart(2, "0")}</TimeLabel>
                        
                        <div>
                            <SliderLabel>hours</SliderLabel>
                            <Slider value={date.getHours() / attribute.options.hourInterval} min={0} max={Math.floor(23 / attribute.options.hourInterval)} onChange={(e: number)=>
                            {
                                const d = new Date(date);
                                d.setHours(Math.round(e) * attribute.options.hourInterval);
                                updateValue(d);
                            }} />
                        </div>

                        <div>
                            <SliderLabel>minutes</SliderLabel>
                            <Slider value={date.getMinutes() / attribute.options.minuteInterval} min={0} max={Math.floor(59 / attribute.options.minuteInterval)} onChange={(e: number)=>
                            {
                                const d = new Date(date);
                                d.setMinutes(Math.round(e) * attribute.options.minuteInterval);
                                updateValue(d);
                            }} />
                        </div>
                    </div>
                </DateTimeModal>
            }
        </Container>
    );
};