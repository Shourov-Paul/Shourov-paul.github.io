import { Achievement, Blog, Project, Video, ExperienceItem, PublicationItem, EducationItem } from '@/lib/types'
import { promises as fs } from 'fs'
import path from 'path'

// Function to read project file
const readProjectFile = async (filePath: string): Promise<Project> => {
  const projectData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(projectData)
}

// Helper to parse dates with Month (or Season) and Year to timestamps for sorting
export const parseDateStr = (dateStr?: string): number => {
  if (!dateStr) return 0
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    FALL: 8, AUTUMN: 8, SPRING: 2, SUMMER: 5, WINTER: 11
  }
  const clean = dateStr.trim().toUpperCase()
  const parts = clean.split(/[\s,/-]+/).filter(Boolean)
  for (let i = 0; i < parts.length; i++) {
    const token = parts[i].slice(0, 3)
    const fullToken = parts[i]
    const m = months[fullToken] !== undefined ? months[fullToken] : months[token]
    if (m !== undefined) {
      for (let j = 0; j < parts.length; j++) {
        const yr = parseInt(parts[j], 10)
        if (!isNaN(yr) && yr >= 1900 && yr <= 2100) {
          return new Date(yr, m, 1).getTime()
        }
      }
    }
  }
  const matchYears = clean.match(/\b(19\d\d|20\d\d)\b/g)
  if (matchYears) {
    const latestYear = Math.max(...matchYears.map((y) => parseInt(y, 10)))
    return new Date(latestYear, 0, 1).getTime()
  }
  const parsed = Date.parse(clean)
  return isNaN(parsed) ? 0 : parsed
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

    // Sort projects by year and month, latest first
    projects.sort((a, b) => parseDateStr(b.siteAge) - parseDateStr(a.siteAge))

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
    const achievements: Achievement[] = JSON.parse(fileContent)
    achievements.sort((a, b) => parseDateStr(b.date) - parseDateStr(a.date))
    return achievements
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
}

const getExperiences = async (): Promise<ExperienceItem[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/experience/experience.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const experiences: ExperienceItem[] = JSON.parse(fileContent)
    experiences.sort((a, b) => parseDateStr(b.period) - parseDateStr(a.period))
    return experiences
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

const getPublications = async (): Promise<PublicationItem[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/publications/publications.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const publications: PublicationItem[] = JSON.parse(fileContent)
    publications.sort((a, b) => {
      const yearB = parseInt(b.year || '0', 10)
      const yearA = parseInt(a.year || '0', 10)
      return yearB - yearA
    })
    return publications
  } catch (error) {
    console.error('Error fetching publications:', error)
    return []
  }
}

const getEducation = async (): Promise<EducationItem[]> => {
  try {
    const filePath = path.join(process.cwd(), '/content/education/education.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const education: EducationItem[] = JSON.parse(fileContent)
    education.sort((a, b) => parseDateStr(b.period) - parseDateStr(a.period))
    return education
  } catch (error) {
    console.error('Error fetching education:', error)
    return []
  }
}

export { getAllProjects, getAchievements, getProjectBySlug, getVideos, getAllBlogs, getBlogBySlug, getExperiences, getPublications, getPinnedSlugs, getEducation }
