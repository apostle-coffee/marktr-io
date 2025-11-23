// Figma API client for importing designs
// Will be used to fetch frames and convert them to components

export interface FigmaFile {
  document: any
  components: any
  styles: any
}

export interface FigmaFrame {
  id: string
  name: string
  type: string
  children?: FigmaFrame[]
}

export async function fetchFigmaFile(
  fileId: string,
  token: string
): Promise<FigmaFile> {
  const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: {
      'X-Figma-Token': token,
    },
  })

  const data = await response.json()

  if (!response.ok || data.err) {
    if (data.err === 'File type not supported by this endpoint') {
      throw new Error(
        'File type not supported. Please ensure:\n' +
        '1. The file is a Design file (not FigJam)\n' +
        '2. The file is shared with your account\n' +
        '3. You have the correct file key from the Figma URL\n' +
        '4. The file is not in a restricted team'
      )
    }
    throw new Error(`Figma API error: ${data.err || response.statusText}`)
  }

  return data
}

export async function fetchFigmaImages(
  fileId: string,
  token: string,
  nodeIds: string[]
): Promise<Record<string, string>> {
  const ids = nodeIds.join(',')
  const response = await fetch(
    `https://api.figma.com/v1/images/${fileId}?ids=${ids}&format=png&scale=2`,
    {
      headers: {
        'X-Figma-Token': token,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.images
}

