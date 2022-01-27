# BilalEzzaaraoui_7_03012022

${item.ingredients.forEach(
                      (el) =>
                        `<li><span>${el.ingredient}</span>: ${el.quantity} ${el.unit}</li>`
)}

item.ingredients.forEach((el) => {
// console.log(el.ingredient, el.quantity, el.unit);
// if (!el.ingredient) return "";
// if (!el.quantity) return "";
// if (!el.unit) return "";
// console.log(el);

                      `<li><span>${el.ingredient}</span>: </li>`;

                      // `<li><span>${el.ingredient ? el.ingredient : ""}</span>: ${
                      //   el.quantity ? el.quantity : ""
                      // } ${el.unit ? el.unit : ""}</li>`;
                    })

                  // ${item.ingredients.forEach((el) => console.log(el))}
