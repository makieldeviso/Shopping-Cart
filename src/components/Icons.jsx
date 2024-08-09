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
  mdiMapMarkerOutline,
  mdiCubeSend,
  mdiPackageVariant,
  mdiTruckOutline,
  mdiBorderNoneVariant,
  mdiTruckFastOutline,
  mdiPackageVariantClosedCheck,
  mdiMinus 
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
    
    case 'line':
      assignPath = mdiMinus;
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

    case 'send':
      assignPath = mdiCubeSend;
      break;
    
    case 'deliver':
      assignPath = mdiTruckFastOutline;
      break;
    
    case 'delivered':
      assignPath = mdiPackageVariantClosedCheck;
      break;

    case 'shop':
      assignPath = mdiStorefrontOutline;
      break;
    
    case 'cart':
      assignPath = mdiCartOutline;
      break;

    case 'box-empty':
      assignPath = mdiPackageVariant;
      break;

    case 'truck-empty':
      assignPath = mdiTruckOutline;
      break;
    
    case 'empty':
      assignPath = mdiBorderNoneVariant;
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