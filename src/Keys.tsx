import { useState } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const { initialData, sorting } = props;

    // Храним данные в состоянии, чтобы можно было сохранять изменения имён
    const [items, setItems] = useState<IItem[]>(initialData);

    // id редактируемого элемента (null — никто не редактируется)
    const [editingId, setEditingId] = useState<number | null>(null);

    // Черновик значения в инпуте (чтобы не терять ввод при пересортировке)
    const [draft, setDraft] = useState<string>('');

    // Сортировка по id согласно пропсу sorting.
    // Используем копию массива, чтобы не мутировать состояние.
    const sortedItems = [...items].sort((a, b) =>
        sorting === 'ASC' ? a.id - b.id : b.id - a.id,
    );

    const startEditing = (item: IItem) => {
        setEditingId(item.id);
        setDraft(item.name);
    };

    const commitEditing = () => {
        if (editingId === null) return;
        setItems((prev) =>
            prev.map((item) =>
                item.id === editingId ? { ...item, name: draft } : item,
            ),
        );
        setEditingId(null);
        setDraft('');
    };

    const cancelEditing = () => {
        setEditingId(null);
        setDraft('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            commitEditing();
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <div>
            {sortedItems.map((item) => (
                <div key={item.id}>
                    {editingId === item.id ? (
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    ) : (
                        <span onClick={() => startEditing(item)}>
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
