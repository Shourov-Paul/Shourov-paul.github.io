import { Achievement, Project, Video } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

// Function to read project file
const readProjectFile = async (filePath: string): Promise<Project> => {
  const projectData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(projectData)
}

// Function to get all projects
const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projectsPath = path.join(process.cwd(), '/content/projects')
    const projectsName = await fs.readdir(projectsPath)

    const projects = await Promise.all(
      projectsName.map(async (projectName) => {
        const filePath = path.join(projectsPath, projectName)
        const projectDetails = await readProjectFile(filePath)
        return projectDetails
      }),
    )

    // Sort projects by priority
    projects.sort((a, b) => a.priority - b.priority)

    return projects
  } catch (error) {
    // Handle errors
    console.error('Error:', error)
    return []
  }
}



const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const projects = await getAllProjects()
  return projects.find((project) => project.slug === slug)
}

const getVideos = async (): Promise<Video[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/videos/videoq.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/achievements/certificates.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
}

export { getAllProjects, getAchievements, getProjectBySlug, getVideos }
