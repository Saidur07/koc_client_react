import React, { useState, useRef, useEffect } from "react";

const Description = ({
  description,
  maxLines = 5,
  maxWords = 80,
  className,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionRef = useRef(null);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (descriptionRef.current && window.getComputedStyle) {
      const computedStyle = window.getComputedStyle(descriptionRef.current);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 1; // Default to 1 if lineHeight is not available
      const maxHeight = parseFloat(computedStyle.maxHeight) || 0; // Default to 0 if maxHeight is not available

      const newLineCount =
        maxHeight > 0 ? Math.floor(maxHeight / lineHeight) : 0; // Avoid division by zero
      setLineCount(newLineCount);
    } else {
      console.log(
        "Error: descriptionRef.current is not set or getComputedStyle is not supported."
      );
    }
  }, [description, maxLines]);

  const toggleDescription = (e) => {
    setShowFullDescription(!showFullDescription);
    e.stopPropagation();
  };

  const renderDescription = () => {
    const lines = description?.split("\n");
    if (!showFullDescription && lines?.length > maxLines) {
      return (
        <>
          {lines?.slice(0, maxLines)?.join("\n")}..
          <span
            className="text-primary underline cursor-pointer hover:no-underline mx-1"
            onClick={toggleDescription}
          >
            {"See More"}
          </span>
        </>
      );
    } else if (showFullDescription && lineCount < maxLines && lineCount !== 0) {
      // If description is within maximum lines or full description is shown
      return (
        <>
          {description}
          {showFullDescription && (
            <span
              className="text-primary underline cursor-pointer hover:no-underline mx-1"
              onClick={toggleDescription}
            >
              {"See Less"}
            </span>
          )}
        </>
      );
    } else if (
      lineCount === 0 &&
      description.split(/\s+/).length > maxWords &&
      !showFullDescription
    ) {
      console.log("firsts");
      // If description exceeds maximum lines and full description is not shown
      const truncatedDescription = description
        .split(" ")
        .slice(0, maxWords)
        .join(" ");

      return (
        <>
          {truncatedDescription}...
          <span
            className="text-primary underline cursor-pointer hover:no-underline mx-1"
            onClick={toggleDescription}
          >
            {"See More"}
          </span>
        </>
      );
    } else {
      // If description is within maximum lines or full description is shown
      return (
        <>
          {description}
          {showFullDescription && (
            <span
              className="text-primary underline cursor-pointer hover:no-underline mx-1"
              onClick={toggleDescription}
            >
              {"See Less"}
            </span>
          )}
        </>
      );
    }
  };

  return (
    <p className={`${className} break-all`} ref={descriptionRef}>
      {renderDescription()}
    </p>
  );
};

export default Description;
