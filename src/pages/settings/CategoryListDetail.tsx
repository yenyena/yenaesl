import type { CategoryList } from '../../types';
import { CategoryItemRow } from './CategoryItemRow';
import { AddCategoryItemForm } from './AddCategoryItemForm';

interface CategoryListDetailProps {
  list: CategoryList;
}

export function CategoryListDetail({ list }: CategoryListDetailProps) {
  return (
    <div className="mt-3 pl-4 border-l-2 border-primary/30">
      {list.items.length === 0 ? (
        <p className="text-text-light text-sm">No items yet.</p>
      ) : (
        <div>
          {list.items.map((item) => (
            <CategoryItemRow key={item.id} listId={list.id} item={item} />
          ))}
        </div>
      )}
      <AddCategoryItemForm listId={list.id} />
    </div>
  );
}
