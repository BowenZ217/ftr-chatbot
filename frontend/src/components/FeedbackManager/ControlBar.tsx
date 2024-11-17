"use client"
import { Select, SelectItem, Button, DateRangePicker } from "@nextui-org/react";
import { FC } from "react";
import styles from "./ControlBar.module.css";

/**
 * Known issue:
 * The DateRangePicker component does not work in next.js 15.
 * It throws an error when the user tries to select a date range.
 * 
 * The error is: "Invalid prop `ref` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props."
 * 
 * Refer: https://github.com/nextui-org/nextui/issues/3930
 */

interface DateRange {
    start: any;
    end: any;
}

interface ControlBarProps {
    onTypeChange: (type: string) => void;
    defaultDate: DateRange;
    onDateChange: (newDateRange: DateRange) => void;
    onSubmit: () => void;
}

const ControlBar: FC<ControlBarProps> = ({ onTypeChange, defaultDate, onDateChange, onSubmit }) => {
    return (
        <div className={styles.controlBar}>
            <div className={styles.leftControls}>
                <Select
                    label="Type"
                    placeholder="Select a type"
                    defaultSelectedKeys={["dislikes"]}
                    style={{ minWidth: "100px" }}
                    onSelectionChange={(keys) => onTypeChange(Array.from(keys)[0] as string)}
                >
                    <SelectItem key="likes">Likes</SelectItem>
                    <SelectItem key="dislikes">Dislikes</SelectItem>
                </Select>

                <DateRangePicker
                    label="Date Range"
                    value={defaultDate}
                    onChange={onDateChange}
                />
            </div>
            <Button className={styles.submitButton} onClick={onSubmit}>
                Submit
            </Button>
        </div>
    );
};

export default ControlBar;
