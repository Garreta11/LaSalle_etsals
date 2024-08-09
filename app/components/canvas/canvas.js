'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './canvas.module.scss';

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import { useData } from '@/app/DataContext';

const nodeRadius = 20;
const horizontalSpacing = 1;
const verticalSpacing = 50;

const Canvas = ({ constellations, axes }) => {
  //Context
  const { activeConst, addToActiveConst } = useData();

  // Constellations
  const [constellationsNodes, setConstellationsNodes] = useState([]);
  const [constellationsLinks, setConstellationsLinks] = useState([]);

  // Dimensions
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [clickTimeout, setClickTimeout] = useState(null);
  const [info, setInfo] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoDesc, setInfoDesc] = useState('');

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
      node.y = depth * verticalSpacing;
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
    console.log(axes);
  }, [axes, dimensions]);

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

  const handleDoucleClick = (_node) => {
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
                    key={`axes-${index}`}
                    onClick={() => handleClick(node)}
                    onDoubleClick={() => handleDoucleClick(node)}
                  >
                    {node.title?.split(' ').map((word, i) => {
                      return (
                        <text
                          key={i}
                          x={node.x}
                          y={node.y + (verticalSpacing / 3 + 7 * i)}
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

              {/* === AXES TREE === */}
              <g className={styles.svg__categories}>
                <text x={40} y={dimensions.height / 2}>
                  Research
                </text>
                <text x={40} y={dimensions.height / 2 + 50}>
                  Master
                </text>
                <text x={40} y={dimensions.height / 2 + 100}>
                  2nd Cycle
                </text>
                <text x={40} y={dimensions.height / 2 + 150}>
                  1st Cycle
                </text>
                <text x={40} y={dimensions.height / 2 + 250}>
                  Training Cycles
                </text>
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
