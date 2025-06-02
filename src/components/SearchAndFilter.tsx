import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { Playlist } from '../types';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    category?: string;
    tags: string[];
    sortBy: 'name' | 'date' | 'playCount';
    sortOrder: 'asc' | 'desc';
  }) => void;
  playlists: Playlist[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFilterChange,
  playlists,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'playCount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Get unique categories and tags from playlists
  const categories = Array.from(
    new Set(playlists.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );
  const tags = Array.from(
    new Set(playlists.flatMap((p) => p.tags))
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({
      category,
      tags: selectedTags,
      sortBy,
      sortOrder,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    onFilterChange({
      category: selectedCategory,
      tags: newTags,
      sortBy,
      sortOrder,
    });
  };

  const handleSortChange = (newSortBy: 'name' | 'date' | 'playCount') => {
    setSortBy(newSortBy);
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      sortBy: newSortBy,
      sortOrder,
    });
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      sortBy,
      sortOrder: newOrder,
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSortBy('date');
    setSortOrder('desc');
    onFilterChange({
      category: '',
      tags: [],
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search playlists and tracks..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={handleFilterClick}
          color={selectedCategory || selectedTags.length > 0 ? 'primary' : 'default'}
        >
          <FilterIcon />
        </IconButton>
      </Box>

      {(selectedCategory || selectedTags.length > 0) && (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {selectedCategory && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => handleCategoryChange('')}
            />
          )}
          {selectedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleTagToggle(tag)}
            />
          ))}
          <Chip
            label="Clear All"
            onClick={clearFilters}
            color="primary"
            variant="outlined"
          />
        </Stack>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 1 }}>Categories</Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryChange(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 1 }}>Tags</Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagToggle(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 1 }}>Sort By</Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Name"
                onClick={() => handleSortChange('name')}
                color={sortBy === 'name' ? 'primary' : 'default'}
              />
              <Chip
                label="Date"
                onClick={() => handleSortChange('date')}
                color={sortBy === 'date' ? 'primary' : 'default'}
              />
              <Chip
                label="Play Count"
                onClick={() => handleSortChange('playCount')}
                color={sortBy === 'playCount' ? 'primary' : 'default'}
              />
              <Chip
                label={sortOrder === 'asc' ? '↑' : '↓'}
                onClick={handleSortOrderToggle}
                color="primary"
              />
            </Stack>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SearchAndFilter; 