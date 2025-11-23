/**
 * Figma Import Script
 * 
 * This script helps import frames from Figma and convert them to React components.
 * 
 * Usage:
 * 1. Set FIGMA_TOKEN and FIGMA_FILE_ID in .env.local
 * 2. Run: npx tsx scripts/import-figma.ts [frame-name]
 */

import { fetchFigmaFile, fetchFigmaImages } from '../lib/figma'

async function importFigmaFrame(frameName: string) {
  const token = process.env.FIGMA_TOKEN
  const fileId = process.env.FIGMA_FILE_ID

  if (!token || !fileId) {
    console.error('Please set FIGMA_TOKEN and FIGMA_FILE_ID in .env.local')
    process.exit(1)
  }

  try {
    console.log(`Fetching Figma file: ${fileId}`)
    const file = await fetchFigmaFile(fileId, token)
    
    // Find the frame by name
    function findFrame(node: any, name: string): any {
      if (node.name === name && node.type === 'FRAME') {
        return node
      }
      if (node.children) {
        for (const child of node.children) {
          const found = findFrame(child, name)
          if (found) return found
        }
      }
      return null
    }

    const frame = findFrame(file.document, frameName)
    
    if (!frame) {
      console.error(`Frame "${frameName}" not found`)
      process.exit(1)
    }

    console.log(`Found frame: ${frame.name} (${frame.id})`)
    console.log('Frame structure:', JSON.stringify(frame, null, 2))
    
    // TODO: Convert frame to React component
    // This will be implemented based on the actual Figma structure
    
  } catch (error) {
    console.error('Error importing from Figma:', error)
    process.exit(1)
  }
}

const frameName = process.argv[2]
if (!frameName) {
  console.error('Please provide a frame name: npx tsx scripts/import-figma.ts [frame-name]')
  process.exit(1)
}

importFigmaFrame(frameName)

