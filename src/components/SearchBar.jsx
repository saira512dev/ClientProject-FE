import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';

const SearchBar = ({handleSearchQuery} ) => {
    return (
        <div className="searchBar" display="flex" >
            <Input  onKeyPress={handleSearchQuery} />
            <SearchIcon />
        </div>
    )
}

export default SearchBar