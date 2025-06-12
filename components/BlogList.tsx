import React, { useState, useMemo } from 'react'
import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  shortTitle: string
  date: string
  tags: string[]
}

const blogPosts: BlogPost[] = [
  {
    slug: 'blog20250106',
    title: 'ブランド・ポジショニング戦略の構築',
    shortTitle: 'ブランド戦略',
    date: '2025-01-06',
    tags: ['企業分析', 'ブランド', 'マーケティング']
  },
  {
    slug: 'blog20250105',
    title: '財務諸表分析の手法と実践',
    shortTitle: '財務分析手法',
    date: '2025-01-05',
    tags: ['企業分析', '財務', 'ROE']
  }
]

const BlogList: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  }, [])

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(post => {
        if (selectedTags.length === 0) return true
        return selectedTags.some(tag => post.tags.includes(tag))
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedTags])

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag])
    } else {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          {allTags.map((tag, index) => (
            <span key={tag}>
              <label className="flex items-center space-x-2 inline-flex">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={(e) => handleTagChange(tag, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{tag}</span>
              </label>
              {index < allTags.length - 1 && <span style={{marginRight: '16px'}}></span>}
            </span>
          ))}
        </div>
        
        <div className="py-2">
          <hr className="border-gray-200" />
        </div>
      </div>

      <div className="space-y-2">
        {filteredPosts.map(post => (
          <div key={post.slug}>
            <Link href={`/blogs/${post.slug}`} className="hover:text-blue-600 transition-colors">
              <span className="text-sm text-gray-500">{post.date}</span>
              <span className="mx-2">　</span>
              <span className="font-medium">{post.title}</span>
            </Link>
          </div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          選択したタグに一致する記事が見つかりませんでした。
        </div>
      )}
    </div>
  )
}

export default BlogList