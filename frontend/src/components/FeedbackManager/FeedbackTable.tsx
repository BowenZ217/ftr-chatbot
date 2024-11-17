import React, { FC, useCallback, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
} from "@nextui-org/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { EditIcon, EyeIcon } from "./Icons";

const columns = [
    { name: "Reply ID", uid: "ReplyID" },
    { name: "UserInput", uid: "UserInput" },
    { name: "Content", uid: "Content" },
    { name: "Feedback", uid: "Feedback" },
    { name: "Selected", uid: "Selected" },
];

interface Feedback {
    ReplyID: number;
    UserInput: string;
    Content: string;
    UserID: string;
    Feedback?: string;
    Selected: boolean;
}

interface FeedbackTableProps {
    data: Feedback[];
    onSelectedChange: (replyID: number, selected: boolean) => void;
    onContentChange?: (replyID: number, content: string) => void;
}

const FeedbackTable: FC<FeedbackTableProps> = ({ data, onSelectedChange, onContentChange }) => {
    const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewClose } =
        useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditClose } =
        useDisclosure();
    const [modalContent, setModalContent] = useState<string>("");
    const [currentReplyID, setCurrentReplyID] = useState<number | null>(null);
    
    const renderCell = React.useCallback(
        (item: Feedback, columnKey: keyof Feedback) => {
            switch (columnKey) {
                case "ReplyID":
                    return item.ReplyID;
                case "UserInput":
                    const isLongUserInput = item.UserInput.length > 30;
                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>{isLongUserInput ? `${item.UserInput.slice(0, 30)}...` : item.UserInput}</span>
                            {isLongUserInput && (
                                <Button
                                    isIconOnly
                                    color="primary"
                                    aria-label="View UserInput"
                                    onPress={() => {
                                        setModalContent(item.UserInput);
                                        onViewOpen();
                                    }}
                                    style={{ marginLeft: "auto" }}
                                >
                                    <EyeIcon />
                                </Button>
                            )}
                        </div>
                    );
                case "Content":
                    return (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <span>{item.Content.slice(0, 30)}...</span>
                            <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                                <Button
                                    isIconOnly
                                    color="primary"
                                    aria-label="View Content"
                                    onPress={() => {
                                        setModalContent(item.Content);
                                        onViewOpen();
                                    }}
                                >
                                    <EyeIcon />
                                </Button>
                                {onContentChange && (
                                    <Button
                                        isIconOnly
                                        color="secondary"
                                        aria-label="Edit Content"
                                        onPress={() => {
                                            setModalContent(item.Content);
                                            setCurrentReplyID(item.ReplyID);
                                            onEditOpen();
                                        }}
                                    >
                                        <EditIcon />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                case "Feedback":
                    const feedback = item.Feedback || "N/A";
                    const isLongFeedback = feedback.length > 30;
                    return (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span>
                                {isLongFeedback ? `${feedback.slice(0, 30)}...` : feedback}
                            </span>
                            {isLongFeedback && (
                            <Button
                                isIconOnly
                                color="primary"
                                aria-label="View Content"
                                onPress={() => {
                                    setModalContent(feedback);
                                    onViewOpen();
                                }}
                                style={{ marginLeft: "auto" }}
                            >
                                <EyeIcon />
                            </Button>
                            )}
                        </div>
                    );
                case "Selected":
                    return (
                        <Checkbox
                            isSelected={item.Selected}
                            onChange={(e) =>
                            onSelectedChange(item.ReplyID, e.target.checked)
                            }
                        />
                    );
                default:
                    return null;
            }
        },
        [onContentChange, onSelectedChange]
    );
  
    return (
        <>
        <Table
            aria-label="Feedback table with custom cells"
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
            </TableHeader>
            <TableBody items={data}>
                {(item) => (
                    <TableRow key={item.ReplyID}>
                    {(columnKey) => (
                        <TableCell>
                            {renderCell(item, columnKey as keyof Feedback)}
                        </TableCell>
                    )}
                    </TableRow>
                )}
            </TableBody>
        </Table>

        <Modal size="lg" isOpen={isViewOpen} onOpenChange={onViewClose} scrollBehavior={"inside"}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader>View Content</ModalHeader>
                    <ModalBody>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                        >
                            {modalContent}
                        </ReactMarkdown>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>

        <Modal size="lg" isOpen={isEditOpen} onOpenChange={onEditClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader>Edit Content</ModalHeader>
                    <ModalBody>
                        <Textarea
                            fullWidth
                            rows={10}
                            value={modalContent}
                            onChange={(e) => setModalContent(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onPress={() => {
                                if (currentReplyID !== null && onContentChange) {
                                onContentChange(currentReplyID, modalContent);
                                }
                                onClose();
                            }}
                        >
                        Save
                        </Button>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        </>
    );
};

export default FeedbackTable;
