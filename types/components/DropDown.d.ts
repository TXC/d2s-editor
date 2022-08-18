import { ActionMeta, PropsValue, SingleValue } from 'react-select';
export declare type singleProperty = {
    value: string | number;
    label: string;
};
export declare type groupProperty = {
    label: string;
    options: singleProperty[];
};
declare type DropDropProps = {
    options: singleProperty[] | groupProperty[];
    value?: PropsValue<singleProperty>;
    onChange?: (newValue: SingleValue<singleProperty>, actionMeta: ActionMeta<singleProperty>) => void;
};
declare const DropDown: ({ options, value, onChange }: DropDropProps) => JSX.Element;
export default DropDown;
