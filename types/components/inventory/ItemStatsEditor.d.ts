import { types } from '@dschu012/d2s';
declare type updateStats = (data: types.IMagicProperty[]) => void;
declare type ItemStatsEditorProps = {
    itemStats: types.IMagicProperty[];
    id: string;
    updateStats: updateStats;
};
declare const ItemStatsEditor: ({ itemStats, id, updateStats }: ItemStatsEditorProps) => JSX.Element;
export default ItemStatsEditor;
