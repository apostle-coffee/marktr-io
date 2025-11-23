/**
 * Test Figma API Connection
 */

const FIGMA_TOKEN = 'figd_Vu1v5uFwReR4DzcQvPfX3GeW5YvtrpwxdK8JOI24'
const FIGMA_FILE_ID = 'BzsxHUCZe6uAbfKl6smMLv'

async function testFigmaConnection() {
  try {
    console.log('Testing Figma API connection...')
    console.log(`File ID: ${FIGMA_FILE_ID}`)
    
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('Error response:', JSON.stringify(data, null, 2))
      console.error(`Status: ${response.status} ${response.statusText}`)
      return
    }

    console.log('Success! File structure:')
    console.log('Document name:', data.name)
    console.log('Last modified:', data.lastModified)
    console.log('\nPages:')
    
    if (data.document && data.document.children) {
      data.document.children.forEach((page: any, index: number) => {
        console.log(`  ${index + 1}. ${page.name} (${page.type})`)
        if (page.children) {
          page.children.forEach((frame: any) => {
            if (frame.type === 'FRAME') {
              console.log(`     - ${frame.name} (Frame)`)
            }
          })
        }
      })
    }

    // Save full response for inspection
    const fs = await import('fs')
    fs.writeFileSync('figma-response.json', JSON.stringify(data, null, 2))
    console.log('\nFull response saved to figma-response.json')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testFigmaConnection()

