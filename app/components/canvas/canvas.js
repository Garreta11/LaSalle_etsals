'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './canvas.module.scss';

import gsap from 'gsap';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { useData } from '@/app/DataContext';

// constellations variables
const nodeRadius = 20;
const horizontalSpacing = 1;
const verticalSpacing = 50;

// axes variables
const nodeAxesRadius = 4;
const horizontalAxesSpacing = 25;
const verticalAxesSpacing = 37;

const Canvas = ({ constellations, axes }) => {
  //Context
  const { activeConst, addToActiveConst } = useData();

  // Constellations
  const [constellationsNodes, setConstellationsNodes] = useState([]);
  const [constellationsLinks, setConstellationsLinks] = useState([]);

  // Axes
  const [axesNodes, setAxesNodes] = useState([]);
  const [axesLinks, setAxesLinks] = useState([]);

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
        node.color = 'gray';
      };

      traverse(root);
      return { nodes, links };
    };

    // Assume `constellations` is an array, and we need to handle the first item
    const { nodes, links } = createTree(constellations[0]);
    setConstellationsNodes(nodes);
    setConstellationsLinks(links);
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
      const maxHeight = dimensions.height - 90;
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
            parentMap.get(child._id).push(existingNode);

            traverse(child);
          });
        }
        node.color = 'gray';
      };

      traverse(root);

      // Update X position for nodes with multiple parents
      nodes.forEach((node) => {
        const parents = parentMap.get(node._id);
        if (parents && parents.length > 1) {
          const averageX =
            parents.reduce((acc, parent) => acc + parent.x, 0) / parents.length;
          node.x = averageX;
          console.log(node.title, parents);
        }
      });

      return { nodes, links };
    };

    // Assume `axes` is an array, and we need to handle the first item
    const { nodes, links } = createAxesTree(axes[0]);

    // Move nodes with category "master" and "research" up one position Y
    nodes.forEach((node) => {
      if (node.category === 'master' || node.category === 'research') {
        node.y -= verticalAxesSpacing; // Move the node up
      }
    });

    setAxesNodes(nodes);
    setAxesLinks(links);

    // Move nodes with category "master" and "research" up one position Y
    nodes.forEach((node) => {
      if (node.category === 'master') {
        node.y -= verticalAxesSpacing; // Move the node up
      } else if (node.category === 'research') {
        node.y -= 2 * verticalAxesSpacing; // Move the node up
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
    categoriesPosition(nodes);
  }, [axes, dimensions]);

  // GSAP ANIMATION
  /* useEffect(() => {
    if (
      axesNodes.length === 0 ||
      axesLinks.length === 0 ||
      constellationsLinks.length === 0 ||
      constellationsNodes.length === 0
    )
      return;

    const textsAttributes = attributesSvgRef.current.querySelectorAll('text');
    gsap.fromTo(
      textsAttributes,
      {
        opacity: 0,
      },
      {
        duration: 0.3,
        opacity: 1,
        stagger: {
          each: 0.05,
          ease: 'power1.inOut',
        },
      }
    );
    const textsAaxes = axesSvgRef.current.querySelectorAll('text');
    gsap.fromTo(
      textsAaxes,
      {
        opacity: 0,
      },
      {
        duration: 0.3,
        opacity: 1,
        stagger: {
          each: 0.05,
          ease: 'power1.inOut',
        },
      }
    );
  }, [axesNodes, axesLinks, constellationsLinks, constellationsNodes]); */

  // Handle Click -- Add to Active Constellations
  const handleClick = (_node) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
    } else {
      const timeout = setTimeout(() => {
        console.log('Single click detected');
        // Handle single click logic here
        const item = { title: _node.title, id: _node._id };
        addToActiveConst(item);

        setClickTimeout(null);
      }, 300); // Wait 300ms to see if another click comes in
      setClickTimeout(timeout);
    }
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

  return (
    <div className={styles.canvas}>
      <div className={styles.svg}>
        <TransformWrapper
          doubleClick={{ disabled: true }}
          className={styles.svg__wrapper}
        >
          <TransformComponent className={styles.svg__wrapper__component}>
            <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
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
                  return (
                    <g
                      key={`constellations-${index}`}
                      onClick={() => handleClick(node)}
                      onDoubleClick={() => handleDoubleClick(node)}
                    >
                      {node.title?.split(' ').map((word, i) => {
                        return (
                          <text
                            key={i}
                            x={node.x}
                            y={node.y + (verticalSpacing / 4 + 7 * i)}
                            textAnchor='middle'
                            aria-label={node.title}
                            role='img'
                            className={
                              isSelected
                                ? `${styles.svg__text} ${styles.svg__text__active}`
                                : `${styles.svg__text}`
                            }
                          >
                            {word}
                          </text>
                        );
                      })}
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
                        x={40}
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
                      y1={link.parent.y + verticalAxesSpacing / 2 - 20}
                      x2={link.child.x}
                      y2={link.child.y + 20}
                      className={styles.svg__line}
                    />
                  </g>
                ))}
                {/* Render nodes */}
                {axesNodes.map((node, index) => {
                  const isSelected = node.color === 'black';
                  return (
                    <g
                      key={`axes-${index}`}
                      onDoubleClick={() => handleDoubleClick(node)}
                    >
                      {node.title?.split(' ').map((word, i) => {
                        return (
                          <text
                            data-category={`${node.category}`}
                            key={i}
                            x={node.x}
                            y={node.y + (verticalAxesSpacing / 3 + 7 * i)}
                            textAnchor='middle'
                            aria-label={node.title}
                            role='img'
                            className={
                              isSelected
                                ? `${styles.svg__text} ${styles.svg__text__active}`
                                : `${styles.svg__text}`
                            }
                          >
                            {word}
                          </text>
                        );
                      })}
                    </g>
                  );
                })}
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
};

export default Canvas;
