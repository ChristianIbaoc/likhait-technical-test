/**
 * Form component for adding/editing expenses
 */

import React, { useState } from "react";
import { ExpenseFormData } from "../types";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([
    ...EXPENSE_CATEGORIES,
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const categoryOptions = dropdownOptions.map((category) => ({
    value: category,
    label: category,
  }));

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange("amount", e.target.value)}
        error={errors.amount}
        fullWidth
        required
      />

      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={errors.description}
        fullWidth
        required
      />
      <SelectBox
        label="Category"
        options={categoryOptions}
        value={formData.category}
        onChange={(e) => {
          if (e.target.value === "Add New Category") {
            setIsModalOpen(true);
          } else {
            handleChange("category", e.target.value);
          }
        }}
        error={errors.category}
        fullWidth
        required
      />
      <TextField
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange("date", e.target.value)}
        error={errors.date}
        fullWidth
        required
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
      >
        <TextField
          label="Category Name"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        ></TextField>
        <Button
          variant="primary"
          onClick={() => {
            console.log("New category added:", newCategory);
            if (newCategory.trim() !== "") {
              setDropdownOptions((prev) => {
                const listWithoutAddNew = prev.filter(
                  (c) => c !== "Add New Category",
                );
                return [...listWithoutAddNew, newCategory, "Add New Category"];
              });
              handleChange("category", newCategory);
              setIsModalOpen(false);
              setNewCategory("");
            }
          }}
        >
          Add Category
        </Button>
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
      </Modal>

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
