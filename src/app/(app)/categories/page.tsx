import { CategoriesClient } from "./CategoriesClient";

export default function CategoriesPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <CategoriesClient />
        </div>
    );
}
