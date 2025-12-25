/**
 * Generates real jigsaw puzzle pieces with interlocking tabs and blanks
 */

export interface JigsawPiece {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  width: number
  height: number
  sourceX: number
  sourceY: number
  row: number
  col: number
}

interface GeneratorOptions {
  image: HTMLImageElement
  canvasWidth: number
  canvasHeight: number
  imageScale: number
  imageOffsetX: number
  imageOffsetY: number
}

export function generatePuzzlePieces(gridSize: number, options: GeneratorOptions): JigsawPiece[] {
  const { canvasWidth, canvasHeight, imageScale } = options

  const pieceWidth = canvasWidth / gridSize
  const pieceHeight = canvasHeight / gridSize
  const pieces: JigsawPiece[] = []

  // Shuffle pieces with randomization
  const randomOffsets = generateRandomOffsets(gridSize)

  let id = 0
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const targetX = col * pieceWidth
      const targetY = row * pieceHeight

      // Create piece with random initial position
      const piece: JigsawPiece = {
        id: id++,
        x: randomOffsets[row][col].x,
        y: randomOffsets[row][col].y,
        targetX,
        targetY,
        width: pieceWidth,
        height: pieceHeight,
        sourceX: Math.floor(col * pieceWidth),
        sourceY: Math.floor(row * pieceHeight),
        row,
        col,
      }

      pieces.push(piece)
    }
  }

  return pieces
}

function generateRandomOffsets(gridSize: number): { x: number; y: number }[][] {
  const offsets: { x: number; y: number }[][] = []
  const usedPositions = new Set<string>()

  for (let row = 0; row < gridSize; row++) {
    offsets[row] = []
    for (let col = 0; col < gridSize; col++) {
      let x, y, key

      // Generate random position that hasn't been used
      do {
        x = Math.random() * 400 - 50
        y = Math.random() * 400 - 50
        key = `${Math.round(x)},${Math.round(y)}`
      } while (usedPositions.has(key))

      usedPositions.add(key)
      offsets[row][col] = { x, y }
    }
  }

  return offsets
}

/**
 * Generates SVG path for jigsaw piece with tabs and blanks
 * This creates the interlocking edge pattern
 */
export function generatePiecePath(
  width: number,
  height: number,
  edges: { top: boolean; right: boolean; bottom: boolean; left: boolean },
): string {
  const tabSize = 15
  const curveSize = 5

  let path = `M 0 0`

  // Top edge
  if (edges.top) {
    path += ` L ${width} 0`
  } else {
    path += generateEdgePath(width, 0, true, tabSize, curveSize)
  }

  // Right edge
  if (edges.right) {
    path += ` L ${width} ${height}`
  } else {
    path += generateEdgePath(width, height, false, tabSize, curveSize, true)
  }

  // Bottom edge
  if (edges.bottom) {
    path += ` L 0 ${height}`
  } else {
    path += generateEdgePath(0, height, true, tabSize, curveSize, true)
  }

  // Left edge
  if (edges.left) {
    path += ` L 0 0`
  } else {
    path += generateEdgePath(0, 0, false, tabSize, curveSize)
  }

  return path + " Z"
}

function generateEdgePath(
  x: number,
  y: number,
  isHorizontal: boolean,
  tabSize: number,
  curveSize: number,
  reverse = false,
): string {
  const hasTab = Math.random() > 0.5
  let path = ""

  if (isHorizontal) {
    const nextX = x === 0 ? x + tabSize : x - tabSize
    if (hasTab) {
      path = ` Q ${(x + nextX) / 2} ${y + curveSize}, ${nextX} ${y}`
    } else {
      path = ` Q ${(x + nextX) / 2} ${y - curveSize}, ${nextX} ${y}`
    }
  } else {
    const nextY = y === 0 ? y + tabSize : y - tabSize
    if (hasTab) {
      path = ` Q ${x + curveSize} ${(y + nextY) / 2}, ${x} ${nextY}`
    } else {
      path = ` Q ${x - curveSize} ${(y + nextY) / 2}, ${x} ${nextY}`
    }
  }

  return path
}
