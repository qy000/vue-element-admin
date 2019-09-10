import defaultSettings from '@/settings'

const title = defaultSettings.title || '3Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
