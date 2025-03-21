import { useState } from "react";
import PropTypes from "prop-types";
import Star from "./Star";

const containerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px"
}
const starContainerStyle = {
  display: "flex",
  // gap: "4px"
}


function StarRating({
  maxNum = 5, 
  color = "#dd5837", 
  size = 30, 
  className = '', 
  messages=[],
  defaultRating = 0,
  onSetRating = () => {},
  readOnly = false
}) {

  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempR] = useState(0);

  function handleRating(rating) {
    if(readOnly) return;
      setRating(rating);
      onSetRating(rating);
  }
  
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    sizeSize: `${size / 1.5}`
}
    return (
        <div style={containerStyle} className={className}>
            <div style={starContainerStyle}>
            {Array.from({ length: maxNum }, (_, i) => {
          const fullStars = Math.floor(tempRating || rating);
          const hasHalfStar = (tempRating || rating) % 1 !== 0 && i === fullStars;
          
          return (
            <Star
              key={i}
              onRate={() => handleRating(i + 1)}
              full={i < fullStars}
              half={hasHalfStar}
              onHoverIn={() => !readOnly && setTempR(i + 1)}
              onHoverOut={() => !readOnly && setTempR(0)}
              color={color}
              size={size}
            />
          );
        })}
            </div>
            <p style={textStyle}>{messages.length === maxNum
             ? messages[ tempRating ? tempRating - 1 : rating - 1]
              : tempRating || rating || ""}</p>
        </div>
    )

    
}

export default StarRating;


StarRating.propTypes = { // It helps us what kind of data we are expecting.
    maxNum: PropTypes.number,
    defaultRating: PropTypes.number,
    size: PropTypes.number,
    color: PropTypes.string,
    messages: PropTypes.array,
    className: PropTypes.string,
    onSetRating: PropTypes.func,
    readOnly: PropTypes.bool
  }

