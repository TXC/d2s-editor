import { Variant } from 'react-bootstrap/types';
export declare type addNotification = (data: notificationType) => void;
export declare type removeNotification = (idx: number) => void;
export declare type notificationType = {
    alert: Variant;
    message: string;
};
declare type MessageViewerProps = {
    messages: notificationType[];
    removeMessage: removeNotification;
};
declare const MessageViewer: ({ messages, removeMessage }: MessageViewerProps) => JSX.Element;
export default MessageViewer;
