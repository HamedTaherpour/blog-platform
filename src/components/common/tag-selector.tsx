'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface TagSelectorProps {
  tags: string[];
  selectedTag?: string;
}

const TagSelector = ({ tags, selectedTag }: TagSelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedTag === tag) {
      // Remove tag filter
      params.delete('tag');
    } else {
      // Set new tag filter
      params.set('tag', tag);
    }
    
    // Reset to first page when changing filters
    params.delete('page');
    
    const query = params.toString();
    router.push(`/?${query}`);
  };

  if (tags.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No tags available</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 20).map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? 'default' : 'secondary'}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagSelector;
