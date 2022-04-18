import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';

export default function SortableTableHeader({title, sortKeyword, onSortChanged, currentSorting}) {
  const [asending, setAsending] = useState(true);
  const [sorted, setSorted] = useState(false);

  const getSortedIcon = (asending) => {
    if(asending) {
      return (<i className="bi bi-sort-up"></i>)
    }

    return (<i className="bi bi-sort-down"></i>)
  }
  
  useEffect(() => {
    if(currentSorting != null && currentSorting !== sortKeyword) {
      // clear sorting for current column
      setSorted(false);
      setAsending(true);
    }
  })
  

  const changeSort = () => {
    if(!sorted) {
      setSorted(true);
      onSortChanged(sortKeyword, asending);
      return;
    }

    const newAsending = !asending;
    setAsending(newAsending);
    onSortChanged(sortKeyword, newAsending);
  }

  return (
    <th style={{cursor: 'pointer'}}>
      
      <div onClick={changeSort}>
          <label style={{cursor: 'pointer'}}>{title}</label>
          {
            sorted &&
            getSortedIcon(asending)
          }
      </div>

    </th>
  )
}
