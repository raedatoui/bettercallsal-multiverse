import { ClientList } from '@/components/list';
import { readAllContent } from '@/lib/content';

export const generateStaticParams = async () => {
    // DOC: every site's categories, not just the build's — the left nav swaps with the hotkey.
    const content = await readAllContent();
    const categories = new Set(content.map((i) => i.category).filter((c): c is string => !!c));
    return [...categories, 'all'].map((category) => ({ category }));
};

const CategoryPage = () => <ClientList visible />;

export default CategoryPage;
