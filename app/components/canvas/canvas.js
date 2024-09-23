'use client';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import Image from 'next/image';
import styles from './canvas.module.scss';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { useData } from '@/app/DataContext';
import { PortableText } from '@portabletext/react';

const colors = ['#C6FF6A', '#FCFF6C', '#E18DFF', '#89F8FF'];

const Canvas = forwardRef(({ constellations, axes, external, about }, ref) => {
  const { transformWrapperRef } = useData();

  //Context
  const {
    activeConst,
    addToActiveConst,
    resetActiveConst,
    activeFilters,
    editScaleZoom,
    showExperience,
    editShowExperience,
  } = useData();

  // Constellations
  const [constellationsNodes, setConstellationsNodes] = useState([]);
  const [constellationsLinks, setConstellationsLinks] = useState([]);

  // Axes
  const [axesNodes, setAxesNodes] = useState([]);
  const [axesLinks, setAxesLinks] = useState([]);

  // External Connections
  const [externalNodes, setExternalNodes] = useState([]);

  // Constellations Variables
  const [nodeTextSize, setNodeTextSize] = useState(5);
  const [nodeRadius, setNodeRadius] = useState(16);
  const [horizontalSpacing, setHorizontalSpacing] = useState(8);
  const [verticalSpacing, setVerticalSpacing] = useState(35);
  // Axes Variables
  const [nodeAxesRadius, setNodeAxesRadius] = useState(15);
  const [horizontalAxesSpacing, setHorizontalAxesSpacing] = useState(3);
  const [verticalAxesSpacing, setVerticalAxesSpacing] = useState(35);

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
      reloadPage();
    };

    window.addEventListener('resize', handleResize);
    // handleResize(); // Set initial dimensions
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const reloadPage = () => {
    location.reload();
  };

  // Constellations
  useEffect(() => {
    if (!constellations || constellations.length === 0) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;

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
        node.schoolAttributes = findSchoolAttributesById(
          constellations[0],
          node._id
        );
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
  }, [constellations, dimensions, horizontalSpacing]);

  useEffect(() => {
    if (dimensions.width < 1024) {
      editShowExperience(false);
    } else if (dimensions.width < 1100) {
      editShowExperience(true);
      setNodeTextSize(3);
      // cosntellations
      setNodeRadius(1);
      setHorizontalSpacing(20);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(18);
    } else if (dimensions.width < 1200) {
      editShowExperience(true);
      setNodeTextSize(3.5);
      // cosntellations
      setNodeRadius(1);
      setHorizontalSpacing(25);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(20);
    } else if (dimensions.width < 1300) {
      editShowExperience(true);
      setNodeTextSize(4);
      // cosntellations
      setNodeRadius(1);
      setHorizontalSpacing(27);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(22);
    } else if (dimensions.width < 1400) {
      editShowExperience(true);
      setNodeTextSize(3.8);
      // cosntellations
      setNodeRadius(1);
      setHorizontalSpacing(30);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(25);
    } else if (dimensions.width < 1500) {
      editShowExperience(true);
      setNodeTextSize(4.5);
      // cosntellations
      setNodeRadius(17);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(27);
    } else if (dimensions.width < 1600) {
      editShowExperience(true);
      setNodeTextSize(5);
      // cosntellations
      setNodeRadius(18);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(28);
    } else if (dimensions.width < 1700) {
      editShowExperience(true);
      setNodeTextSize(5);
      // cosntellations
      setNodeRadius(19);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(30);
    } else if (dimensions.width < 1800) {
      editShowExperience(true);
      setNodeTextSize(5.3);
      // cosntellations
      setNodeRadius(20);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(33);
    } else if (dimensions.width < 1900) {
      editShowExperience(true);
      setNodeTextSize(5.5);
      // cosntellations
      setNodeRadius(21);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(35);
    } else {
      editShowExperience(true);
      setNodeTextSize(6);
      // cosntellations
      setNodeRadius(23);
      setHorizontalSpacing(0);
      //axes
      setNodeAxesRadius(1);
      setHorizontalAxesSpacing(37);
    }
  }, [dimensions]);

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
        node.knowledgeAxes = findSchoolAttributesById(axes[0], node._id);
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

      // Adjust X position if node has no children to be aligned centered with the parent/s
      nodes.forEach((node) => {
        const parents = parentMap.get(node._id);
        if (!node.children) {
          const averageX =
            parents.reduce((acc, parent) => acc + parent.x, 0) / parents.length;

          node.x = averageX;
        }
      });

      nodes.forEach((n, i) => {
        if (n.title === 'Specialization in Interior Architecture') {
          n.x -= 30;
        }
        if (n.title === 'Specialization in Rehabilitation') {
          n.x += 30;
        }
      });

      return { nodes, links };
    };

    // Assume `axes` is an array, and we need to handle the first item
    const { nodes, links } = createAxesTree(axes[0]);

    const uniqueNodes = [...new Set(nodes)];

    const uniqueLinks = [...new Set(links)];

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
  }, [axes, dimensions, horizontalAxesSpacing]);

  // Create ALL External Connections
  useEffect(() => {
    if (constellationsNodes.length <= 0 || axesNodes.length <= 0) return;
    const newExternalNodes = [...externalNodes];

    if (externalNodes.length <= 0) {
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

        // Get School Attributes
        const sa = findSchoolAttributesById(constellationsNodes[0], item1._id);

        // Get Knowledge Axes
        const ka = findSchoolAttributesById(axesNodes[0], item2._id);

        // Get Training cycle
        let cat;
        if (item1?.category) {
          cat = item1.category;
        } else if (item2?.category) {
          cat = item2.category;
        }

        const newExternal = {
          category: cat,
          schoolAttributes: sa,
          knowledgeAxes: ka,
          id1: item1._id,
          id2: item2._id,
          x1: item1.x,
          y1: item1.y + verticalSpacing / 2,
          x2: item2.x,
          y2: item2.y,
          cx: (item1.x + item2.x) / 2, // Midpoint control point for curve
          cy: (item1.y + item2.y) / 2 - pos, // Adjust control point for curvature
          show: false,
        };
        newExternalNodes.push(newExternal);
      });
    }
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

    changeColorNodes(ids, uniqueArray);

    // if there are no active constellations, everything reset to BLACK
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

  useEffect(() => {
    let ids = [];
    activeConst.forEach((c, i) => {
      const allIds = extractIds(c);
      ids = ids.concat(allIds);
    });

    // Determine if `firstArray` is empty
    const shouldUpdateShow = ids.length > 0;

    const newExternalNodes = externalNodes.map((item) => ({
      ...item,
      show: true,
    }));

    // Iterate over the second array and update the `show` property based on the condition
    const updatedArrayExternalNodes = newExternalNodes.map((item) => {
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
    const uniqueArrayExternalNodes = [...new Set(updatedArrayExternalNodes)];

    const updatedArray = uniqueArrayExternalNodes.map((item) => {
      if (item.show) {
        if (activeFilters.length > 0) {
          const shouldShow =
            activeFilters.includes(item.category) ||
            activeFilters.includes(item.schoolAttributes) ||
            activeFilters.includes(item.knowledgeAxes);

          return {
            ...item,
            show: shouldShow,
          };
        } else {
          return item;
        }
      }
      return item;
    });
    const uniqueArray = [...new Set(updatedArray)];
    setExternalNodes(uniqueArray);

    changeColorNodes(ids, uniqueArray);
  }, [activeFilters]);

  const findSchoolAttributesById = (obj, id) => {
    const findInChildren = (node, id) => {
      if (node._id === id) {
        return node; // Found the item with the same id
      }

      if (node.children && node.children.length > 0) {
        for (let child of node.children) {
          const result = findInChildren(child, id);
          if (result) return result;
        }
      }

      return null; // Not found in this node
    };

    // Iterate over the top-level constellations (like Internationalization, Transversality, ...)
    for (let node of obj.children) {
      const foundNode = findInChildren(node, id);
      if (foundNode) {
        return node._id; // Return the second-level node (like "Internationalization", "Transversality", ...)
      }
    }

    return null; // Not found in any second-level node
  };

  // Function to change color (black or lightgray) for each node
  const changeColorNodes = (ids, newExternalNodes) => {
    // Create a temporary array, adding selectedId to the existing selectedNodes state
    let tempSelectedNodes = [...ids];

    ids.forEach((id) => {
      tempSelectedNodes.push(id);
      newExternalNodes.forEach((en) => {
        if (id === en.id1) {
          tempSelectedNodes.push(en.id1);
          tempSelectedNodes.push(en.id2);
        } else if (id === en.id2) {
          tempSelectedNodes.push(en.id1);
          tempSelectedNodes.push(en.id2);
        }
      });
    });

    if (tempSelectedNodes.length <= 1) return;

    const uniqueArray = [...new Set(tempSelectedNodes)];

    // Update colors
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

  // Handle Click -- Add to Active Constellations
  const handleClick = (_node) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        // Handle single click logic here
        const item = {
          title: _node.title,
          _id: _node._id,
          children: _node.children,
          schoolAttributes: _node.schoolAttributes,
        };

        const allIds = extractIds(item);

        const hasMatchingId = checkIds(allIds, externalNodes);
        if (hasMatchingId) addToActiveConst(item);

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
      {showExperience && (
        <>
          <div ref={ref} className={styles.svg}>
            <TransformWrapper
              ref={transformWrapperRef}
              doubleClick={{ disabled: true }}
              className={styles.svg__wrapper}
              maxScale={2}
              onZoom={(e) => {
                const newZoomLevel = e.state.scale;
                editScaleZoom(newZoomLevel); // Update the zoom level
              }}
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
                            (link.parent.y +
                              verticalSpacing / 2 +
                              link.child.y) /
                            2
                          }
                          className={styles.svg__line}
                        />
                        <line
                          x1={link.parent.x}
                          y1={
                            (link.parent.y +
                              verticalSpacing / 2 +
                              link.child.y) /
                            2
                          }
                          x2={link.child.x}
                          y2={
                            (link.parent.y +
                              verticalSpacing / 2 +
                              link.child.y) /
                            2
                          }
                          className={styles.svg__line}
                        />
                        <line
                          x1={link.child.x}
                          y1={
                            (link.parent.y +
                              verticalSpacing / 2 +
                              link.child.y) /
                            2
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
                      const randomColor =
                        colors[Math.floor(index % colors.length)];

                      const textLines = splitTextIntoLines(node.title, 13, 3);
                      return (
                        <g key={index}>
                          <Node
                            node={node}
                            index={index}
                            verticalSpacing={verticalSpacing}
                            textLines={textLines}
                            textColor={node.color}
                            textSize={nodeTextSize}
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
                            fontSize={nodeTextSize}
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
                    {axesLinks.map((link, index) => {
                      // Split the title into an array of words based on spaces and filter out any empty strings
                      const wordArray = link.child.title
                        .split(/\s+/)
                        .filter(Boolean);
                      // Count the number of words
                      const wordCount = wordArray.length;
                      const lineSpace =
                        wordCount <= 1 ? 15 : wordCount === 2 ? 30 : 30;
                      // const lineSpace = 30;
                      return (
                        <g key={`axes-${index}`}>
                          <line
                            x1={link.parent.x}
                            y1={link.parent.y + verticalAxesSpacing / 2 - 15}
                            x2={link.child.x}
                            y2={link.child.y + lineSpace}
                            className={styles.svg__line}
                          />
                        </g>
                      );
                    })}
                    {/* Render nodes */}
                    {axesNodes.map((node, index) => {
                      // Select a random color from the array
                      const randomColor =
                        colors[Math.floor(index % colors.length)];
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
                            textSize={nodeTextSize}
                            verticalSpacing={verticalAxesSpacing}
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
        </>
      )}

      {!showExperience && (
        <div className={styles.about__content}>
          <PortableText value={about[0].en} />
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
  verticalSpacing,
  textLines,
  textSize,
  bgColor,
  textColor,
  handleClick,
  handleDoubleClick,
}) => {
  const [textSizes, setTextSizes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RectNode
        bgColor={bgColor}
        maxWidth={maxTextWidth}
        maxHeight={textHeight}
        length={textLines.length}
        x={node.x}
        y={node.y}
        hover={isHovered}
      />
      {textLines.map((word, i) => {
        return (
          <TextNode
            key={i}
            i={i}
            text={word}
            nodeTextSize={textSize}
            textColor={textColor}
            x={node.x}
            y={node.y + (verticalSpacing / 4 + 7 * i)}
            styles={styles}
            updateTextSize={updateTextSize}
          />
        );
      })}
    </g>
  );
};

const TextNode = ({
  text,
  x,
  y,
  i,
  nodeTextSize,
  textColor,
  styles,
  updateTextSize,
}) => {
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
        fontSize={`${nodeTextSize}px`}
      >
        {text}
      </text>
    </g>
  );
};

const RectNode = ({ bgColor, maxWidth, maxHeight, x, y, hover, length }) => {
  return (
    <rect
      width={maxWidth + 5} // Add some padding
      height={maxHeight + 5} // Adjust height based on your needs
      x={x - maxWidth / 2 - 2.5} // Adjust x position if needed
      y={y + maxHeight / 2 - (length + length * 0.9)} // Adjust y position
      fill={bgColor}
      style={{
        opacity: hover ? 1 : 0,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
      }}
    />
  );
};
