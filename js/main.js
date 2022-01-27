"use strict";
import { recipes } from "./recipes.js";
// Element du DOM
const cardSection = document.querySelector(".data-box");
const ingredientHtml = document.querySelector(".list-ingredients");
const applianceHtml = document.querySelector(".list-appareil");
const ustensileHtml = document.querySelector(".list-ustensile");
const allTagsBtn = document.querySelectorAll(".btn-chevron");
const allTagsList = document.querySelectorAll(".list-box");
const tagsHtml = document.querySelector(".tags-icon-box");
const allInput = document.querySelectorAll(".dropdown");
const inputSearch = document.getElementById("inputSearch");

class App {
  searchData = [];
  tagsSelected = [];
  tagsResults = [];
  finalResult = [];
  constructor() {
    this.getData();
    this.getTags();
    this.searchMethod();
    // this.searchNative();
    this.tagsText();
    this.tagsFilter();
  }

  async getData() {
    try {
      this.renderArrays();
    } catch (err) {
      console.error(err.message);
    }
  }

  async getTags() {
    const ingredients = recipes.flatMap((el) => el.ingredients);
    const allIngredients = ingredients.map((el) => el.ingredient);
    const filterIngredients = [...new Set(allIngredients)];
    const filterIngredients2 = filterIngredients.filter(
      (item, index) => filterIngredients.indexOf(item) === index
    );
    let markerIngredient = "";
    filterIngredients2.forEach((el) => {
      markerIngredient += `<li>${el}</li>`;
    });
    ingredientHtml.innerHTML = markerIngredient;

    const appliance = [];
    recipes.forEach((el) => appliance.push(el.appliance));
    const filterAppliance = [...new Set(appliance)];

    let markerAppliance = "";
    filterAppliance.forEach((el) => {
      markerAppliance += `<li>${el}</li>`;
    });
    applianceHtml.innerHTML = markerAppliance;

    const ustensiles = recipes.flatMap((el) => el.ustensils);
    const filterUstensiles = [...new Set(ustensiles)];

    let markerUstensiles = "";
    filterUstensiles.forEach((el) => {
      markerUstensiles += `<li>${el}</li>`;
    });
    ustensileHtml.innerHTML = markerUstensiles;

    allTagsBtn.forEach((el) => {
      el.addEventListener("click", (e) => {
        const icon = e.target.closest(".dropdown").querySelector(".fas");
        const list = e.target.closest(".dropdown").querySelector("ul");

        if (list.style.display === "none") {
          list.style.display = "grid";
        } else {
          list.style.display = "none";
          icon.classList.replace("fa-chevron-down", "fa-chevron-up");
        }
      });
    });
  }

  searchNative() {
    const recipeLight = [];
    const recipeObj = (data) => {
      const obj = {
        id: data.id,
        name: data.name,
        ingredients: data.ingredients,
        description: data.description,
        time: data.time,
      };
      recipeLight.push(obj);
    };
    for (let i = 0; i < recipes.length; i++) {
      recipeObj(recipes[i]);
    }

    inputSearch.addEventListener("input", () => {
      const value = inputSearch.value.toLowerCase();

      if (value.length >= 3) {
        const titleArr = [];
        for (let i = 0; i < recipeLight.length; i++) {
          if (recipeLight[i].name.toLowerCase().includes(value)) {
            titleArr.push(recipeLight[i]);
          }
        }

        const descriptionArr = [];
        for (let i = 0; i < recipeLight.length; i++) {
          if (recipeLight[i].description.toLowerCase().includes(value)) {
            descriptionArr.push(recipeLight[i]);
          }
        }

        const ingredientArr = [];

        for (let i = 0; i < recipeLight.length; i++) {
          for (let j = 0; j < recipeLight[i].ingredients.length; j++) {
            if (
              recipeLight[i].ingredients[j].ingredient
                .toLowerCase()
                .includes(value)
            ) {
              ingredientArr.push(recipeLight[i]);
              break;
            }
          }
        }

        const allResults = titleArr.concat(descriptionArr, ingredientArr);
        const filteredResults = [...new Set(allResults)];
        this.searchData = filteredResults;

        if (value.length >= 3 && this.searchData.length === 0) {
          this.updateUi(
            undefined,
            `Aucune recette ne correspond à votre critère "${value}" vous pouvez chercher « tarte aux pommes », « poisson ».`
          );
          document.querySelector(".data-box").style.display = "block";
        } else {
          this.renderArrays();
        }
      } else {
        this.searchData = [];
        document.querySelector(".data-box").style.display = "grid";
        this.renderArrays();
      }
    });
  }

  searchMethod() {
    const recipeLight = recipes.map((el) => {
      return {
        id: el.id,
        name: el.name,
        ingredients: el.ingredients,
        description: el.description,
        time: el.time,
      };
    });

    inputSearch.addEventListener("input", () => {
      const value = inputSearch.value.toLowerCase();

      if (value.length >= 3) {
        const titleArr = recipeLight.filter((el) => {
          if (el.name.toLowerCase().includes(value)) return el;
        });

        const descriptionArr = recipeLight.filter((el) => {
          if (el.description.toLowerCase().includes(value)) return el;
        });

        const ingredientArr = recipeLight.filter((item) =>
          item.ingredients.find((el) => {
            if (el.ingredient.toLowerCase().includes(value)) {
              return item;
            }
          })
        );

        const allResults = titleArr.concat(descriptionArr, ingredientArr);
        const filteredResults = [...new Set(allResults)];

        this.searchData = filteredResults;

        if (value.length >= 3 && this.searchData.length === 0) {
          this.updateUi(
            undefined,
            `Aucune recette ne correspond à votre critère "${value}" vous pouvez chercher « tarte aux pommes », « poisson ».`
          );
          document.querySelector(".data-box").style.display = "block";
        } else {
          this.renderArrays();
        }
      } else {
        this.searchData = [];
        document.querySelector(".data-box").style.display = "grid";
        this.renderArrays();
      }
    });
  }

  updateUi(data, errorText, errorDisplay = false) {
    if (errorDisplay) {
      document.querySelector(".data-box").style.display = "block";
    } else {
      document.querySelector(".data-box").style.display = "grid";
    }

    if (this.tagsSelected.length === 0) {
      document
        .querySelector(".tags-icon-box")
        .querySelector("ul").style.display = "none";
    } else {
      document
        .querySelector(".tags-icon-box")
        .querySelector("ul").style.display = "flex";
    }
    let marker = "";
    if (data) {
      data.forEach((item) => {
        let list = "";
        `${item.ingredients.forEach((el) => {
          // console.log(el.ingredient);
          list += `<li><span>${el.ingredient ? el.ingredient : ""}</span>: ${
            el.quantity ? el.quantity : ""
          } ${el.unit ? el.unit : ""}</li>`;
        })}`;
        marker += `<div class="card">
          <div class="card-image"></div>
          <div class="card-text">
            <div class="menu-layout">
              <div class="menu">
                <p class="menu-title">${item.name}</p>
                <p class="menu-timer">
                  <i class="far fa-clock"></i>&nbsp;&nbsp;<span>${item.time}</span> min
                </p>
              </div>
              <div class="menu-info">
                <div class="liste-element">
                  <ul>
                  ${list}
                  </ul>
                </div>
                <div class="text-element">
                  <p>
                    ${item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      });
    } else {
      marker = `<p class="error-line">${errorText}</p>`;
    }

    cardSection.innerHTML = marker;
  }

  tagsFilter() {
    allTagsList.forEach((item) => {
      item.querySelectorAll("li").forEach((el) => {
        el.addEventListener("click", (e) => {
          const name = e.target.textContent.toLowerCase();
          const type = e.target.closest("ul");
          e.target.style.display = "none";
          const input = e.target.closest(".dropdown").querySelector("input");
          input.value = "";
          input.focus();

          if (type.classList.contains("list-ingredients")) {
            const info = `${name}-ingredients`;
            this.tagsSelected.push(info);
          } else if (type.classList.contains("list-appareil")) {
            const info = `${name}-appareil`;
            this.tagsSelected.push(info);
          } else if (type.classList.contains("list-ustensile")) {
            const info = `${name}-ustensile`;
            this.tagsSelected.push(info);
          }

          this.tagsSelected = [...new Set(this.tagsSelected)];

          let marker = "";
          let ingredientFilter = [];
          let appareilFilter = [];
          let ustensileFilter = [];

          this.tagsSelected.forEach((item) => {
            const data = item.split("-");
            marker += `<li class="${data[1]}">${
              data[0].charAt(0).toUpperCase() + data[0].slice(1)
            }<i class="far fa-times-circle"></i></li>`;

            if (data[1] === "ingredients") {
              recipes.forEach((item) => {
                item.ingredients.find((el) => {
                  if (el.ingredient.toLowerCase() === data[0]) {
                    ingredientFilter.push(item);
                  }
                });
              });
            } else if (data[1] === "appareil") {
              recipes.find((item) => {
                if (item.appliance.toLowerCase() === data[0]) {
                  appareilFilter.push(item);
                }
              });
            } else if (data[1] === "ustensile") {
              recipes.forEach((item) => {
                item.ustensils.find((el) => {
                  if (el.toLowerCase() === data[0]) {
                    ustensileFilter.push(item);
                  }
                });
              });
            }
          });

          tagsHtml.querySelector("ul").innerHTML = marker;
          this.finalRecipe(ingredientFilter, appareilFilter, ustensileFilter);
        });
      });
    });
  }

  tagsText() {
    allInput.forEach((item) => {
      item.querySelector("input").addEventListener("input", (e) => {
        const listeBox = e.target.closest(".dropdown").querySelector("ul");
        const liste = e.target
          .closest(".dropdown")
          .querySelector("ul")
          .querySelectorAll("li");
        const value = e.target.value.toLowerCase();

        if (value) {
          listeBox.style.display = "grid";
          liste.forEach((element) => {
            const target = element.textContent.toLowerCase();
            if (target.startsWith(value)) {
              element.style.display = "block";
            } else {
              element.style.display = "none";
            }
          });
          const test = Array.from(liste).every(
            (item) => item.style.display === "none"
          );

          if (test) {
            listeBox.style.display = "none";
          } else {
            listeBox.style.display = "grid";
          }
        } else {
          listeBox.style.display = "none";

          liste.forEach((element) => {
            const target = element.textContent.toLowerCase();
            element.style.display = "block";
          });
        }
      });
    });
  }

  renderArrays() {
    if (
      this.searchData.length === 0 &&
      this.tagsResults.length === 0 &&
      this.tagsSelected.length === 0
    ) {
      console.log("original");
      this.updateUi(recipes);
    }

    if (this.searchData.length > 0 && this.tagsResults.length === 0) {
      this.updateUi(this.searchData);
    }

    if (this.searchData.length === 0 && this.tagsResults.length > 0) {
      this.updateUi(this.tagsResults);
    }

    if (this.tagsSelected.length > 0) {
      const btnCloseTags = tagsHtml.querySelector("ul").querySelectorAll("i");
      btnCloseTags.forEach((item) => {
        item.addEventListener("click", (e) => {
          const name = e.target.closest("li").textContent.toLowerCase();
          const type = e.target.closest("li").classList[0];
          const listItem = e.target.closest("li");
          const target = `${name}-${type}`;

          this.tagsSelected = this.tagsSelected.filter((item) => {
            if (item !== target) return item;
          });
          console.log(this.tagsSelected);
          listItem.remove();
          const inputList = document
            .querySelector(`.list-${listItem.classList[0]}`)
            .querySelectorAll("li");
          console.log(inputList);

          inputList.forEach((item) => {
            if (
              item.style.display === "none" &&
              item.textContent.toLowerCase() ===
                listItem.textContent.toLowerCase()
            ) {
              console.log(item);
              console.log(item.style.display);
              item.style.display = "block";
            }
          });

          const ingredientFilter = [];
          const appareilFilter = [];
          const ustensileFilter = [];
          this.tagsSelected.forEach((item) => {
            const target = item.split("-");
            if (target[1] === "ingredients") {
              recipes.forEach((item) => {
                item.ingredients.find((el) => {
                  if (el.ingredient.toLowerCase() === target[0]) {
                    ingredientFilter.push(item);
                  }
                });
              });
            } else if (target[1] === "appareil") {
              recipes.find((item) => {
                if (item.appliance.toLowerCase() === target[0]) {
                  appareilFilter.push(item);
                }
              });
            } else if (target[1] === "ustensile") {
              recipes.forEach((item) => {
                item.ustensils.find((el) => {
                  if (el.toLowerCase() === target[0]) {
                    ustensileFilter.push(item);
                  }
                });
              });
            }
          });
          this.finalRecipe(ingredientFilter, appareilFilter, ustensileFilter);
        });
      });
    }

    if (
      (this.searchData.length === 0 &&
        this.tagsSelected.length > 0 &&
        this.tagsResults.length === 0) ||
      (this.searchData.length > 0 &&
        this.tagsSelected.length > 0 &&
        this.tagsResults.length === 0)
    ) {
      this.updateUi(
        undefined,
        "Aucune recette ne correspond à votre recherche",
        true
      );
    }

    const checkSimilar = (array1, array2) => {
      const res = [];
      array1.forEach((item) => {
        array2.find((el) => {
          if (item.id === el.id) res.push(item);
        });
      });
      this.finalResult = res;
    };

    if (
      this.searchData.length > 0 &&
      this.tagsSelected.length > 0 &&
      this.tagsResults.length > 0
    ) {
      checkSimilar(this.searchData, this.tagsResults);
      console.log(this.finalResult.length, Boolean(this.finalResult));

      if (this.finalResult.length === 0) {
        this.updateUi(
          undefined,
          "Aucune recette ne correspond à votre recherche",
          true
        );
      } else {
        this.updateUi(this.finalResult);
      }
    }
  }

  finalRecipe(array1, array2, array3) {
    const inglenght = [];
    const applenght = [];
    const ustlenght = [];

    this.tagsSelected.forEach((item) => {
      const target = item.split("-")[1];
      if (target === "ingredients") {
        inglenght.push("ingredients");
      } else if (target === "appareil") {
        applenght.push("appareil");
      } else if (target === "ustensile") {
        ustlenght.push("ustensile");
      }
    });

    const checkSubArray = (arr, length) => {
      let res = arr.filter((item) => {
        let res = arr.filter((el) => {
          if (item === el) return el;
        });

        if (res.length === length) {
          return item;
        }
      });
      return (res = [...new Set(res)]);
    };

    const allTagsFiltered = checkSubArray(array1, inglenght.length).concat(
      checkSubArray(array2, applenght.length),
      checkSubArray(array3, ustlenght.length)
    );

    const allArrLength = [
      Boolean(inglenght.length),
      Boolean(applenght.length),
      Boolean(ustlenght.length),
    ];

    const checkAllArray = (arr, arrLength) => {
      const length = arrLength.filter((item) => item === true).length;

      let res = arr.filter((item) => {
        let res = arr.filter((el) => {
          if (item === el) return el;
        });

        if (res.length === length) {
          return item;
        }
      });
      return (res = [...new Set(res)]);
    };

    this.tagsResults = checkAllArray(allTagsFiltered, allArrLength);
    this.renderArrays();
  }
}

const app = new App();
