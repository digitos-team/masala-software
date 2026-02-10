import CommonModal from "../../../components/CommonModal";
import ProductForm from "./ProductForm";
import { addProduct, updateProduct } from "../../../api/admin/product.api";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductModal = ({ isOpen, onClose, product, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEdit = !!product;

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            if (isEdit) {
                await updateProduct(product._id || product.id, formData);
                toast.success("Product updated successfully");
            } else {
                await addProduct(formData);
                toast.success("Product created successfully");
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Product" : "Add New Product"}
        >
            <ProductForm
                initialData={product}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isLoading}
            />
        </CommonModal>
    );
};

export default ProductModal;
