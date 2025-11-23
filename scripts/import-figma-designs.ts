/**
 * Comprehensive Figma Import Script
 * Handles importing designs from Figma and converting to React components
 */

const FIGMA_TOKEN = 'figd_Vu1v5uFwReR4DzcQvPfX3GeW5YvtrpwxdK8JOI24'
const FIGMA_FILE_ID = 'BzsxHUCZe6uAbfKl6smMLv'

interface FigmaNode {
  id: string
  name: string
  type: string
  children?: FigmaNode[]
  absoluteBoundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  fills?: any[]
  strokes?: any[]
  effects?: any[]
  style?: any
  characters?: string
  style?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    lineHeightPx?: number
    letterSpacing?: number
  }
}

async function fetchFigmaFileWithRetry(fileId: string, token: string, retries = 3) {
  const endpoints = [
    `https://api.figma.com/v1/files/${fileId}`,
    `https://api.figma.com/v1/files/${fileId}?depth=1`,
    `https://api.figma.com/v1/files/${fileId}?geometry=paths`,
  ]

  for (const endpoint of endpoints) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(endpoint, {
          headers: { 'X-Figma-Token': token },
        })

        const data = await response.json()

        if (response.ok && !data.err) {
          return data
        }

        if (data.err && !data.err.includes('File type not supported')) {
          console.error(`Error: ${data.err}`)
          break
        }
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error)
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }
  }

  throw new Error('Could not fetch file. Please verify: 1) File is shared with your account, 2) File is a Design file (not FigJam), 3) File key is correct')
}

async function extractDesignTokens(file: any) {
  const tokens = {
    colors: new Map<string, string>(),
    typography: {
      fonts: new Set<string>(),
      sizes: new Set<number>(),
      weights: new Set<number>(),
    },
    spacing: new Set<number>(),
    borderRadius: new Set<number>(),
  }

  function traverse(node: any) {
    // Extract colors
    if (node.fills) {
      node.fills.forEach((fill: any) => {
        if (fill.type === 'SOLID' && fill.color) {
          const color = `rgba(${Math.round(fill.color.r * 255)}, ${Math.round(fill.color.g * 255)}, ${Math.round(fill.color.b * 255)}, ${fill.opacity || 1})`
          const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b)
          tokens.colors.set(hex, color)
        }
      })
    }

    // Extract typography
    if (node.style) {
      if (node.style.fontFamily) tokens.typography.fonts.add(node.style.fontFamily)
      if (node.style.fontSize) tokens.typography.sizes.add(node.style.fontSize)
      if (node.style.fontWeight) tokens.typography.weights.add(node.style.fontWeight)
    }

    // Extract spacing (from absoluteBoundingBox)
    if (node.absoluteBoundingBox && node.children) {
      node.children.forEach((child: any) => {
        if (child.absoluteBoundingBox) {
          const spacing = Math.abs(child.absoluteBoundingBox.x - node.absoluteBoundingBox.x)
          if (spacing > 0) tokens.spacing.add(Math.round(spacing))
        }
      })
    }

    // Extract border radius
    if (node.cornerRadius) {
      tokens.borderRadius.add(node.cornerRadius)
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  if (file.document) {
    traverse(file.document)
  }

  return tokens
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function findFrames(node: any, frames: any[] = []): any[] {
  if (node.type === 'FRAME' || node.type === 'COMPONENT') {
    frames.push({
      id: node.id,
      name: node.name,
      type: node.type,
      absoluteBoundingBox: node.absoluteBoundingBox,
    })
  }

  if (node.children) {
    node.children.forEach((child: any) => findFrames(child, frames))
  }

  return frames
}

async function importFigmaDesigns() {
  try {
    console.log('🚀 Starting Figma import...')
    console.log(`File ID: ${FIGMA_FILE_ID}\n`)

    // Fetch file
    console.log('📥 Fetching file from Figma API...')
    const file = await fetchFigmaFileWithRetry(FIGMA_FILE_ID, FIGMA_TOKEN)
    
    console.log('✅ File fetched successfully!')
    console.log(`File name: ${file.name}`)
    console.log(`Last modified: ${file.lastModified}\n`)

    // Extract design tokens
    console.log('🎨 Extracting design tokens...')
    const tokens = await extractDesignTokens(file)
    
    console.log('\n📊 Design Tokens Found:')
    console.log(`Colors: ${tokens.colors.size}`)
    console.log(`Fonts: ${Array.from(tokens.typography.fonts).join(', ')}`)
    console.log(`Font sizes: ${Array.from(tokens.typography.sizes).sort((a, b) => a - b).join(', ')}px`)
    console.log(`Spacing values: ${Array.from(tokens.spacing).sort((a, b) => a - b).join(', ')}px`)
    console.log(`Border radius: ${Array.from(tokens.borderRadius).join(', ')}px\n`)

    // Find all frames
    console.log('🔍 Finding frames...')
    const frames = findFrames(file.document)
    console.log(`Found ${frames.length} frames:\n`)
    
    frames.forEach((frame, index) => {
      console.log(`${index + 1}. ${frame.name} (${frame.type})`)
    })

    // Save file structure
    const fs = await import('fs')
    fs.writeFileSync('figma-file-structure.json', JSON.stringify(file, null, 2))
    console.log('\n💾 Full file structure saved to figma-file-structure.json')

    // Save tokens
    const tokensData = {
      colors: Array.from(tokens.colors.entries()).map(([hex, rgba]) => ({ hex, rgba })),
      typography: {
        fonts: Array.from(tokens.typography.fonts),
        sizes: Array.from(tokens.typography.sizes).sort((a, b) => a - b),
        weights: Array.from(tokens.typography.weights).sort((a, b) => a - b),
      },
      spacing: Array.from(tokens.spacing).sort((a, b) => a - b),
      borderRadius: Array.from(tokens.borderRadius).sort((a, b) => a - b),
    }
    fs.writeFileSync('figma-design-tokens.json', JSON.stringify(tokensData, null, 2))
    console.log('💾 Design tokens saved to figma-design-tokens.json')

    return { file, frames, tokens }

  } catch (error: any) {
    console.error('\n❌ Error importing from Figma:')
    console.error(error.message)
    console.error('\n💡 Troubleshooting tips:')
    console.error('1. Verify the file is shared with your account')
    console.error('2. Check that the file is a Design file (not FigJam)')
    console.error('3. Ensure the file key in the URL matches the one provided')
    console.error('4. Try opening the file in Figma and checking file settings')
    process.exit(1)
  }
}

importFigmaDesigns()

