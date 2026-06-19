import { Achievement, Blog, Project, Video, ExperienceItem, PublicationItem } from '@/lib/types'
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
      projectsName
        .filter((name) => name.endsWith('.json') && name !== 'pinned.json')
        .map(async (projectName) => {
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

const getPinnedSlugs = async (): Promise<string[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/projects/pinned.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    return []
  }
}

const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const projects = await getAllProjects()
  return projects.find((project) => project.slug === slug)
}

const readBlogFile = async (filePath: string): Promise<Blog> => {
  const blogData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(blogData)
}

const getAllBlogs = async (): Promise<Blog[]> => {
  try {
    const blogsPath = path.join(process.cwd(), '/content/blog')
    const blogsName = await fs.readdir(blogsPath).catch(() => [])

    const blogs = await Promise.all(
      blogsName
        .filter(name => name.endsWith('.json'))
        .map(async (blogName) => {
          const filePath = path.join(blogsPath, blogName)
          const blogDetails = await readBlogFile(filePath)
          return blogDetails
        }),
    )

    blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return blogs
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

const getBlogBySlug = async (slug: string): Promise<Blog | undefined> => {
  const blogs = await getAllBlogs()
  return blogs.find((blog) => blog.slug === slug)
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

const getExperiences = async (): Promise<ExperienceItem[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/experience/experience.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

const getPublications = async (): Promise<PublicationItem[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/publications/publications.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error fetching publications:', error)
    return []
  }
}

export { getAllProjects, getAchievements, getProjectBySlug, getVideos, getAllBlogs, getBlogBySlug, getExperiences, getPublications, getPinnedSlugs }
