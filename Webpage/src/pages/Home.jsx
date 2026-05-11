// src/pages/Home.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/headers";
import HeroBanner from "../components/HeroBanner";
import RecipeCard from "../components/RecipeCard";
import "../styles/home.css";

const BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (recipe) => {
  if (!recipe) return null;

  if (recipe.image && typeof recipe.image === "string") {
    if (recipe.image.startsWith("http")) return recipe.image;

    const path = recipe.image.startsWith("/")
      ? recipe.image
      : `/${recipe.image}`;

    return `${BASE_URL}${path}`;
  }

  if (recipe.image_key && recipe.image_key !== "...") {
    const fileName = recipe.image_key.includes(".")
      ? recipe.image_key
      : `${recipe.image_key}.png`;

    return `${BASE_URL}/media/images/${fileName}`;
  }

  return null;
};

export default function Home() {
  const { user } = useAuth();

  // =========================
  // STATES
  // =========================

  const [dbRecipes, setDbRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // FORM STATES
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // INPUT STATES
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Rice");
  const [newTime, setNewTime] = useState("");
  const [newRating, setNewRating] = useState(4);
  const [newImage, setNewImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);

  const [newIngredients, setNewIngredients] = useState([""]);

  const [newInstructions, setNewInstructions] = useState("");

  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // =========================
  // FETCH RECIPES
  // =========================

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/recipes/`, {
          headers: {
            Authorization: `Token ${user?.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Fetch failed");
        }

        const data = await res.json();

        setDbRecipes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user?.token]);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewName("");
    setNewDescription("");
    setNewCategory("Rice");
    setNewTime("");
    setNewRating(4);

    setNewImage(null);
    setImagePreview(null);

    setNewIngredients([""]);
    setNewInstructions("");

    setIsEditing(false);
    setEditId(null);

    setShowAddForm(false);

    setAddError("");
  };

  // =========================
  // EDIT RECIPE
  // =========================

  const handleEditClick = (recipe) => {
    setIsEditing(true);
    setShowAddForm(true);

    setEditId(recipe.id);

    setNewName(recipe.name);
    setNewDescription(recipe.description || "");
    setNewCategory(recipe.category);
    setNewTime(recipe.time);
    setNewRating(recipe.rating);

    setNewIngredients(recipe.ingredients || [""]);

    setNewInstructions(recipe.instructions || "");

    setImagePreview(getImageUrl(recipe));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // SAVE RECIPE
  // =========================

  const handleSaveRecipe = async (e) => {
    e.preventDefault();

    setAddLoading(true);
    setAddError("");

    try {
      const formData = new FormData();

      formData.append("name", newName);
      formData.append("description", newDescription);
      formData.append("category", newCategory);
      formData.append("time", newTime);

      formData.append(
        "rating",
        parseFloat(newRating)
      );

      formData.append(
        "instructions",
        newInstructions
      );

      formData.append(
        "ingredients",
        JSON.stringify(
          newIngredients.filter(
            (i) => i.trim() !== ""
          )
        )
      );

      if (newImage) {
        formData.append("image", newImage);
      }

      const url = isEditing
        ? `${BASE_URL}/api/recipes/${editId}/update/`
        : `${BASE_URL}/api/recipes/add/`;

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",

        headers: {
          Authorization: `Token ${user?.token}`,
        },

        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setAddError("Backend rejected request.");
        return;
      }

      if (isEditing) {
        setDbRecipes((prev) =>
          prev.map((r) =>
            r.id === editId ? data : r
          )
        );
      } else {
        setDbRecipes((prev) => [...prev, data]);
      }

      resetForm();

      alert(
        isEditing
          ? "Recipe Updated!"
          : "Recipe Added!"
      );
    } catch (err) {
      console.error(err);
      setAddError("Network Error.");
    } finally {
      setAddLoading(false);
    }
  };

  // =========================
  // DELETE RECIPE
  // =========================

  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete recipe?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/recipes/${id}/delete/`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Token ${user?.token}`,
          },
        }
      );

      if (res.ok) {
        setDbRecipes((prev) =>
          prev.filter((r) => r.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="main">
        Loading Recipes...
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar />

      <div className="main">

        {/* HEADER */}
        <Header />

        <div className="home-container">

          {/* HERO */}
          <HeroBanner />

          <section className="new-recipes">

            {/* SECTION HEADER */}
            <div className="section-header">

              <h3>
                {isEditing
                  ? "Editing Recipe"
                  : "Newly Added Recipes"}
              </h3>

              {isAdmin && (
                <button
                  className={
                    showAddForm
                      ? "cancel-btn"
                      : "add-btn"
                  }
                  onClick={() =>
                    showAddForm
                      ? resetForm()
                      : setShowAddForm(true)
                  }
                >
                  {showAddForm
                    ? "Cancel"
                    : "+ Add Recipe"}
                </button>
              )}
            </div>

            {/* =========================
                FORM
            ========================= */}

            {isAdmin && showAddForm && (
              <div className="admin-entry-container">

                <form
                  onSubmit={handleSaveRecipe}
                  className="admin-recipe-form"
                >

                  <h4 className="form-title">
                    {isEditing
                      ? "Update Recipe"
                      : "Add New Recipe"}
                  </h4>

                  {addError && (
                    <p className="form-error-msg">
                      {addError}
                    </p>
                  )}

                  {/* NAME */}
                  <div className="form-group">
                    <label>Recipe Name</label>

                    <input
                      className="admin-input"
                      placeholder="Recipe name..."
                      value={newName}
                      onChange={(e) =>
                        setNewName(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  {/* CATEGORY + TIME */}
                  <div className="admin-form-row">

                    <div className="form-group">
                      <label>Category</label>

                      <select
                        className="admin-input"
                        value={newCategory}
                        onChange={(e) =>
                          setNewCategory(
                            e.target.value
                          )
                        }
                      >
                        <option value="Rice">
                          Rice
                        </option>

                        <option value="Meat">
                          Meat
                        </option>

                        <option value="Vegetable">
                          Vegetable
                        </option>

                        <option value="Seafood">
                          Seafood
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cook Time</label>

                      <input
                        className="admin-input"
                        placeholder="30 mins"
                        value={newTime}
                        onChange={(e) =>
                          setNewTime(
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="form-group">
                    <label>Description</label>

                    <textarea
                      className="admin-input"
                      rows={3}
                      value={newDescription}
                      onChange={(e) =>
                        setNewDescription(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* INGREDIENTS */}
                  <div className="form-group">

                    <label>Ingredients</label>

                    <div className="admin-ingredients-list">

                      {newIngredients.map(
                        (ing, idx) => (
                          <div
                            key={idx}
                            className="admin-ing-row"
                          >

                            <input
                              className="admin-input"
                              value={ing}
                              placeholder={`Ingredient ${idx + 1}`}
                              onChange={(e) => {
                                const updated = [
                                  ...newIngredients,
                                ];

                                updated[idx] =
                                  e.target.value;

                                setNewIngredients(
                                  updated
                                );
                              }}
                            />

                            {idx ===
                              newIngredients.length - 1 && (
                              <button
                                type="button"
                                className="admin-add-ing-btn"
                                onClick={() =>
                                  setNewIngredients([
                                    ...newIngredients,
                                    "",
                                  ])
                                }
                              >
                                +
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* INSTRUCTIONS */}
                  <div className="form-group">
                    <label>Instructions</label>

                    <textarea
                      className="admin-input"
                      rows={5}
                      value={newInstructions}
                      onChange={(e) =>
                        setNewInstructions(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* IMAGE */}
                  <div className="form-group">
                    <label>Recipe Image</label>

                    <div className="admin-file-upload">

                      <input
                        type="file"
                        className="file-input"
                        onChange={(e) => {
                          setNewImage(
                            e.target.files[0]
                          );

                          setImagePreview(
                            URL.createObjectURL(
                              e.target.files[0]
                            )
                          );
                        }}
                      />

                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="admin-img-preview"
                        />
                      )}
                    </div>
                  </div>

                  {/* SAVE BUTTON */}
                  <button
                    type="submit"
                    className="admin-save-btn"
                    disabled={addLoading}
                  >
                    {addLoading
                      ? "Saving..."
                      : isEditing
                      ? "Update Recipe"
                      : "Save Recipe"}
                  </button>
                </form>
              </div>
            )}

            {/* =========================
                NEWLY ADDED RECIPES
            ========================= */}

            <div className="recipe-grid">

              {dbRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="recipe-card-relative"
                >

                  <div
                    onClick={() =>
                      setSelectedRecipe(recipe)
                    }
                  >
                    <RecipeCard
                      recipe={{
                        image:
                          getImageUrl(recipe),
                        title: recipe.name,
                      }}
                    />
                  </div>

                  {isAdmin && (
                    <div className="admin-mini-tools">

                      <button
                        className="admin-tool-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(recipe);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="admin-tool-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRecipe(recipe.id);
                        }}
                      >
                        🗑
                      </button>

                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* =========================
                CATEGORY SECTIONS
            ========================= */}

            {[
              "Rice",
              "Meat",
              "Vegetable",
              "Seafood",
            ].map((category) => {

              const filteredRecipes =
                dbRecipes.filter(
                  (recipe) =>
                    recipe.category === category
                );

              if (
                filteredRecipes.length === 0
              ) {
                return null;
              }

              return (
                <div
                  key={category}
                  className="category-section"
                >

                  <div className="category-header">
                    <h2>
                      {category} Recipes
                    </h2>

                    <div className="category-line"></div>
                  </div>

                  <div className="recipe-grid">

                    {filteredRecipes.map(
                      (recipe) => (
                        <div
                          key={recipe.id}
                          className="recipe-card-relative"
                        >

                          <div
                            onClick={() =>
                              setSelectedRecipe(
                                recipe
                              )
                            }
                          >
                            <RecipeCard
                              recipe={{
                                image:
                                  getImageUrl(
                                    recipe
                                  ),
                                title:
                                  recipe.name,
                              }}
                            />
                          </div>

                          {isAdmin && (
                            <div className="admin-mini-tools">

                              <button
                                className="admin-tool-btn"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  handleEditClick(
                                    recipe
                                  );
                                }}
                              >
                                ✏️
                              </button>

                              <button
                                className="admin-tool-btn delete"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  deleteRecipe(
                                    recipe.id
                                  );
                                }}
                              >
                                🗑
                              </button>

                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}