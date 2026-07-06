const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/

/** Extracts the 11-character YouTube video ID from any common URL format. */
export function getYouTubeId(url: string): string | null {
  if (!url)
    return null
  const match = url.match(YOUTUBE_ID_REGEX)
  return match?.[1] ?? null
}

/** Returns the privacy-enhanced embed URL, or null if not a YouTube URL. */
export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
