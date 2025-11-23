/**
 * List Figma Files
 */

const FIGMA_TOKEN = 'figd_Vu1v5uFwReR4DzcQvPfX3GeW5YvtrpwxdK8JOI24'

async function listFigmaFiles() {
  try {
    // Get user info
    const userResponse = await fetch('https://api.figma.com/v1/me', {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    })
    const user = await userResponse.json()
    console.log('User:', user.email)
    console.log('User ID:', user.id)
    console.log('\n')

    // Try to get teams
    try {
      const teamsResponse = await fetch(`https://api.figma.com/v1/teams`, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN },
      })
      const teams = await teamsResponse.json()
      console.log('Teams:', JSON.stringify(teams, null, 2))
    } catch (e) {
      console.log('Could not fetch teams')
    }

    // Try to get projects for the user
    try {
      const projectsResponse = await fetch(`https://api.figma.com/v1/teams/${user.team_id}/projects`, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN },
      })
      const projects = await projectsResponse.json()
      console.log('Projects:', JSON.stringify(projects, null, 2))
    } catch (e) {
      console.log('Could not fetch projects (might need team_id)')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

listFigmaFiles()

