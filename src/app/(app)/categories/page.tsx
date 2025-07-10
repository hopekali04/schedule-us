import { CategoriesClient } from "./CategoriesClient";

export default function CategoriesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <CategoriesClient />
        </div>
    );
}
