import React from 'react';
import './data-panel.scss';

const DataPanel = (props: any) => (
    <div className='panel-container'>
      {
          props.map
      }
    </div>
);

export default DataPanel;