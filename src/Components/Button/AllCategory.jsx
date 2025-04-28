import "./AllCategory.css"
import { Link } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react"
import { categories } from "../../config/categories";
import { useState } from "react";

export default function AllCategory() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div id="menu-dropdown">
      <Link to='/allproducts'><div id="menu-title">All Categories</div></Link>
      <div className="menu-dropdown-content">
        <Box display="flex" gap="50px" pt={5} padding="20px">
          {Object.entries(categories).map(([key, category]) => (
            <div 
              key={key} 
              style={{ fontFamily: "sans-serif", paddingLeft: "20px" }}
              onMouseEnter={() => setHoveredCategory(key)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link to={`/category/${key}`}>
                <Text
                  style={{
                    paddingTop: "10px",
                    textAlign: "left",
                    borderTop: "1px solid gray",
                    fontWeight: "medium",
                    marginBottom: "10px",
                    cursor: "pointer",
                    color: hoveredCategory === key ? "blue.500" : "inherit"
                  }}
                >
                  {category.name}
                </Text>
              </Link>
              {hoveredCategory === key && (
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    position: "absolute",
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    zIndex: 1000
                  }}
                >
                  {category.subcategories.map((subcategory) => (
                    <Link 
                      key={subcategory.value} 
                      to={`/category/${key}/${subcategory.value}`}
                    >
                      <Text 
                        fontSize="sm" 
                        _hover={{ color: "blue.500" }}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {subcategory.label}
                      </Text>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Box>
      </div>
    </div>
  );
}

  