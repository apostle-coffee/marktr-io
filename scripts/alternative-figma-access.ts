/**
 * Alternative methods to access Figma file data
 */

const FIGMA_TOKEN = 'figd_Vu1v5uFwReR4DzcQvPfX3GeW5YvtrpwxdK8JOI24'
const FIGMA_FILE_ID = 'BzsxHUCZe6uAbfKl6smMLv'

async function tryAlternativeAccess() {
  console.log('Trying alternative methods to access Figma file...\n')

  // Method 1: Try accessing through file browser (if available)
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}/nodes?ids=0:0`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    })
    const data = await response.json()
    if (!data.err) {
      console.log('✅ Success via nodes endpoint!')
      return data
    }
  } catch (e) {
    console.log('❌ Nodes endpoint failed')
  }

  // Method 2: Try getting file comments (sometimes works when file endpoint doesn't)
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}/comments`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    })
    const data = await response.json()
    if (!data.err) {
      console.log('✅ File exists (comments endpoint works)')
      console.log('This confirms the file is accessible, just not via /files endpoint')
    }
  } catch (e) {
    console.log('❌ Comments endpoint also failed')
  }

  // Method 3: Try accessing through projects
  try {
    // First get teams
    const teamsResponse = await fetch('https://api.figma.com/v1/teams', {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    })
    const teams = await teamsResponse.json()
    console.log('Teams response:', teams)
  } catch (e) {
    console.log('Could not access teams')
  }

  console.log('\n💡 Recommendation:')
  console.log('Since the standard API endpoint is blocked, please:')
  console.log('1. Export design tokens from Figma (if available)')
  console.log('2. Or share key design values (colors, fonts, spacing)')
  console.log('3. Or tell me which frame to start with and I\'ll build it manually')
}

tryAlternativeAccess()

