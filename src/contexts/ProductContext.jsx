import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

function ProductProvider({ children }) {

    // dummmy products to test
      const [products] = useState([
        {
          id: 1,
          name: "Classic White Sneakers",
          image: "https://picsum.photos/400/400?random=1",
          price: "$99.99",
          category: "Footwear",
        },
        {
          id: 2,
          name: "Leather Backpack",
          image: "https://picsum.photos/400/400?random=2",
          price: "$129.99",
          category: "Accessories",
        },
        {
          id: 3,
          name: "Denim Jacket",
          image: "https://picsum.photos/400/400?random=3",
          price: "$89.99",
          category: "Outerwear",
        },
        {
          id: 4,
          name: "Cotton T-Shirt",
          image: "https://picsum.photos/400/400?random=4",
          price: "$29.99",
          category: "Tops",
        },
        {
          id: 5,
          name: "Slim Fit Jeans",
          image: "https://picsum.photos/400/400?random=5",
          price: "$79.99",
          category: "Bottoms",
        },
        {
          id: 6,
          name: "Sports Watch",
          image: "https://picsum.photos/400/400?random=6",
          price: "$199.99",
          category: "Accessories",
        },
        {
          id: 7,
          name: "Running Shoes",
          image: "https://picsum.photos/400/400?random=7",
          price: "$119.99",
          category: "Footwear",
        },
        {
          id: 8,
          name: "Wool Sweater",
          image: "https://picsum.photos/400/400?random=8",
          price: "$69.99",
          category: "Tops",
        },
      ]);
      

    return (
        <ProductContext.Provider value={{
            products,
        }}>
            {children}
        </ProductContext.Provider>
    )
}

function useProduct() {
    const context = useContext(ProductContext);
    if(context == undefined) throw new Error("Undefined");
    return context;
}

export { ProductProvider, useProduct }