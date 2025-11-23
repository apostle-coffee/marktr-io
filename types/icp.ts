export interface ICP {
  id: string
  name: string
  description?: string
  industry?: string
  companySize?: string
  location?: string
  painPoints?: string[]
  goals?: string[]
  budget?: string
  decisionMakers?: string[]
  techStack?: string[]
  challenges?: string[]
  opportunities?: string[]
  createdAt: string
  updatedAt: string
  userId: string
  collectionId?: string
}

export interface ICPGenerationRequest {
  industry?: string
  companySize?: string
  location?: string
  additionalContext?: string
}

