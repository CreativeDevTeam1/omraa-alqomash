import { createContext, useContext } from 'react'
import { content } from '../content'
import type { Content } from '../content'

export const ContentContext = createContext<Content>(content.en)

/** Current language's content. The language itself comes from the route. */
export const useContent = () => useContext(ContentContext)
