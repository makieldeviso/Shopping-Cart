import PropTypes from 'prop-types'

import Icon from '@mdi/react';
import { 
  mdiTrashCanOutline,
  mdiPencilOutline,
  mdiAccountOutline,
  mdiStorefrontOutline,
  mdiCartOutline,
  mdiClose,
  mdiCheck,
  mdiMapMarkerOutline  
} from '@mdi/js';

const NewIcon = function ({assignClass}) {
  let assignPath;
  switch (assignClass) {
    case 'delete':
      assignPath = mdiTrashCanOutline;
      break;
  
    case 'edit':
      assignPath = mdiPencilOutline;
      break;

    case 'close':
      assignPath = mdiClose;
      break;

    case 'check':
      assignPath = mdiCheck;
      break;

    case 'location':
      assignPath = mdiMapMarkerOutline;
      break;

    case 'profile':
      assignPath = mdiAccountOutline;
      break;

    case 'shop':
      assignPath = mdiStorefrontOutline;
      break;
    
    case 'cart':
      assignPath = mdiCartOutline;
      break;
  
    default:
      console.log('path not found')
      break;
  }

  const iconProps = {
    style: {pointerEvents: 'none'},
    className: assignClass ? `${assignClass}-icon`: '',
    path: assignPath
  }

  return (
    <Icon {...iconProps}/>
  )
}

NewIcon.propTypes = {
  assignClass: PropTypes.string
}



export { NewIcon }