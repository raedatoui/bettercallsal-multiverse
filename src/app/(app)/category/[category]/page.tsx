import { ClientList } from '@/components/list';
import { buildSite, readSiteContent } from '@/lib/content';

export const generateStaticParams = async () => {
    const content = await readSiteContent(buildSite());
    const categories = new Set(content.map((i) => i.category).filter((c): c is string => !!c));
    return [...categories, 'all'].map((category) => ({ category }));
};

const CategoryPage = () => <ClientList visible />;

export default CategoryPage;
