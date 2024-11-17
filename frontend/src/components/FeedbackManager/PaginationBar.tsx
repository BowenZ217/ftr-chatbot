import { FC } from "react";
import { Pagination } from "@nextui-org/react";
import styles from "./PaginationBar.module.css";

interface PaginationBarProps {
    currentPage: number;
    maxPage: number;
    onPageChange: (page: number) => void;
}

const PaginationBar: FC<PaginationBarProps> = ({ currentPage, maxPage, onPageChange }) => {
    return (
        <div className={styles.paginationBarContainer}>
            <Pagination
                total={maxPage}
                initialPage={currentPage}
                onChange={(page) => onPageChange(page)}
            />
        </div>
    );
};

export default PaginationBar;
