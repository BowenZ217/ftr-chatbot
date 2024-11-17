"use client"
import { useState, useEffect } from "react";
import { parseDate, getLocalTimeZone, now } from "@internationalized/date";
import ControlBar from "./ControlBar";
import FeedbackTable from "./FeedbackTable";
import PaginationBar from "./PaginationBar";
import styles from "./FeedbackManager.module.css";

interface Feedback {
    ReplyID: number;
    UserInput: string;
    Content: string;
    UserID: string;
    Feedback?: string;
    Selected: boolean;
}

const FeedbackManager = () => {
    const formatToISODate = (date: { year: number; month: number; day: number }) =>
      `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    const getCurrentMonthRange = () => {
        const today = now(getLocalTimeZone());
        const startOfMonth = today.set({ day: 1 });
        return {
            start: parseDate(formatToISODate(startOfMonth)),
            end: parseDate(formatToISODate(today)),
        };
    };
    const [feedbackType, setFeedbackType] = useState("dislikes");
    const [dateRange, setDateRange] = useState(getCurrentMonthRange());
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<Feedback[]>([]);
    const [maxPage, setMaxPage] = useState(1);

    useEffect(() => {
        if (currentPage === 1) {
            fetchData()
        } else {
            setCurrentPage(1);
        }
    }, [feedbackType, dateRange]);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const fetchData = async (page = currentPage) => {
        try {
            const startDate = dateRange.start ? formatToISODate(dateRange.start) : "";
            const endDate = dateRange.end ? formatToISODate(dateRange.end) : "";
            const url = `http://localhost:8080/api/chatbot_feedback/${feedbackType}?start_date=${startDate}&end_date=${endDate}&page=${page}`;
            console.log("Fetching data from", url);
            const response = await fetch(url);
            const result = await response.json();
            setData(result.data);
            setMaxPage(result.maxpage);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmit = async () => {
        await fetch("http://localhost:8080/api/chatbot_feedback/batch_update_selected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        fetchData(currentPage); // Refresh data after submission
    };

    const onSelectedChange = (id: number, selected: boolean) => {
        setData((prevData) =>
            prevData.map((item) => (item.ReplyID === id ? { ...item, Selected: selected } : item))
        );
    }
    const onContentChange = (id: number, content: string) => {
        setData((prevData) =>
            prevData.map((item) => (item.ReplyID === id ? { ...item, Content: content } : item))
        );
    }

    return (
        <div className={styles.feedbackManager}>
            <ControlBar
                onTypeChange={setFeedbackType}
                defaultDate={dateRange}
                onDateChange={setDateRange}
                onSubmit={handleSubmit}
            />
            <FeedbackTable
                data={data}
                onSelectedChange={onSelectedChange}
                onContentChange={onContentChange}
            />
            <PaginationBar
                currentPage={currentPage}
                maxPage={maxPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default FeedbackManager;
