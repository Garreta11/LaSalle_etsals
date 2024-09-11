'use client';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import Image from 'next/image';
import styles from './canvas.module.scss';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { useData } from '@/app/DataContext';

// constellations variables
const nodeRadius = 16;
const horizontalSpacing = 8;
const verticalSpacing = 35;

// axes variables
const nodeAxesRadius = 15;
const horizontalAxesSpacing = 3;
const verticalAxesSpacing = 35;

const colors = ['#C6FF6A', '#FCFF6C', '#E18DFF', '#89F8FF'];

const Canvas = forwardRef(({ constellations, axes, external }, ref) => {
  const transformWrapperRef = useData();

  //Context
  const { activeConst, addToActiveConst } = useData();

  // Constellations
  const [constellationsNodes, setConstellationsNodes] = useState([]);
  const [constellationsLinks, setConstellationsLinks] = useState([]);

  // Axes
  const [axesNodes, setAxesNodes] = useState([]);
  const [axesLinks, setAxesLinks] = useState([]);

  // External Connections
  const [externalNodes, setExternalNodes] = useState([]);

  const attributesSvgRef = useRef(null);
  const axesSvgRef = useRef(null);

  // Dimensions
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Info
  const [clickTimeout, setClickTimeout] = useState(null);
  const [info, setInfo] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoDesc, setInfoDesc] = useState('');

  // Categories
  const [categories, setCategories] = useState([
    {
      name: 'trainingCycles',
      title: 'Training Cycles',
      posY: 0,
    },
    {
      name: 'firstCycle',
      title: '1srt Cycle',
      posY: 0,
    },
    {
      name: 'secondCycle',
      title: '2nd Cycle',
      posY: 0,
    },
    {
      name: 'master',
      title: 'Master',
      posY: 0,
    },
    {
      name: 'research',
      title: 'Research',
      posY: 0,
    },
  ]);
  // Define the category order
  const categoryOrder = {
    research: 0,
    master: 1,
    secondCycle: 2,
    firstCycle: 3,
    trainingCycles: 4,
  };

  // Dimensions - Event Resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial dimensions

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Constellations
  useEffect(() => {
    if (!constellations || constellations.length === 0) return;

    const startHeight = 100;

    const calculateNodeSizes = (node) => {
      if (!node.children || node.children.length === 0) {
        node.width = nodeRadius * 2;
        node.height = nodeRadius * 2;
      } else {
        node.children.forEach((child) => calculateNodeSizes(child));
        const totalWidth = node.children.reduce(
          (acc, child) => acc + child.width + horizontalSpacing,
          -horizontalSpacing
        );
        node.width = totalWidth;
        node.height =
          Math.max(...node.children.map((child) => child.height)) +
          verticalSpacing;
      }
    };

    const calculateNodePositions = (node, startX, depth) => {
      node.depth = depth;
      node.y = startHeight + depth * verticalSpacing;
      if (!node.children || node.children.length === 0) {
        node.x = startX;
      } else {
        let currentX = startX;
        node.children.forEach((child) => {
          calculateNodePositions(child, currentX, depth + 1);
          currentX += child.width + horizontalSpacing;
        });
        node.x =
          (node.children[0].x + node.children[node.children.length - 1].x) / 2;
      }
    };

    const createTree = (data) => {
      const root = { ...data };
      calculateNodeSizes(root);
      calculateNodePositions(root, (dimensions.width - root.width) / 2, 0);
      const nodes = [];
      const links = [];

      const traverse = (node) => {
        nodes.push(node);
        if (node.children) {
          node.children.forEach((child) => {
            links.push({ parent: node, child });
            traverse(child);
          });
        }
        node.color = 'black';
      };

      traverse(root);
      return { nodes, links };
    };

    // Assume `constellations` is an array, and we need to handle the first item
    const { nodes, links } = createTree(constellations[0]);
    const uniqueNodes = [...new Set(nodes)];
    const uniqueLinks = [...new Set(links)];
    setConstellationsNodes(uniqueNodes);
    setConstellationsLinks(uniqueLinks);
  }, [constellations, dimensions]);

  // Axes
  useEffect(() => {
    if (!axes || axes.length === 0) return;

    const calculateAxesNodeSizes = (node) => {
      if (!node.children || node.children.length === 0) {
        node.width = nodeAxesRadius * 2;
        node.height = nodeAxesRadius * 2;
      } else {
        node.children.forEach((child) => calculateAxesNodeSizes(child));
        const totalWidth = node.children.reduce(
          (acc, child) => acc + child.width + horizontalAxesSpacing,
          -horizontalAxesSpacing
        );
        node.width = totalWidth;
        node.height =
          Math.max(...node.children.map((child) => child.height)) +
          verticalAxesSpacing;
      }
    };

    const calculateAxesNodePositions = (node, startX, depth) => {
      node.depth = depth;
      // Sort children by category order before positioning
      if (node.children && node.children.length > 0) {
        node.children.sort(
          (a, b) => categoryOrder[b.category] - categoryOrder[a.category]
        );
      }

      // Calculate initial height
      const maxHeight = dimensions.height - 60;
      let calculatedY = maxHeight - depth * verticalAxesSpacing;

      node.y = calculatedY;

      if (!node.children || node.children.length === 0) {
        node.x = startX;
      } else {
        let currentX = startX;
        node.children.forEach((child) => {
          calculateAxesNodePositions(child, currentX, depth + 1);
          currentX += child.width + horizontalAxesSpacing;
        });
        node.x =
          (node.children[0].x + node.children[node.children.length - 1].x) / 2;
      }
    };

    const createAxesTree = (data) => {
      const root = { ...data };
      calculateAxesNodeSizes(root);
      calculateAxesNodePositions(root, (dimensions.width - root.width) / 2, 0);

      const nodes = [];
      const links = [];
      const parentMap = new Map(); // To track parents of nodes
      const nodeMap = new Map();
      const occupiedPositions = new Map(); // To track occupied positions

      const traverse = (node) => {
        let existingNode = nodeMap.get(node._id);

        if (!existingNode) {
          nodes.push(node);
          nodeMap.set(node._id, node);
          existingNode = node;
        }

        if (node.children) {
          node.children.forEach((child) => {
            let childNode = nodeMap.get(child._id);

            if (!childNode) {
              nodes.push(child);
              nodeMap.set(child._id, child);
              childNode = child;
            }

            links.push({ parent: existingNode, child: childNode });

            // Track parent nodes
            if (!parentMap.has(child._id)) {
              parentMap.set(child._id, []);
            }
            //parentMap.get(child._id).push(existingNode);
            const parentList = parentMap.get(child._id);
            if (!parentList.some((parent) => parent._id === existingNode._id)) {
              parentList.push(existingNode);
            }

            traverse(child);
          });
        }
        node.color = 'black';
      };

      traverse(root);

      // Update X position for nodes with multiple parents
      nodes.forEach((node) => {
        const parents = parentMap.get(node._id);
        if (parents && parents.length > 1) {
          const averageX =
            parents.reduce((acc, parent) => acc + parent.x, 0) / parents.length;
          node.x = averageX;
        }
      });
      // Adjust positions to prevent overlap
      nodes.forEach((node) => {
        const positionKey = `${node.x}-${node.y}`;

        // Mark the position as occupied
        occupiedPositions.set(`${node.x}-${node.y}`, node);
      });

      // Post-processing step to align child nodes with their parent if the parent has only one child
      nodes.forEach((node) => {
        if (node.children && node.children.length === 1) {
          const child = node.children[0];
          if (child) {
            child.x = node.x; // Align the child's x position with the parent's x position
          }
        }
      });

      return { nodes, links };
    };

    // Assume `axes` is an array, and we need to handle the first item
    const { nodes, links } = createAxesTree(axes[0]);

    const uniqueNodes = [...new Set(nodes)];
    const uniqueLinks = [...new Set(links)];

    console.log(links);
    console.log(uniqueLinks);

    setAxesNodes(uniqueNodes);
    setAxesLinks(uniqueLinks);

    // Move nodes with category "master" and "research" up one position Y
    uniqueNodes.forEach((node) => {
      if (node.category === 'master') {
        node.y -= verticalAxesSpacing; // Move the node up
      } else if (node.category === 'research') {
        node.y -= 3 * verticalAxesSpacing; // Move the node up
      }
    });

    // Find the minimum y position in the graph
    const minY = Math.min(...uniqueNodes.map((node) => node.y));
    // Align research nodes without children to the minimum y position
    uniqueNodes.forEach((node) => {
      if (
        node.category === 'research' &&
        (!node.children || node.children.length === 0)
      ) {
        node.y = minY;
      }
    });

    // Set position Y for category title
    const categoriesPosition = (nodes) => {
      const maxValuesByCategory = nodes.reduce((acc, item) => {
        const { category, y } = item;
        if (!acc[category]) {
          acc[category] = y;
        } else if (y < acc[category]) {
          acc[category] = y;
        }
        return acc;
      }, {});
      // Update categories with max posY values
      const updatedCategories = categories.map((category) => ({
        ...category,
        posY: maxValuesByCategory[category.name] || category.posY,
      }));
      // Set the updated categories state
      setCategories(updatedCategories);
    };
    categoriesPosition(uniqueNodes);
  }, [axes, dimensions]);

  // Create ALL External Connections
  useEffect(() => {
    // console.log(external);
    if (constellationsNodes.length <= 0 || axesNodes.length <= 0) return;
    const newExternalNodes = [...externalNodes];

    external.forEach((ext, i) => {
      // Find the item1 with the specific _id
      let item1 = constellationsNodes.find(
        (item) => item._id === ext.connection1._id
      );
      if (item1 === undefined)
        item1 = axesNodes.find((item) => item._id === ext.connection2._id);
      // Find the item2 with the specific _id
      let item2 = constellationsNodes.find(
        (item) => item._id === ext.connection2._id
      );
      if (item2 === undefined)
        item2 = axesNodes.find((item) => item._id === ext.connection2._id);

      let pos = item1.x < item2.x ? 100 : -100;

      const newExternal = {
        id1: item1._id,
        id2: item2._id,
        x1: item1.x,
        y1: item1.y + verticalSpacing / 2,
        x2: item2.x,
        y2: item2.y,
        // Optionally, add control points for the curve
        cx: (item1.x + item2.x) / 2, // Midpoint control point for curve
        // cy: item2.y + 50, // Adjust control point for curvature
        cy: (item1.y + item2.y) / 2 - pos, // Adjust control point for curvature
        show: false,
      };

      newExternalNodes.push(newExternal);
    });
    setExternalNodes(newExternalNodes);
  }, [constellationsNodes, axesNodes]);

  // Show Active External Connections
  useEffect(() => {
    let ids = [];
    activeConst.forEach((c, i) => {
      const allIds = extractIds(c);
      ids = ids.concat(allIds);
    });

    // Determine if `firstArray` is empty
    const shouldUpdateShow = ids.length > 0;

    // Iterate over the second array and update the `show` property based on the condition
    const updatedArray = externalNodes.map((item) => {
      if (shouldUpdateShow) {
        // If `ids` is not empty, set `show` to true if `id1` or `id2` matches any ID in `ids`
        return ids.includes(item.id1) || ids.includes(item.id2)
          ? { ...item, show: true }
          : { ...item, show: false };
      } else {
        // If `firstArray` is empty, set all `show` properties to false
        return { ...item, show: false };
      }
    });
    const uniqueArray = [...new Set(updatedArray)];
    setExternalNodes(uniqueArray);

    if (activeConst.length <= 0) {
      const updatedConstellationsItems = constellationsNodes.map((item) => ({
        ...item,
        color: 'black',
      }));
      const updatedAxesItems = axesNodes.map((item) => ({
        ...item,
        color: 'black',
      }));

      setConstellationsNodes(updatedConstellationsItems);
      setAxesNodes(updatedAxesItems);
    }
  }, [activeConst]);

  // Handle Click -- Add to Active Constellations
  const handleClick = (_node) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        console.log('Single click detected');
        // Handle single click logic here
        const item = {
          title: _node.title,
          _id: _node._id,
          children: _node.children,
        };

        const allIds = extractIds(item);

        const hasMatchingId = checkIds(allIds, externalNodes);
        if (hasMatchingId) addToActiveConst(item);

        changeColorNodes(item._id, allIds);

        setClickTimeout(null);
      }, 300); // Wait 300ms to see if another click comes in
      setClickTimeout(timeout);
    }
  };
  // Recursive function to extract all `_id`
  const extractIds = (item) => {
    let ids = [];

    if (item._id) {
      ids.push(item._id);
    }

    if (item.children && Array.isArray(item.children)) {
      item.children.forEach((child) => {
        ids = ids.concat(extractIds(child));
      });
    }

    return ids;
  };

  // Function to change color (black or lightgray) for each node
  const changeColorNodes = (selectedId, ids) => {
    let otherids = [selectedId];

    ids.forEach((id) => {
      otherids.push(id);
      externalNodes.forEach((en) => {
        if (id === en.id1) {
          otherids.push(en.id1);
          otherids.push(en.id2);
        } else if (id === en.id2) {
          otherids.push(en.id1);
          otherids.push(en.id2);
        }
      });
    });

    if (otherids.length <= 1) return;

    const uniqueArray = [...new Set(otherids)];

    const updatedConstellationsItems = constellationsNodes.map((item) => ({
      ...item,
      color: uniqueArray.includes(item._id) ? 'black' : 'lightgray',
    }));
    const updatedAxesItems = axesNodes.map((item) => ({
      ...item,
      color: uniqueArray.includes(item._id) ? 'black' : 'lightgray',
    }));

    setConstellationsNodes(updatedConstellationsItems);
    setAxesNodes(updatedAxesItems);
  };

  // Function to check if any id matches id1 or id2
  const checkIds = (ids, items) => {
    return items.some(
      (item) => ids.includes(item.id1) || ids.includes(item.id2)
    );
  };

  // Handle Double Click -- Show Information
  const handleDoubleClick = (_node) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    }
    console.log('Double click detected', _node);
    // Handle double click logic here
    setInfoTitle(_node.title);
    setInfoDesc(_node.description[0].children[0].text);
    setInfo(true);
  };

  const splitTextIntoLines = (text, maxWidth, maxLines) => {
    const words = text.split(' ');
    // If there's only one word, return it as the only line
    if (words.length === 1) {
      return [text];
    }
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;

      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }

      if (lines.length === maxLines - 1) {
        lines.push(
          currentLine + ' ' + words.slice(words.indexOf(word) + 1).join(' ')
        );
        return;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines.slice(0, maxLines);
  };

  return (
    <div className={styles.canvas}>
      <div ref={ref} className={styles.svg}>
        <TransformWrapper
          ref={transformWrapperRef}
          doubleClick={{ disabled: true }}
          className={styles.svg__wrapper}
        >
          <TransformComponent className={styles.svg__wrapper__component}>
            <svg
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              preserveAspectRatio='xMidYMid meet'
              width='100%'
              height='100%'
            >
              {/* === CONSTELLATIONS TREE === */}
              <g ref={attributesSvgRef}>
                {/* Render links */}
                {constellationsLinks.map((link, index) => (
                  <g key={`constellations-${index}`}>
                    <line
                      x1={link.parent.x}
                      y1={link.parent.y + verticalSpacing / 2}
                      x2={link.parent.x}
                      y2={
                        (link.parent.y + verticalSpacing / 2 + link.child.y) / 2
                      }
                      className={styles.svg__line}
                    />
                    <line
                      x1={link.parent.x}
                      y1={
                        (link.parent.y + verticalSpacing / 2 + link.child.y) / 2
                      }
                      x2={link.child.x}
                      y2={
                        (link.parent.y + verticalSpacing / 2 + link.child.y) / 2
                      }
                      className={styles.svg__line}
                    />
                    <line
                      x1={link.child.x}
                      y1={
                        (link.parent.y + verticalSpacing / 2 + link.child.y) / 2
                      }
                      x2={link.child.x}
                      y2={link.child.y}
                      className={styles.svg__line}
                    />
                  </g>
                ))}
                {/* Render nodes */}
                {constellationsNodes.map((node, index) => {
                  const isSelected = node.color === 'black';

                  const nodeHasExternalNodes = externalNodes.some(
                    (obj) => obj.id1 === node._id || obj.id2 === node._id
                  );

                  // Select a random color from the array
                  const randomColor = colors[Math.floor(index % colors.length)];

                  const textLines = splitTextIntoLines(node.title, 13, 3);
                  return (
                    <g key={index}>
                      <Node
                        node={node}
                        index={index}
                        textLines={textLines}
                        textColor={node.color}
                        bgColor={randomColor}
                        handleClick={handleClick}
                        handleDoubleClick={handleDoubleClick}
                      />
                    </g>
                  );
                })}
              </g>

              {/* === AXES TREE === */}
              <g ref={axesSvgRef}>
                {/* Categories */}
                <g className={styles.svg__categories}>
                  {categories.map((cat, index) => {
                    return (
                      <text
                        key={index}
                        data-category={cat.name}
                        x={20}
                        y={cat.posY}
                      >
                        {cat.title}
                      </text>
                    );
                  })}
                </g>
                {/* <g ref={svgRef}></g> */}
                {/* Render links */}
                {axesLinks.map((link, index) => (
                  <g key={`axes-${index}`}>
                    <line
                      x1={link.parent.x}
                      y1={link.parent.y + verticalAxesSpacing / 2 - 15}
                      x2={link.child.x}
                      y2={link.child.y + 30}
                      className={styles.svg__line}
                    />
                  </g>
                ))}
                {/* Render nodes */}
                {axesNodes.map((node, index) => {
                  // Select a random color from the array
                  const randomColor = colors[Math.floor(index % colors.length)];
                  const textLines = splitTextIntoLines(node.title, 10, 3); // Adjust maxWidth according to your needs
                  return (
                    <g
                      key={`axes-${index}`}
                      onClick={() => handleClick(node)}
                      onDoubleClick={() => handleDoubleClick(node)}
                    >
                      <Node
                        node={node}
                        index={index}
                        textLines={textLines}
                        bgColor={randomColor}
                        textColor={node.color}
                        handleClick={handleClick}
                        handleDoubleClick={handleDoubleClick}
                      />
                    </g>
                  );
                })}
              </g>

              {/* === EXTERNAL NODES === */}
              <g>
                {externalNodes.map(
                  (node, index) =>
                    node.show && (
                      <path
                        key={index}
                        className={styles.svg__externalnodes}
                        d={`M ${node.x1},${node.y1} Q ${node.cx},${node.cy} ${node.x2},${node.y2}`}
                        fill='transparent'
                        stroke='black'
                        strokeWidth='0.5'
                      />
                    )
                )}
              </g>
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {info && (
        <div className={styles.info}>
          <div className={styles.info__header}>
            <p>{infoTitle}</p>
            <Image
              className={styles.info__header__close}
              src='/close.svg'
              alt='close'
              width={12}
              height={12}
              onClick={() => setInfo(false)}
            />
          </div>
          <div className={styles.info__body}>{infoDesc}</div>
        </div>
      )}
    </div>
  );
});
// Set a display name for the component
Canvas.displayName = 'Canvas';
export default Canvas;

const Node = ({
  index,
  node,
  textLines,
  bgColor,
  textColor,
  handleClick,
  handleDoubleClick,
}) => {
  const [textSizes, setTextSizes] = useState([]);
  const updateTextSize = (i, size) => {
    setTextSizes((prevSizes) => {
      const newSizes = [...prevSizes];
      newSizes[i] = size;
      return newSizes;
    });
  };
  const maxTextWidth =
    textSizes.length > 0 ? Math.max(...textSizes.map((size) => size.width)) : 0;

  const textHeight = textSizes.length * 6;

  return (
    <g
      key={`constellations-${index}`}
      onClick={() => handleClick(node)}
      onDoubleClick={() => handleDoubleClick(node)}
    >
      {textLines.map((word, i) => {
        return (
          <TextNode
            key={i}
            i={i}
            text={word}
            textColor={textColor}
            x={node.x}
            y={node.y + (verticalSpacing / 4 + 7 * i)}
            styles={styles}
            updateTextSize={updateTextSize}
          />
        );
      })}
      <RectNode
        bgColor={bgColor}
        maxWidth={maxTextWidth}
        maxHeight={textHeight}
        x={node.x}
        y={node.y}
      />
    </g>
  );
};

const TextNode = ({ text, x, y, i, textColor, styles, updateTextSize }) => {
  const textRef = useRef(null);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setTextSize({ width: bbox.width, height: bbox.height });
      updateTextSize(i, { width: bbox.width, height: bbox.height });
    }
  }, [text]);
  return (
    <g>
      <text
        key={i}
        ref={textRef}
        x={x}
        y={y}
        textAnchor='middle'
        fill={textColor}
        aria-label={text}
        role='img'
        className={`${styles.svg__text}`}
      >
        {text}
      </text>
    </g>
  );
};

const RectNode = ({ bgColor, maxWidth, maxHeight, x, y }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <rect
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      width={maxWidth + 5} // Add some padding
      height={maxHeight + 5} // Adjust height based on your needs
      x={x - maxWidth / 2 - 2.5} // Adjust x position if needed
      y={y + maxHeight / 2 - 2.5} // Adjust y position
      fill={bgColor}
      style={{
        opacity: isHovered ? 0.5 : 0,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
      }}
    />
  );
};
